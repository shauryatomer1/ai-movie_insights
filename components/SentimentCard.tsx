"use client";

import { SentimentResponse } from "@/lib/types";
import { Review } from "@/lib/types";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface SentimentCardProps {
  sentiment: SentimentResponse;
  reviews: Review[];
}

function splitSummaryIntoParagraphs(text: string): [string, string | null] {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return ["", null];

  const sentences = normalized.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) ?? [normalized];

  if (sentences.length <= 2) {
    return [sentences[0] ?? normalized, sentences[1] ?? null];
  }

  const splitAt = Math.ceil(sentences.length / 2);
  const first = sentences.slice(0, splitAt).join(" ").trim();
  const second = sentences.slice(splitAt).join(" ").trim();
  return [first, second || null];
}

function getLeadSentence(paragraph: string): { lead: string; rest: string } {
  const match = paragraph.match(/^(.+?[.!?])(\s+.*)?$/);
  if (!match) {
    return { lead: paragraph, rest: "" };
  }
  return {
    lead: match[1].trim(),
    rest: (match[2] ?? "").trim(),
  };
}

function getClassificationStyle(classification: string) {
  switch (classification) {
    case "Positive":
      return {
        color: "text-emerald-400",
        bg: "bg-emerald-500/15",
        border: "border-emerald-500/30",
        barColor: "bg-emerald-500",
        glow: "shadow-emerald-500/20",
      };
    case "Negative":
      return {
        color: "text-red-400",
        bg: "bg-red-500/15",
        border: "border-red-500/30",
        barColor: "bg-red-500",
        glow: "shadow-red-500/20",
      };
    default:
      return {
        color: "text-amber-400",
        bg: "bg-amber-500/15",
        border: "border-amber-500/30",
        barColor: "bg-amber-500",
        glow: "shadow-amber-500/20",
      };
  }
}

function getBarColor(label: "positive" | "mixed" | "negative") {
  switch (label) {
    case "positive":
      return "bg-emerald-500";
    case "negative":
      return "bg-red-500";
    default:
      return "bg-amber-500";
  }
}

function getLabelColor(label: "positive" | "mixed" | "negative") {
  switch (label) {
    case "positive":
      return "text-emerald-300";
    case "negative":
      return "text-red-300";
    default:
      return "text-amber-300";
  }
}

export default function SentimentCard({ sentiment, reviews }: SentimentCardProps) {
  const style = getClassificationStyle(sentiment.classification);
  const [summaryFirstParagraph, summarySecondParagraph] = splitSummaryIntoParagraphs(sentiment.summary);
  const { lead: summaryLead, rest: summaryRest } = getLeadSentence(summaryFirstParagraph);
  const totalSignals =
    sentiment.distribution.positive +
    sentiment.distribution.mixed +
    sentiment.distribution.negative;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
    >
      <h3 className="accent-bar text-2xl font-semibold tracking-tight text-white mb-6">
        AI Sentiment Analysis
      </h3>

      <Card
        className={`shadow-xl ${style.glow} font-sans bg-[rgba(12,12,12,0.92)]`}
      >
        {/* Header with classification badge */}
        <CardHeader className="flex items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/15 ring-1 ring-[var(--accent)]/30 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--accent)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <p className="text-white text-base font-semibold tracking-tight">Audience Sentiment</p>
              <p className="text-[var(--text-muted)] text-xs">AI summary from generated audience reviews</p>
            </div>
          </div>

          <div className="flex items-center justify-end flex-wrap gap-2">
            <span className="ui-pill text-xs bg-white/5 border border-white/10 text-[var(--text-secondary)]">
              {reviews.length} Reviews
            </span>
            <span className="ui-pill text-xs bg-white/5 border border-white/10 text-[var(--text-secondary)]">
              {totalSignals}% Coverage
            </span>
            <div className={`ui-badge border ${style.bg} ${style.border}`}>
              {sentiment.classification === "Positive" && (
                <svg className={`h-4 w-4 ${style.color}`} viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {sentiment.classification === "Mixed" && (
                <svg className={`h-4 w-4 ${style.color}`} viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {sentiment.classification === "Negative" && (
                <svg className={`h-4 w-4 ${style.color}`} viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className={`font-semibold text-sm tracking-wide ${style.color}`}>
                {sentiment.classification}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0">
          <div className="space-y-0 lg:col-span-7">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Summary</h4>
              <div className="bg-[#111] rounded-2xl p-5 md:p-8 border border-neutral-800 shadow-sm">
                <div className="space-y-4 max-w-3xl">
                  <p className="leading-relaxed text-[15px] md:text-base tracking-wide text-neutral-300">
                    <span className="font-medium text-white">{summaryLead}</span>
                    {summaryRest ? <span> {summaryRest}</span> : null}
                  </p>
                  {summarySecondParagraph && (
                    <p className="leading-relaxed text-[15px] md:text-base tracking-wide text-neutral-300">
                      {summarySecondParagraph}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {sentiment.keyThemes.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-white mb-2">Key Themes</h4>
                <div className="bg-white/[0.03] rounded-xl p-4 md:p-5 border border-white/10">
                  <div className="flex flex-wrap gap-2.5">
                    {sentiment.keyThemes.map((theme) => (
                      <span
                        key={theme}
                        className="ui-pill text-xs bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:border-[var(--accent)]/30 hover:text-white transition-colors duration-200"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-0 lg:col-span-5">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Audience Distribution</h4>
              <div className="bg-white/[0.03] rounded-xl p-4 md:p-5 border border-white/10 space-y-3.5">
                {([
                  { label: "positive", value: sentiment.distribution.positive },
                  { label: "mixed", value: sentiment.distribution.mixed },
                  { label: "negative", value: sentiment.distribution.negative },
                ] as const).map((item) => (
                  <div key={item.label} className="rounded-lg bg-white/[0.02] border border-white/5 px-3 py-2.5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`capitalize font-semibold tracking-wide ${getLabelColor(item.label)}`}>
                        {item.label}
                      </span>
                      <span className="text-[var(--text-secondary)] font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className={`h-full rounded-full ${getBarColor(item.label)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-white/[0.03] rounded-xl p-4 md:p-5 border border-white/10">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2">Overall Signal</p>
              <p className={`text-lg font-semibold ${style.color}`}>{sentiment.classification} Trend</p>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-6">
                Distribution and summary indicate the dominant audience mood while preserving mixed reactions.
              </p>
            </div>
          </div>
        </CardContent>

        {reviews.length > 0 && (
          <div className="pt-6 border-t border-white/10 space-y-4">
            <h4 className="text-base font-semibold tracking-tight text-white mb-4">Generated Reviews</h4>
            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/90">{review.author}</span>
                    <span className="text-xs font-medium text-[var(--text-muted)]">{review.rating}/10</span>
                  </div>
                  <p className="text-sm md:text-[15px] text-[var(--text-secondary)] leading-7">
                    {review.content}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.section>
  );
}
