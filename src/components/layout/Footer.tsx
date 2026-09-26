import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ShieldCheck, Sparkles, Rss, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-editorial-surface border-t border-editorial-border py-12 px-4 sm:px-6 transition-colors pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <BrandLogo size="md" showTagline />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-2 leading-relaxed">
              BRIEFLY delivers verified, multi-source local and national news with AI-assisted clarity, source comparison, and official disaster warnings.
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security-hardened with defense-in-depth protections</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Platform
            </span>
            <Link href="/" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Home Feed
            </Link>
            <Link href="/briefing" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              5-Minute Daily Briefing
            </Link>
            <Link href="/alerts" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Official Disaster Alerts
            </Link>
            <Link href="/explore" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Explore Topics & Areas
            </Link>
          </div>

          {/* Standards & Transparency */}
          <div className="flex flex-col gap-2.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Editorial Standards
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              We never rehost full articles without attribution. All AI summaries cite original publishers and retain direct canonical links.
            </span>
            <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Rss className="w-3.5 h-3.5" /> RSS Verified
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> CSP Protected
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-editorial-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} BRIEFLY Media. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/api/health" className="hover:underline">
              System Health
            </Link>
            <span>•</span>
            <Link href="/saved" className="hover:underline">
              Saved
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:underline">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
