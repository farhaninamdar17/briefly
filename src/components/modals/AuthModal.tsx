"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { X, Lock, ShieldCheck, UserCheck, Sparkles, Loader2 } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const success = await login(email, password || "password123");
    setIsLoading(false);

    if (success) {
      toast("Successfully signed in", "success");
    } else {
      toast("Invalid credentials or account not found", "error");
    }
  };

  const handleFastDemoLogin = async (demoEmail: string, roleName: string) => {
    setIsLoading(true);
    const success = await login(demoEmail, "password123");
    setIsLoading(false);
    if (success) {
      toast(`Signed in as ${roleName}`, "success");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-editorial-surface rounded-3xl shadow-2xl border border-editorial-border p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 mx-auto flex items-center justify-center font-serif text-2xl font-black mb-3 shadow-md">
            B
          </div>
          <h2 className="font-serif text-2xl font-black text-neutral-950 dark:text-neutral-50">
            Sign In to BRIEFLY
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Access your saved stories, quiet hours, and editorial controls.
          </p>
        </div>

        {/* Fast 1-Tap Demo Roles */}
        <div className="mb-6 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block text-center">
            Quick 1-Tap Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleFastDemoLogin("reader@briefly.news", "Reader")}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex flex-col items-center gap-1 transition-all"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Reader</span>
            </button>

            <button
              onClick={() => handleFastDemoLogin("editor@briefly.news", "Editor")}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex flex-col items-center gap-1 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Editor</span>
            </button>

            <button
              onClick={() => handleFastDemoLogin("admin@briefly.news", "Admin Lead")}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex flex-col items-center gap-1 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-editorial-accent" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
          <span className="bg-editorial-surface px-3 text-[11px] text-neutral-400 uppercase tracking-wider font-semibold shrink-0">
            or enter credentials
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@briefly.news"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-editorial-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-editorial-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
};
