"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CastSection from "@/components/CastSection";
import SentimentCard from "@/components/SentimentCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Movie, SentimentResponse, Review } from "@/lib/types";
import { validateImdbId } from "@/lib/utils";

type AppState = "idle" | "loading" | "success" | "error";

const popularMovies = [
  { id: "tt0111161", title: "The Shawshank Redemption", rating: "9.3" },
  { id: "tt0468569", title: "The Dark Knight", rating: "9.0" },
  { id: "tt1375666", title: "Inception", rating: "8.8" },
  { id: "tt0137523", title: "Fight Club", rating: "8.8" },
  { id: "tt0133093", title: "The Matrix", rating: "8.7" },
  { id: "tt0816692", title: "Interstellar", rating: "8.7" },
];

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [celebrities, setCelebrities] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [homeSearchValue, setHomeSearchValue] = useState("");
  const [homeSearchError, setHomeSearchError] = useState("");

  const handleSearch = async (imdbId: string) => {
    setAppState("loading");
    setErrorMessage("");
    setMovie(null);
    setSentiment(null);
    setReviews([]);
    setCelebrities([]);

    try {
      const movieResponse = await fetch(`/api/movie?imdbId=${imdbId}`);
      const movieData = await movieResponse.json();

      if (!movieResponse.ok) {
        throw new Error(movieData.error || "Failed to fetch movie");
      }

      setMovie(movieData.movie);
      setReviews(movieData.reviews);
      setCelebrities(
        Array.isArray(movieData.celebrities)
          ? movieData.celebrities
          : String(movieData.movie?.Actors ?? "")
              .split(",")
              .map((name) => name.trim())
              .filter(Boolean)
      );

      const reviewTexts = movieData.reviews.map((r: Review) => r.content);

      const sentimentResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: reviewTexts }),
      });

      if (sentimentResponse.ok) {
        const sentimentData = await sentimentResponse.json();
        setSentiment(sentimentData);
      }

      setAppState("success");
    } catch (error) {
      setAppState("error");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar
        onSearch={handleSearch}
        isLoading={appState === "loading"}
        showSearch={appState !== "idle"}
        onLogoClick={() => {
          setAppState("idle");
          setMovie(null);
          setSentiment(null);
          setReviews([]);
          setCelebrities([]);
          setErrorMessage("");
        }}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {appState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[calc(100vh-64px)] px-4 py-10 md:py-14"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-7xl mx-auto w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <div className="text-center lg:text-left">
                    <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-8 ring-1 ring-[var(--accent)]/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="w-9 h-9 text-[var(--accent)]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5m8 2V5M9 11l5 3-5 3v-6z" />
                      </svg>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-poppins)] mb-4">
                      Discover Movie
                      <span className="text-[var(--accent)]"> Insights</span>
                    </h2>

                    <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                      Search any movie by IMDb ID to get AI-powered sentiment analysis from audience reviews.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const trimmed = homeSearchValue.trim();
                        if (!trimmed) {
                          setHomeSearchError("Please enter an IMDb ID");
                          return;
                        }
                        if (!validateImdbId(trimmed)) {
                          setHomeSearchError("Invalid format (e.g., tt0133093)");
                          return;
                        }
                        setHomeSearchError("");
                        handleSearch(trimmed);
                      }}
                      className="w-full max-w-2xl mx-auto lg:mx-0 flex items-stretch gap-2 mb-8"
                    >
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={homeSearchValue}
                          onChange={(e) => {
                            setHomeSearchValue(e.target.value);
                            if (homeSearchError) setHomeSearchError("");
                          }}
                          placeholder="Search by IMDb ID (tt0133093)"
                          className="w-full h-12 ui-input-pill bg-[var(--input-bg)] border border-[var(--input-border)] text-white text-base placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all duration-300"
                        />
                        {homeSearchError && (
                          <span className="absolute -bottom-6 left-4 text-xs text-[var(--error)]">
                            {homeSearchError}
                          </span>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="ui-btn-lg min-w-[120px] bg-[var(--accent)] hover:bg-[var(--accent-light)] disabled:opacity-50 disabled:cursor-not-allowed text-black text-base font-semibold transition-all duration-300 flex-shrink-0 shadow-[0_6px_20px_rgba(245,197,24,0.25)]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <span>Search</span>
                      </button>
                    </form>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                      {[
                        { id: "tt0133093", name: "The Matrix" },
                        { id: "tt0468569", name: "The Dark Knight" },
                        { id: "tt1375666", name: "Inception" },
                        { id: "tt0111161", name: "Shawshank Redemption" },
                      ].map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => handleSearch(movie.id)}
                          className="ui-pill bg-white/5 hover:bg-[var(--accent)]/15 border border-white/10 hover:border-[var(--accent)]/30 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-300"
                        >
                          {movie.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.aside
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 }}
                    className="bg-[#111] rounded-2xl border border-neutral-800 p-6 space-y-4 h-fit"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-6 rounded-full bg-[var(--accent)]" />
                      <h3 className="text-lg font-semibold text-white">Popular IMDb Picks</h3>
                    </div>

                    <div className="space-y-2">
                      {popularMovies.map((movie) => (
                        <button
                          key={movie.id}
                          type="button"
                          onClick={() => {
                            setHomeSearchValue(movie.id);
                            setHomeSearchError("");
                          }}
                          className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-neutral-800 transition duration-200 cursor-pointer text-left group"
                        >
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{movie.title}</p>
                            <p className="text-sm text-neutral-400">{movie.id}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            <span className="ui-pill text-xs bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)]">
                              {movie.rating}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-4 h-4 text-neutral-500 group-hover:text-[var(--accent)] transition-colors duration-200"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 10a1 1 0 011-1h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.aside>
                </div>
              </motion.div>
            </motion.div>
          )}

          {appState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {appState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center min-h-[calc(100vh-64px)]"
            >
              <ErrorDisplay message={errorMessage} />
            </motion.div>
          )}

          {appState === "success" && movie && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="[&>*+*]:mt-8"
            >
              <HeroSection movie={movie} />

              {celebrities.length > 0 && <CastSection celebrities={celebrities} />}

              {sentiment ? (
                <SentimentCard sentiment={sentiment} reviews={reviews} />
              ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                  <ErrorDisplay message="Unable to analyze sentiment at this time." />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[var(--text-muted)]">
          <p>CineInsight - Powered by OMDb API and Google Gemini AI</p>
        </div>
      </footer>
    </div>
  );
}
