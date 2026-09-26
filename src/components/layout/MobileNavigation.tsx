"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, ShieldAlert, Bookmark } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

export const MobileNavigation: React.FC = () => {
  const pathname = usePathname();
  const { savedStoryIds, savedVideoIds } = useSaved();
  const totalSaved = savedStoryIds.length + savedVideoIds.length;

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    {
      label: "Briefing",
      href: "/briefing",
      icon: Sparkles,
      highlight: true,
    },
    {
      label: "Alerts",
      href: "/alerts",
      icon: ShieldAlert,
      hasBadge: true,
    },
    {
      label: "Saved",
      href: "/saved",
      icon: Bookmark,
      count: totalSaved > 0 ? totalSaved : undefined,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-editorial-surface/95 backdrop-blur-lg border-t border-editorial-border py-1.5 px-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl transition-all duration-150 ${
                isActive
                  ? "text-editorial-accent font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    item.highlight ? "text-amber-500 scale-110" : ""
                  }`}
                />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600 animate-pulse ring-1 ring-white dark:ring-neutral-900" />
                )}
                {typeof item.count === "number" && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-editorial-accent text-white text-[9px] font-bold">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
