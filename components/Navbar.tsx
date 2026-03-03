"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { validateImdbId } from "@/lib/utils";

interface NavbarProps {
    onSearch: (imdbId: string) => void;
    isLoading: boolean;
    onLogoClick?: () => void;
    showSearch?: boolean;
}

export default function Navbar({ onSearch, isLoading, onLogoClick, showSearch = true }: NavbarProps) {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) {
            setError("Please enter an IMDb ID");
            return;
        }
        if (!validateImdbId(trimmedValue)) {
            setError("Invalid format (e.g., tt0133093)");
            return;
        }
        setError("");
        onSearch(trimmedValue);
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-white/5"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center h-16 gap-3">
                    {/* Logo */}
                    <div
                        onClick={onLogoClick}
                        className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onLogoClick?.()}
                    >
                        <div className="w-9 h-9 bg-[var(--accent)] rounded-lg flex items-center justify-center">
                            <span className="text-black text-lg font-bold">▶</span>
                        </div>
                        <h1 className="text-xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight hidden sm:block">
                            CineInsight
                        </h1>
                    </div>

                    {/* Search Bar */}
                    {showSearch ? (
                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-2xl mx-auto flex items-stretch gap-2 justify-self-center"
                        >
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        if (error) setError("");
                                    }}
                                    placeholder="Search by IMDb ID (tt0133093)"
                                    className="w-full h-10 ui-input-pill bg-[var(--input-bg)] border border-[var(--input-border)] text-white text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all duration-300"
                                    disabled={isLoading}
                                />
                                {error && (
                                    <span className="absolute -bottom-5 left-4 text-xs text-[var(--error)]">
                                        {error}
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="ui-btn-md min-w-[108px] bg-[var(--accent)] hover:bg-[var(--accent-light)] disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-semibold transition-all duration-300 flex-shrink-0 shadow-[0_6px_18px_rgba(245,197,24,0.22)]"
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
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
                                )}
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </form>
                    ) : (
                        <div />
                    )}
                    {/* Right spacer keeps the search bar visually centered */}
                    <div aria-hidden="true" className="w-9 sm:w-[170px]" />
                </div>
            </div>
        </motion.nav>
    );
}
