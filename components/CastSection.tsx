"use client";

import { motion } from "framer-motion";

interface CastSectionProps {
    celebrities: string[];
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// Deterministic color from name
function getAvatarColor(name: string): string {
    const colors = [
        "from-amber-500 to-orange-600",
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-purple-500 to-pink-600",
        "from-rose-500 to-red-600",
        "from-cyan-500 to-blue-600",
        "from-yellow-500 to-amber-600",
        "from-violet-500 to-purple-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function CastSection({ celebrities }: CastSectionProps) {
    const castList = celebrities
        .map((name) => name.trim())
        .filter(Boolean)
        .slice(0, 10);

    if (castList.length === 0) return null;

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h3 className="accent-bar text-xl font-bold text-white font-[family-name:var(--font-poppins)] mb-6">
                Top Celebrities
            </h3>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            >
                {castList.map((actor, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        className="flex flex-col items-center gap-3 flex-shrink-0 group cursor-pointer"
                    >
                        <div
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${getAvatarColor(
                                actor
                            )} flex items-center justify-center shadow-lg ring-2 ring-white/5 group-hover:ring-[var(--accent)]/40 transition-all duration-300 group-hover:scale-105`}
                        >
                            <span className="text-white font-bold text-lg md:text-xl drop-shadow-md">
                                {getInitials(actor)}
                            </span>
                        </div>
                        <span className="text-[var(--text-secondary)] text-xs md:text-sm text-center max-w-[80px] md:max-w-[96px] leading-tight group-hover:text-white transition-colors duration-300">
                            {actor}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
