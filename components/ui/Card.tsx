import { HTMLAttributes } from "react";
import { classNames } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

export function Card({ className, compact = false, ...props }: CardProps) {
  return (
    <div
      className={classNames(
        "glass-card rounded-2xl border border-white/12",
        compact ? "p-4 sm:p-5 space-y-4" : "p-4 sm:p-6 lg:p-8 space-y-6",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames("space-y-6", className)} {...props} />;
}
