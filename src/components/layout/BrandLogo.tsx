import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  className = "",
  showTagline = false,
}) => {
  const sizeClasses = {
    sm: "text-lg tracking-tight",
    md: "text-2xl tracking-tighter",
    lg: "text-3xl sm:text-4xl tracking-tighter",
  };

  return (
    <Link
      href="/"
      className={`group inline-flex flex-col select-none focus:outline-none ${className}`}
      aria-label="BRIEFLY Homepage"
    >
      <div className="flex items-center gap-2">
        {/* Sleek geometric editorial mark */}
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-serif font-black shadow-sm group-hover:scale-105 transition-transform duration-200">
          <span className="text-base sm:text-lg italic font-bold">B</span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-editorial-accent border-2 border-white dark:border-neutral-900" />
        </div>

        <span className={`font-serif font-black tracking-tight text-neutral-950 dark:text-neutral-50 ${sizeClasses[size]}`}>
          BRIEFLY
        </span>
      </div>

      {showTagline && (
        <span className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-sans tracking-wide mt-0.5 uppercase">
          Your areas. Your interests. Just the news that matters.
        </span>
      )}
    </Link>
  );
};
