"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Bookmark, Sparkles, User, ShieldAlert, LogOut } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { useSaved } from "@/context/SavedContext";
import { SearchModal } from "../modals/SearchModal";
import { NotificationCenterModal } from "../modals/NotificationCenterModal";
import { AuthModal } from "../modals/AuthModal";

export const Header: React.FC = () => {
  const { user, isEditor, openAuthModal, logout } = useAuth();
  const { savedStoryIds, savedVideoIds } = useSaved();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalSavedCount = savedStoryIds.length + savedVideoIds.length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-editorial-bg/95 backdrop-blur-md border-b border-editorial-border transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand & Date */}
          <div className="flex items-center gap-6">
            <BrandLogo size="md" />

            <div className="hidden md:flex flex-col border-l border-neutral-200 dark:border-neutral-800 pl-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Saturday, September 26
              </span>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Briefing refreshed 6 mins ago
              </span>
            </div>
          </div>

          {/* Center / Navigation items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="px-3 py-1.5 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/briefing"
              className="px-3 py-1.5 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
            >
              5-Min Briefing
            </Link>
            <Link
              href="/alerts"
              className="px-3 py-1.5 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Official Alerts
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 5-Min Briefing Fast CTA */}
            <Link
              href="/briefing"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>5-Min Briefing</span>
            </Link>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Search stories and topics"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Saved Bookmarks */}
            <Link
              href="/saved"
              className="relative p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Saved stories and briefings"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalSavedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-editorial-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {totalSavedCount}
                </span>
              )}
            </Link>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Open notifications and alerts"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white dark:ring-neutral-900" />
            </button>

            {/* User Profile / Admin Menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
                  aria-label="User account menu"
                >
                  <div className="w-6 h-6 rounded-full bg-editorial-accent text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-neutral-700 dark:text-neutral-200 max-w-[90px] truncate">
                    {user.name}
                  </span>
                </button>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Dropdown Menu */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-editorial-surface rounded-xl shadow-xl border border-editorial-border py-1 text-sm z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-editorial-border">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase">
                      Role: {user.role}
                    </span>
                  </div>

                  {isEditor && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-editorial-accent font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}

                  <Link
                    href="/saved"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Saved Articles ({totalSavedCount})</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors border-t border-editorial-border mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationCenterModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <AuthModal />
    </>
  );
};
