# AI Movie Insight Builder

A full-stack Next.js app that fetches movie data from OMDb and generates AI-powered audience sentiment insights with Google Gemini.

## Features

- IMDb ID search with input validation
- Cinematic dark UI with responsive layout
- Homepage `Popular IMDb Picks` sidebar (click to auto-fill search)
- Movie hero section with metadata, plot, and rating
- Extended celebrity list (`8-10`) for each movie
- AI sentiment analysis with:
  - editorial-style summary
  - sentiment classification (`Positive`, `Mixed`, `Negative`)
  - distribution bars
  - key themes
  - generated review cards
- Graceful loading and error states

## Tech Stack

- Frontend: Next.js 16 (App Router), React 19, TypeScript
- Styling: Tailwind CSS v4
- Animation: Framer Motion
- Backend: Next.js route handlers
- APIs:
  - OMDb API (movie metadata)
  - Google Gemini API (sentiment + extended celebrities)

## Prerequisites

1. OMDb API key: http://www.omdbapi.com/apikey.aspx
2. Google Gemini API key: https://aistudio.google.com/app/apikey

## Setup

```bash
npm install
```

Create `.env.local`:

```env
OMDB_API_KEY=your_omdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Run locally:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## API Endpoints

### `GET /api/movie?imdbId={id}`

Fetches movie data from OMDb, generates simulated reviews, and returns an extended celebrity list.

Example response:

```json
{
  "movie": {
    "Title": "The Matrix",
    "Year": "1999",
    "imdbID": "tt0133093",
    "imdbRating": "8.7",
    "Actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss"
  },
  "reviews": [
    {
      "id": 1,
      "author": "MovieBuff42",
      "content": "An absolute masterpiece!",
      "rating": 9.5
    }
  ],
  "celebrities": [
    "Keanu Reeves",
    "Laurence Fishburne",
    "Carrie-Anne Moss",
    "Hugo Weaving",
    "Joe Pantoliano",
    "Gloria Foster",
    "Lana Wachowski",
    "Lilly Wachowski"
  ]
}
```

### `POST /api/analyze`

Analyzes review text with Gemini and returns structured sentiment output.

Request:

```json
{
  "reviews": ["Great movie!", "Absolutely loved it.", "Could have been better."]
}
```

Response (shape):

```json
{
  "summary": "The audience response is largely positive...",
  "classification": "Positive",
  "confidence": 84,
  "keyThemes": ["visual effects", "performances", "pacing"],
  "distribution": {
    "positive": 72,
    "mixed": 20,
    "negative": 8
  }
}
```

## Usage

1. Start from the homepage.
2. Enter an IMDb ID (example: `tt0133093`) or click a movie in `Popular IMDb Picks`.
3. Submit search.
4. Review movie details, top celebrities, and sentiment analysis.

## Notes

- OMDb does not provide audience reviews. Reviews are generated in-app for analysis.
- Celebrity lists are expanded via Gemini and normalized to return up to 10 names.
- If Gemini is unavailable, the app falls back to OMDb actors/director/writer data.

## Project Structure

```text
app/
  api/
    analyze/route.ts
    movie/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  CastSection.tsx
  ErrorDisplay.tsx
  HeroSection.tsx
  LoadingSkeleton.tsx
  Navbar.tsx
  SentimentCard.tsx
  ui/
    Card.tsx
lib/
  reviews.ts
  types.ts
  utils.ts
SPEC.md
README.md
```

## License

MIT
