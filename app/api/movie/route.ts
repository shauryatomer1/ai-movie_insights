import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Movie, Review } from "@/lib/types";
import { generateReviews } from "@/lib/reviews";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OMDB_URL = "https://www.omdbapi.com/";

interface MovieData {
  movie: Movie;
  reviews: Review[];
  celebrities: string[];
}

function splitPeople(raw?: string): string[] {
  if (!raw || raw === "N/A") return [];
  return raw
    .split(",")
    .map((name) => name.replace(/\(.*?\)/g, "").trim())
    .filter(Boolean);
}

function normalizeCelebrities(
  names: string[],
  fallbackPool: string[],
  min = 8,
  max = 10
): string[] {
  const merged = [...names, ...fallbackPool];
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const name of merged) {
    const clean = name
      .replace(/\s+as\s+.+$/i, "")
      .replace(/\s*-\s*.+$/, "")
      .replace(/\(.*?\)/g, "")
      .trim();

    if (!clean || clean.length < 2) continue;
    if (!/[A-Za-z]/.test(clean)) continue;

    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(clean);

    if (normalized.length >= max) break;
  }

  return normalized.slice(0, Math.max(min, Math.min(max, normalized.length)));
}

async function fetchExtendedCelebrities(movie: Movie): Promise<string[]> {
  const omdbActors = splitPeople(movie.Actors);
  const fallbackPool = [
    ...omdbActors,
    ...splitPeople(movie.Director),
    ...splitPeople(movie.Writer),
  ];

  if (!GEMINI_API_KEY) {
    return normalizeCelebrities([], fallbackPool, 8, 10);
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are enriching movie credits with real people names.

MOVIE:
- Title: ${movie.Title}
- Year: ${movie.Year}
- IMDb ID: ${movie.imdbID}
- Known actors (OMDb): ${movie.Actors}
- Director: ${movie.Director}
- Writer: ${movie.Writer}

TASK:
Return 8-10 real celebrity names strongly associated with this specific movie.

PRIORITY ORDER:
1) Principal cast (most important)
2) Supporting cast
3) Director
4) Writer

STRICT RULES:
- Output only person names, no roles and no character names.
- No duplicates.
- No fictional characters.
- No studios, franchises, or generic text.
- Keep spellings clean and standard.
- Prefer widely recognized names when uncertain.

OUTPUT FORMAT (JSON ONLY):
{"celebrities":["Name 1","Name 2","Name 3"]}

Return JSON only, no markdown and no extra text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return normalizeCelebrities([], fallbackPool, 8, 10);
    }

    const parsed = JSON.parse(jsonMatch[0]) as { celebrities?: string[] };
    const names = Array.isArray(parsed.celebrities)
      ? parsed.celebrities.filter((name) => typeof name === "string")
      : [];

    return normalizeCelebrities(names, fallbackPool, 8, 10);
  } catch (error) {
    console.error("Error fetching extended celebrities:", error);
    return normalizeCelebrities([], fallbackPool, 8, 10);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get("imdbId");

  if (!imdbId) {
    return NextResponse.json(
      { error: "IMDb ID is required" },
      { status: 400 }
    );
  }

  if (!/^tt\d+$/.test(imdbId)) {
    return NextResponse.json(
      { error: "Invalid IMDb ID format. Use tt followed by numbers (e.g., tt0133093)" },
      { status: 400 }
    );
  }

  if (!OMDB_API_KEY) {
    return NextResponse.json(
      { error: "OMDB API key not configured" },
      { status: 500 }
    );
  }

  try {
    const movieResponse = await fetch(
      `${OMDB_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}&plot=full`
    );

    if (!movieResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch movie data" },
        { status: 500 }
      );
    }

    const movieData = await movieResponse.json();

    if (movieData.Response === "False") {
      return NextResponse.json(
        { error: movieData.Error || "Movie not found" },
        { status: 404 }
      );
    }

    const movie: Movie = {
      Title: movieData.Title,
      Year: movieData.Year,
      Rated: movieData.Rated,
      Released: movieData.Released,
      Runtime: movieData.Runtime,
      Genre: movieData.Genre,
      Director: movieData.Director,
      Writer: movieData.Writer,
      Actors: movieData.Actors,
      Plot: movieData.Plot,
      Language: movieData.Language,
      Country: movieData.Country,
      Awards: movieData.Awards,
      Poster: movieData.Poster,
      imdbRating: movieData.imdbRating,
      imdbID: movieData.imdbID,
      Type: movieData.Type,
      Response: movieData.Response,
    };

    const reviews = generateReviews(movie.imdbRating);
    const celebrities = await fetchExtendedCelebrities(movie);

    const response: MovieData = {
      movie,
      reviews,
      celebrities,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie data. Please try again." },
      { status: 500 }
    );
  }
}
