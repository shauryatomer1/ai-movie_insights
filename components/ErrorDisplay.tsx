"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

interface ErrorDisplayProps {
  message: string;
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <Card className="border-red-500/20">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Something went wrong
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mt-1">{message}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
