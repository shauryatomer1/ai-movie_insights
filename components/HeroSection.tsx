"use client";

import { Movie } from "@/lib/types";
import { motion } from "framer-motion";

interface HeroSectionProps {
    movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
    const hasPoster = movie.Poster && movie.Poster !== "N/A";

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full min-h-[500px] md:min-h-[550px]"
        >
            {/* Background poster (blurred) */}
            {hasPoster && (
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={movie.Poster}
                        alt=""
                        className="w-full h-full object-cover scale-110 blur-sm opacity-15"
                    />
                    <div className="hero-gradient absolute inset-0" />
                    <div className="hero-gradient-bottom absolute inset-0" />
                </div>
            )}

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex-shrink-0 mx-auto md:mx-0"
                    >
                        {hasPoster ? (
                            <img
                                src={movie.Poster}
                                alt={movie.Title}
                                className="w-[220px] md:w-[280px] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
                            />
                        ) : (
                            <div className="w-[220px] md:w-[280px] h-[330px] md:h-[420px] bg-[var(--card)] rounded-xl flex items-center justify-center ring-1 ring-white/10">
                                <span className="text-6xl">🎬</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Movie Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex-1 text-center md:text-left"
                    >
                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-poppins)] leading-tight mb-4">
                            {movie.Title}
                        </h2>

                        {/* Meta badges */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                            {movie.imdbRating && movie.imdbRating !== "N/A" && (
                                <div className="flex items-center gap-1.5 bg-[var(--accent)]/15 border border-[var(--accent)]/30 px-3 py-1.5 rounded-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-[var(--accent)]"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-[var(--accent)] font-bold text-lg">
                                        {movie.imdbRating}
                                    </span>
                                    <span className="text-[var(--text-muted)] text-sm">/10</span>
                                </div>
                            )}
                            <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[var(--text-secondary)] text-sm font-medium">
                                {movie.Year}
                            </span>
                            {movie.Runtime && movie.Runtime !== "N/A" && (
                                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[var(--text-secondary)] text-sm font-medium">
                                    {movie.Runtime}
                                </span>
                            )}
                            {movie.Rated && movie.Rated !== "N/A" && (
                                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[var(--text-secondary)] text-sm font-medium">
                                    {movie.Rated}
                                </span>
                            )}
                        </div>

                        {/* Genre tags */}
                        {movie.Genre && (
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                                {movie.Genre.split(", ").map((genre, i) => (
                                    <span
                                        key={i}
                                        className="ui-pill bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-medium tracking-wide uppercase"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Plot */}
                        {movie.Plot && movie.Plot !== "N/A" && (
                            <div className="mb-6">
                                <p className="text-[var(--text-secondary)] leading-relaxed text-base md:text-lg max-w-2xl">
                                    {movie.Plot}
                                </p>
                            </div>
                        )}

                        {/* Director & Writer */}
                        <div className="flex flex-col sm:flex-row gap-4 text-sm">
                            {movie.Director && movie.Director !== "N/A" && (
                                <div>
                                    <span className="text-[var(--text-muted)]">Director </span>
                                    <span className="text-white font-medium">{movie.Director}</span>
                                </div>
                            )}
                            {movie.Writer && movie.Writer !== "N/A" && (
                                <div>
                                    <span className="text-[var(--text-muted)]">Writer </span>
                                    <span className="text-white font-medium">
                                        {movie.Writer.split(",")[0]}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
