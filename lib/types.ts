export interface Movie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Type: string;
  Response: string;
}

export interface MovieAPIResponse {
  movie?: Movie;
  celebrities?: string[];
  reviews?: Review[];
  error?: string;
}

export interface Review {
  id: number;
  author: string;
  content: string;
  rating: number;
}

export interface SentimentRequest {
  reviews: string[];
}

export interface SentimentResponse {
  summary: string;
  classification: "Positive" | "Mixed" | "Negative";
  confidence: number;
  keyThemes: string[];
  distribution: {
    positive: number;
    mixed: number;
    negative: number;
  };
}
