"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OfficialAlertDTO } from "@/lib/dal/dto";
import { ShieldAlert, ArrowRight, X } from "lucide-react";

export const AlertBanner: React.FC = () => {
  const [topAlert, setTopAlert] = useState<OfficialAlertDTO | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/alerts");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.alerts) && data.alerts.length > 0) {
            setTopAlert(data.alerts[0]);
          }
        }
      } catch {
        // Silently skip if unavailable
      }
    };
    fetchAlerts();
  }, []);

  if (!topAlert || isDismissed) return null;

  return (
    <div className="w-full bg-amber-500 text-neutral-950 px-4 py-2 text-xs sm:text-sm font-medium border-b border-amber-600/30 flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-2 max-w-4xl truncate">
        <span className="flex items-center gap-1 font-bold shrink-0 bg-neutral-950 text-white px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
          <ShieldAlert className="w-3 h-3 text-amber-400" />
          {topAlert.severity} ALERT
        </span>
        <span className="truncate">
          <strong className="font-semibold">{topAlert.area}:</strong> {topAlert.event}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/alerts"
          className="underline font-bold hover:text-white flex items-center gap-1 text-xs"
        >
          <span>Instructions</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-0.5 hover:bg-amber-600/40 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
