# AI Movie Insight Builder - Specification

## 1. Project Overview

**Project Name:** AI Movie Insight Builder  
**Type:** Full-stack Web Application  
**Core Functionality:** A web app where users enter an IMDb movie ID and receive movie details along with AI-generated sentiment analysis of audience reviews.  
**Target Users:** Movie enthusiasts, film critics, general users interested in movie insights.

---

## 2. UI/UX Specification

### Layout Structure

**Page Sections:**
- **Header:** App title and branding
- **Search Section:** IMDb ID input with validation
- **Loading State:** Skeleton loading animation
- **Results Section:** Movie card with all details
- **Sentiment Section:** AI analysis results
- **Error Display:** User-friendly error messages

**Responsive Breakpoints:**
- Mobile: < 640px (single column)
- Tablet: 640px - 1024px (adjusted spacing)
- Desktop: > 1024px (centered container, max-width 900px)

### Visual Design

**Color Palette:**
- Background: `#0f0f0f` (near black)
- Card Background: `#1a1a1a` (dark gray)
- Card Border: `#2a2a2a` (subtle border)
- Primary Accent: `#f59e0b` (amber-500 - movie/gold theme)
- Secondary Accent: `#fbbf24` (amber-400)
- Text Primary: `#fafafa` (zinc-50)
- Text Secondary: `#a1a1aa` (zinc-400)
- Success/Positive: `#22c55e` (green-500)
- Warning/Mixed: `#eab308` (yellow-500)
- Error/Negative: `#ef4444` (red-500)
- Input Background: `#27272a` (zinc-800)
- Input Border: `#3f3f46` (zinc-700)
- Input Focus Border: `#f59e0b` (amber-500)

**Typography:**
- Font Family: `"Outfit", sans-serif` (Google Fonts - modern, clean)
- Headings:
  - H1: 2.5rem, font-weight 700
  - H2: 1.5rem, font-weight 600
  - H3: 1.25rem, font-weight 600
- Body: 1rem, font-weight 400
- Small/Caption: 0.875rem, font-weight 400

**Spacing System:**
- Container padding: 24px (mobile), 32px (desktop)
- Card padding: 24px
- Section gap: 32px
- Element gap: 16px

**Visual Effects:**
- Card shadow: `0 4px 24px rgba(0, 0, 0, 0.4)`
- Input focus: amber glow `0 0 0 2px rgba(245, 158, 11, 0.3)`
- Hover transitions: 200ms ease
- Loading skeleton: shimmer animation

### Components

**1. Header**
- App logo/icon (film reel emoji or custom)
- Title: "AI Movie Insight Builder"
- Subtle tagline

**2. Search Input**
- Large input field with placeholder "Enter IMDb ID (e.g., tt0133093)"
- Search button with icon
- Validation error message below input
- States: default, focus, error, loading

**3. Movie Card**
- Two-column layout (poster | details) on desktop
- Single column on mobile
- Poster image with fallback
- Details: Title, Year, Rating, Plot
- Cast list (scrollable if long)

**4. Sentiment Analysis Card**
- Classification badge (Positive/Mixed/Negative)
- Summary text (3-5 lines)
- Visual indicator matching sentiment

**5. Loading Skeleton**
- Animated placeholder matching final layout
- Shimmer effect

**6. Error State**
- Clear error icon
- Error message
- Suggestion to retry

---

## 3. Functionality Specification

### Core Features

**1. IMDb ID Input & Validation**
- Input field accepts IMDb ID
- Validation regex: `^tt\d+$`
- Real-time validation on blur
- Clear error messages
- Submit on Enter key or button click

**2. Movie Data Fetching**
- API: OMDb API (http://www.omdbapi.com/)
- Server-side only (Next.js API route)
- Fetch: Title, Poster, Year, Rating, Cast, Plot
- Handle API errors gracefully
- Cache responses (optional)

**3. Audience Reviews**
- Since OMDb doesn't provide reviews, simulate realistic review dataset
- Generate 5-10 simulated reviews per movie based on rating
- Higher rated movies get more positive reviews
- Document assumption in README

**4. AI Sentiment Analysis**
- Google Gemini API (gemini-2.5-flash)
- Server-side API route `/api/analyze`
- Input: Array of review texts
- Output: 
  - Summary (3-5 lines)
  - Classification: "Positive" | "Mixed" | "Negative"

### User Interactions

1. User enters IMDb ID
2. Validates input format
3. If invalid → show error
4. If valid → show loading state
5. Fetch movie data (server-side)
6. Generate/fetch reviews
7. Send to Gemini API for analysis
8. Display results

### Edge Cases

- Invalid IMDb ID format → "Invalid format. Use tt followed by numbers (e.g., tt0133093)"
- Movie not found → "Movie not found. Please check the IMDb ID."
- API error → "Failed to fetch movie. Please try again."
- No reviews available → "Unable to analyze sentiment at this time."
- Gemini API error → Show movie details without sentiment analysis

---

## 4. Technical Architecture

### Project Structure

```
├── app/
│   ├── api/
│   │   ├── movie/
│   │   │   └── route.ts      # Movie data fetching
│   │   └── analyze/
│   │       └── route.ts     # Gemini sentiment analysis
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Main page
├── components/
│   ├── Header.tsx
│   ├── MovieSearch.tsx
│   ├── MovieCard.tsx
│   ├── SentimentCard.tsx
│   ├── LoadingSkeleton.tsx
│   └── ErrorDisplay.tsx
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   └── reviews.ts            # Review simulation
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### API Routes

**GET /api/movie?imdbId=tt0133093**
- Fetches movie data from OMDb API
- Returns: title, poster, year, imdbRating, cast, plot

**POST /api/analyze**
- Body: `{ reviews: string[] }`
- Calls Gemini API
- Returns: `{ summary: string, classification: 'Positive' | 'Mixed' | 'Negative' }`

---

## 5. Acceptance Criteria

- [ ] Input validates IMDb ID format correctly
- [ ] Valid IMDb ID fetches and displays movie details
- [ ] Poster image displays correctly (or fallback)
- [ ] Cast list shows top cast members
- [ ] Loading state shows during API calls
- [ ] Error messages display for invalid input/API failures
- [ ] Sentiment analysis returns summary and classification
- [ ] UI is responsive on mobile and desktop
- [ ] Dark theme with amber accents applied consistently
- [ ] No console errors in production
