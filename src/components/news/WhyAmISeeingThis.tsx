import React from "react";
import { Info } from "lucide-react";

interface WhyAmISeeingThisProps {
  reason?: string;
  className?: string;
}

export const WhyAmISeeingThis: React.FC<WhyAmISeeingThisProps> = ({
  reason = "You follow this area and topic.",
  className = "",
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 font-sans ${className}`}>
      <Info className="w-3 h-3 text-editorial-accent shrink-0" />
      <span className="italic">{reason}</span>
    </div>
  );
};
