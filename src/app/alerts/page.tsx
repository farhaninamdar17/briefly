"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { AlertCard } from "@/components/news/AlertCard";
import { EmptyState } from "@/components/news/EmptyState";
import { OfficialAlertDTO } from "@/lib/dal/dto";
import { ShieldAlert, RefreshCw, Info, BellRing } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<OfficialAlertDTO[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === "all") return true;
    return a.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  const handlePushTest = () => {
    toast("🚨 Test Alert: Official Flash Flood Warning issued for Pune Western Ghats by IMD/NDMA.", "error");
  };

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-foreground">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Page Title & Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-editorial-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Official Civil & Meteorological Bulletins</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-neutral-950 dark:text-neutral-50">
              Disaster & Emergency Alerts
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
              Real-time Common Alerting Protocol (CAP) feeds from the National Disaster Management Authority (NDMA SACHET), IMD, and state civic authorities.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePushTest}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-editorial-border text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <BellRing className="w-3.5 h-3.5 text-editorial-accent" />
              <span>Test Push Sound</span>
            </button>

            <button
              onClick={fetchAlerts}
              className="p-2 rounded-full border border-editorial-border hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
              aria-label="Refresh alerts feed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {["all", "critical", "breaking", "important"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                severityFilter === sev
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              {sev === "all" ? "All Severities" : sev}
            </button>
          ))}
        </div>

        {/* Notice on AI Non-Hallucination Policy */}
        <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-900 border border-editorial-border flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          <Info className="w-4 h-4 text-editorial-accent shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100 block">
              Official Source Integrity Policy
            </strong>
            AI models are strictly prohibited from generating synthetic emergency events. All alerts shown here originate verbatim from verified government and disaster response authorities.
          </div>
        </div>

        {/* Alerts Feed */}
        {filteredAlerts.length === 0 ? (
          <EmptyState type="alerts" />
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </main>

      <MobileNavigation />
      <Footer />
    </div>
  );
}
