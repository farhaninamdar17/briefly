import React from "react";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Featured Card Skeleton */}
      <div className="w-full h-80 bg-neutral-200 dark:bg-neutral-800/60 rounded-2xl" />

      {/* Grid of 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800/60 rounded-xl" />
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800/60 rounded-xl" />
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800/60 rounded-xl" />
      </div>
    </div>
  );
};
