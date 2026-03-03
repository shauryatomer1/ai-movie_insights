import { Review } from "./types";

const positiveReviews = [
  "An absolute masterpiece! The storytelling is incredible and keeps you on the edge of your seat.",
  "One of the best films I've ever seen. The performances are outstanding and the direction is flawless.",
  "A triumph of cinema. Every scene is carefully crafted and the emotional impact is profound.",
  "Absolutely phenomenal! This movie sets a new standard for the genre.",
  "Brilliantly executed. The cast delivers exceptional performances throughout.",
  "A groundbreaking film that will be remembered for generations. Truly remarkable.",
  "Exceeds all expectations. The script, direction, and acting all come together perfectly.",
  "This is what cinema is all about. A deeply moving and entertaining experience.",
  "Fantastic storytelling with incredible attention to detail. A must-watch!",
  "An instant classic. The filmmakers have created something truly special.",
];

const mixedReviews = [
  "Has its moments but also some flaws. Overall a decent watch.",
  "A mixed bag - some great scenes but also some disappointing ones.",
  "Entertaining but not without issues. Worth watching for fans of the genre.",
  "Good performances save an otherwise uneven script.",
  "Interesting concept but the execution could have been better.",
  "Not bad, but not great either. A solid middle-of-the-road film.",
  "Some truly brilliant moments mixed with some forgettable ones.",
  "Enjoyable for the most part, though it loses momentum in the second act.",
  "A decent attempt that mostly works but doesn't fully deliver on its promise.",
  "Worth watching once, though unlikely to become a repeat favorite.",
];

const negativeReviews = [
  "Disappointing. The plot is convoluted and the acting is stiff.",
  "A waste of time. Poorly written with zero character development.",
  "One of the worst films I've seen in recent years. Avoid at all costs.",
  "Boring and predictable. Nothing original or interesting to offer.",
  "Terrible script with awful dialogue. The director should be ashamed.",
  "A complete mess from start to finish. No redeeming qualities whatsoever.",
  "Utterly forgettable. I was checking my watch throughout.",
  "Failed on every level. Acting, writing, directing - all subpar.",
  "An absolute disaster. Don't waste your time or money on this.",
  "The worst movie experience I've had in years. Truly painful to watch.",
];

const neutralAuthors = [
  "MovieBuff42", "CinemaLover", "FilmCritic101", "WatcherX", " CinephilePro",
  "ScreenQueen", "FilmFanatic", "MovieManiac", "SilverScreen", " reeljoy",
];

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomAuthor(): string {
  return neutralAuthors[Math.floor(Math.random() * neutralAuthors.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateRatingFromScore(score: number): number {
  const base = score + Math.random() * 2 - 1;
  return Math.max(1, Math.min(10, Math.round(base * 10) / 10));
}

function getSentimentWeights(rating: number) {
  if (rating >= 8) return { positive: 0.7, mixed: 0.2, negative: 0.1 };
  if (rating >= 7) return { positive: 0.55, mixed: 0.3, negative: 0.15 };
  if (rating >= 5.5) return { positive: 0.3, mixed: 0.5, negative: 0.2 };
  if (rating >= 4) return { positive: 0.15, mixed: 0.35, negative: 0.5 };
  return { positive: 0.05, mixed: 0.2, negative: 0.75 };
}

function allocateCounts(
  total: number,
  weights: { positive: number; mixed: number; negative: number }
) {
  const raw = {
    positive: Math.round(total * weights.positive),
    mixed: Math.round(total * weights.mixed),
    negative: Math.round(total * weights.negative),
  };

  let used = raw.positive + raw.mixed + raw.negative;
  while (used > total) {
    if (raw.positive >= raw.mixed && raw.positive >= raw.negative && raw.positive > 0) {
      raw.positive -= 1;
    } else if (raw.mixed >= raw.negative && raw.mixed > 0) {
      raw.mixed -= 1;
    } else if (raw.negative > 0) {
      raw.negative -= 1;
    }
    used -= 1;
  }

  while (used < total) {
    if (weights.positive >= weights.mixed && weights.positive >= weights.negative) {
      raw.positive += 1;
    } else if (weights.mixed >= weights.negative) {
      raw.mixed += 1;
    } else {
      raw.negative += 1;
    }
    used += 1;
  }

  if (total >= 3) {
    if (raw.positive === 0) {
      raw.positive = 1;
      if (raw.mixed > raw.negative) raw.mixed -= 1;
      else raw.negative -= 1;
    }
    if (raw.mixed === 0) {
      raw.mixed = 1;
      if (raw.positive > raw.negative) raw.positive -= 1;
      else raw.negative -= 1;
    }
    if (raw.negative === 0) {
      raw.negative = 1;
      if (raw.positive > raw.mixed) raw.positive -= 1;
      else raw.mixed -= 1;
    }
  }

  return raw;
}

export function generateReviews(imdbRating: string | undefined): Review[] {
  const parsedRating = parseFloat(imdbRating || "5");
  const rating = Number.isFinite(parsedRating) ? parsedRating : 5;
  const reviewCount = Math.floor(Math.random() * 6) + 5; // 5-10 reviews

  const counts = allocateCounts(reviewCount, getSentimentWeights(rating));

  const selectedPositive = getRandomItems(positiveReviews, counts.positive);
  const selectedMixed = getRandomItems(mixedReviews, counts.mixed);
  const selectedNegative = getRandomItems(negativeReviews, counts.negative);

  const allSelected = shuffleArray([
    ...selectedPositive.map((content) => ({ content, range: [7, 10] as [number, number] })),
    ...selectedMixed.map((content) => ({ content, range: [4, 7] as [number, number] })),
    ...selectedNegative.map((content) => ({ content, range: [1, 5] as [number, number] })),
  ]);

  const reviews: Review[] = [];

  for (let i = 0; i < allSelected.length; i++) {
    const { content, range } = allSelected[i];
    const ratingScore = generateRatingFromScore((range[0] + range[1]) / 2);
    reviews.push({
      id: i + 1,
      author: getRandomAuthor(),
      content,
      rating: ratingScore,
    });
  }

  return reviews;
}

export function extractReviewTexts(reviews: Review[]): string[] {
  return reviews.map(r => r.content);
}
