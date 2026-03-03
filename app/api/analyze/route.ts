import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SentimentRequest, SentimentResponse } from "@/lib/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function normalizeDistribution(
  distribution?: Partial<SentimentResponse["distribution"]>
) {
  const rawPositive = Number(distribution?.positive ?? 0);
  const rawMixed = Number(distribution?.mixed ?? 0);
  const rawNegative = Number(distribution?.negative ?? 0);

  const positive = Number.isFinite(rawPositive) ? Math.max(0, rawPositive) : 0;
  const mixed = Number.isFinite(rawMixed) ? Math.max(0, rawMixed) : 0;
  const negative = Number.isFinite(rawNegative) ? Math.max(0, rawNegative) : 0;

  const total = positive + mixed + negative;
  if (total === 0) {
    return { positive: 34, mixed: 33, negative: 33 };
  }

  let normPositive = Math.round((positive / total) * 100);
  let normMixed = Math.round((mixed / total) * 100);
  let normNegative = 100 - normPositive - normMixed;

  if (normNegative < 0) {
    normNegative = 0;
    normMixed = 100 - normPositive;
  }

  return {
    positive: normPositive,
    mixed: normMixed,
    negative: normNegative,
  };
}

function fallbackDistribution(classification: SentimentResponse["classification"]) {
  switch (classification) {
    case "Positive":
      return { positive: 78, mixed: 17, negative: 5 };
    case "Negative":
      return { positive: 9, mixed: 21, negative: 70 };
    default:
      return { positive: 33, mixed: 44, negative: 23 };
  }
}

function inferDistributionFromReviews(reviews: string[]): SentimentResponse["distribution"] {
  const positiveLexicon = [
    "masterpiece",
    "best",
    "outstanding",
    "triumph",
    "phenomenal",
    "brilliant",
    "groundbreaking",
    "classic",
    "must-watch",
    "remarkable",
    "exceptional",
  ];
  const negativeLexicon = [
    "disappointing",
    "waste of time",
    "worst",
    "boring",
    "terrible",
    "awful",
    "mess",
    "forgettable",
    "disaster",
    "painful",
    "subpar",
  ];
  const mixedLexicon = [
    "mixed bag",
    "has its moments",
    "not bad",
    "not great",
    "uneven",
    "for the most part",
    "could have been better",
    "though",
    "but",
    "however",
  ];

  let positive = 0;
  let mixed = 0;
  let negative = 0;

  for (const review of reviews) {
    const text = review.toLowerCase();
    const pScore = positiveLexicon.reduce((acc, token) => acc + (text.includes(token) ? 1 : 0), 0);
    const mScore = mixedLexicon.reduce((acc, token) => acc + (text.includes(token) ? 1 : 0), 0);
    const nScore = negativeLexicon.reduce((acc, token) => acc + (text.includes(token) ? 1 : 0), 0);

    if (pScore >= mScore && pScore >= nScore && pScore > 0) {
      positive += 1;
    } else if (nScore >= pScore && nScore >= mScore && nScore > 0) {
      negative += 1;
    } else {
      mixed += 1;
    }
  }

  return normalizeDistribution({
    positive,
    mixed,
    negative,
  });
}

function blendDistributions(
  model: SentimentResponse["distribution"],
  heuristic: SentimentResponse["distribution"],
  modelWeight = 0.7
) {
  const heuristicWeight = 1 - modelWeight;
  return normalizeDistribution({
    positive: model.positive * modelWeight + heuristic.positive * heuristicWeight,
    mixed: model.mixed * modelWeight + heuristic.mixed * heuristicWeight,
    negative: model.negative * modelWeight + heuristic.negative * heuristicWeight,
  });
}

function classifyFromDistribution(distribution: SentimentResponse["distribution"]) {
  const entries: Array<{ key: SentimentResponse["classification"]; value: number }> = [
    { key: "Positive", value: distribution.positive },
    { key: "Mixed", value: distribution.mixed },
    { key: "Negative", value: distribution.negative },
  ];

  entries.sort((a, b) => b.value - a.value);
  return entries[0].key;
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body: SentimentRequest = await request.json();
    const { reviews } = body;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: "Reviews array is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const reviewsText = reviews.map((r, i) => `${i + 1}. ${r}`).join("\n");

    const prompt = `Analyze the following movie audience reviews and return a strict sentiment report.

${reviewsText}

Requirements:
- Detect sentiment in 3 parts only: positive, mixed, negative.
- Provide a short, neutral summary of overall reception.
- Return key themes as concise phrases.
- Return integer percentages for positive, mixed, negative that sum exactly to 100.
- Set classification to the dominant sentiment among positive/mixed/negative.
- Set confidence as an integer from 0 to 100 based on consistency of sentiment in the reviews.
- If evidence is balanced or conflicting, choose "Mixed".
- Do not output 100/0/0 unless every review clearly has the same tone.

Return JSON only, with this exact schema:
{
  "summary": "3-5 sentences",
  "classification": "Positive | Mixed | Negative",
  "confidence": 0,
  "keyThemes": ["theme 1", "theme 2", "theme 3"],
  "distribution": {
    "positive": 0,
    "mixed": 0,
    "negative": 0
  }
}
Do not include markdown, comments, or extra text.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse sentiment analysis" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as Partial<SentimentResponse>;

    if (!parsed.summary) {
      return NextResponse.json(
        { error: "Invalid response format from Gemini" },
        { status: 500 }
      );
    }

    const validClassifications = ["Positive", "Mixed", "Negative"];
    let classification: SentimentResponse["classification"] = "Mixed";
    if (validClassifications.includes(parsed.classification ?? "")) {
      classification = parsed.classification as SentimentResponse["classification"];
    }

    const heuristicDistribution = inferDistributionFromReviews(reviews);
    const modelDistribution = parsed.distribution
      ? normalizeDistribution(parsed.distribution)
      : fallbackDistribution(classification);

    const distribution = blendDistributions(modelDistribution, heuristicDistribution);

    classification = classifyFromDistribution(distribution);

    const confidenceValue = Number(parsed.confidence ?? 0);
    const confidence = Number.isFinite(confidenceValue)
      ? Math.min(100, Math.max(0, Math.round(confidenceValue)))
      : distribution[classification.toLowerCase() as "positive" | "mixed" | "negative"];

    const keyThemes = Array.isArray(parsed.keyThemes)
      ? parsed.keyThemes
          .filter((theme) => typeof theme === "string")
          .map((theme) => theme.trim())
          .filter(Boolean)
          .slice(0, 6)
      : [];

    const sentimentData: SentimentResponse = {
      summary: parsed.summary.trim(),
      classification,
      confidence,
      keyThemes,
      distribution,
    };

    return NextResponse.json(sentimentData);
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment. Please try again." },
      { status: 500 }
    );
  }
}
