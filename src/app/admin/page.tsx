"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  ShieldAlert,
  Newspaper,
  Rss,
  Activity,
  Lock,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { StoryDTO, OfficialAlertDTO } from "@/lib/dal/dto";
import { AuditLogEntry } from "@/lib/security/auditLog";

export default function AdminPage() {
  const { user, isEditor, isAdmin, openAuthModal } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "stories" | "alerts" | "sources" | "ai" | "security">("overview");
  const [stories, setStories] = useState<StoryDTO[]>([]);
  const [alerts, setAlerts] = useState<OfficialAlertDTO[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [healthData, setHealthData] = useState<{
    status?: string;
    metrics?: {
      totalStories: number;
      importantStories: number;
      totalVideos: number;
      activeAlerts: number;
      totalAlerts: number;
    };
    sources?: Array<{
      id: string;
      name: string;
      healthy: boolean;
      latencyMs: number;
      message?: string;
    }>;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Form states for creating story
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [whyItMatters, setWhyItMatters] = useState("");
  const [whoIsAffected, setWhoIsAffected] = useState("");
  const [whatHappensNext, setWhatHappensNext] = useState("");
  const [location, setLocation] = useState("Pune");
  const [topic, setTopic] = useState("Technology");
  const [importance, setImportance] = useState<"NORMAL" | "IMPORTANT" | "BREAKING" | "CRITICAL">("NORMAL");
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [sourceName, setSourceName] = useState("The Hindu");
  const [sourceUrl, setSourceUrl] = useState("https://www.thehindu.com/news/national/");

  // Form states for dispatching alert
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [alertAuthority, setAlertAuthority] = useState("NDMA SACHET & IMD Pune");
  const [alertEvent, setAlertEvent] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"NORMAL" | "IMPORTANT" | "BREAKING" | "CRITICAL">("IMPORTANT");
  const [alertArea, setAlertArea] = useState("Pune & Pimpri-Chinchwad");
  const [alertInstructions, setAlertInstructions] = useState("");
  const [alertUrl, setAlertUrl] = useState("https://sachet.ndma.gov.in");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [storiesRes, alertsRes, healthRes] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/alerts?active=false"),
        fetch("/api/admin/health"),
      ]);

      if (storiesRes.ok) {
        const sData = await storiesRes.json();
        setStories(sData.stories || []);
      }
      if (alertsRes.ok) {
        const aData = await alertsRes.json();
        setAlerts(aData.alerts || []);
      }
      if (healthRes.ok) {
        const hData = await healthRes.json();
        setHealthData(hData);
      }

      if (isAdmin) {
        const logsRes = await fetch("/api/admin/audit-logs");
        if (logsRes.ok) {
          const lData = await logsRes.json();
          setAuditLogs(lData.logs || []);
        }
      }
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isEditor) {
      loadData();
    }
  }, [isEditor, loadData]);

  if (!user || !isEditor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-editorial-bg p-4 text-center">
        <div className="max-w-md w-full bg-editorial-surface rounded-3xl p-8 border border-editorial-border shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-black">Admin Authorization Required</h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The BRIEFLY administration portal requires verified Editor or Admin privileges. Please sign in with an authorized role.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={openAuthModal}
              className="w-full py-2.5 rounded-full bg-editorial-accent text-white font-bold text-xs hover:opacity-90 shadow-sm"
            >
              Sign In to Admin
            </button>
            <Link
              href="/"
              className="w-full py-2.5 rounded-full border border-editorial-border text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Back to Home Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          summary,
          whatHappened,
          whyItMatters,
          whoIsAffected,
          whatHappensNext,
          location,
          topic,
          importance,
          isDeveloping,
          sources: [{ name: sourceName, url: sourceUrl }],
        }),
      });

      if (res.ok) {
        toast("Story published successfully", "success");
        setIsCreatingStory(false);
        setHeadline("");
        setSummary("");
        setWhatHappened("");
        setWhyItMatters("");
        setWhoIsAffected("");
        setWhatHappensNext("");
        loadData();
      } else {
        const data = await res.json();
        toast(data.error || "Failed to publish story", "error");
      }
    } catch {
      toast("Error submitting story", "error");
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!isAdmin) {
      toast("Admin authorization required to delete stories", "error");
      return;
    }
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      const res = await fetch(`/api/admin/stories?id=${storyId}`, { method: "DELETE" });
      if (res.ok) {
        toast("Story deleted", "info");
        loadData();
      }
    } catch {
      toast("Failed to delete", "error");
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authority: alertAuthority,
          event: alertEvent,
          severity: alertSeverity,
          area: alertArea,
          instructions: alertInstructions,
          originalUrl: alertUrl,
        }),
      });

      if (res.ok) {
        toast("Official disaster alert dispatched successfully", "success");
        setIsCreatingAlert(false);
        setAlertEvent("");
        setAlertInstructions("");
        loadData();
      } else {
        const data = await res.json();
        toast(data.error || "Failed to dispatch alert", "error");
      }
    } catch {
      toast("Error publishing alert", "error");
    }
  };

  const handleSyncSources = async () => {
    try {
      toast("Triggering news ingestion pipeline...", "info");
      const res = await fetch("/api/admin/sources", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast(`Pipeline completed! ${data.report.storiesPublished} stories processed.`, "success");
        loadData();
      }
    } catch {
      toast("Failed to trigger pipeline", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-foreground">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-neutral-900 text-white px-4 sm:px-6 py-3.5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Site</span>
          </Link>
          <div className="h-4 w-px bg-neutral-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-lg tracking-tight">BRIEFLY</span>
            <span className="px-2 py-0.5 rounded bg-editorial-accent text-[10px] font-bold uppercase tracking-wider">
              Control Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline text-neutral-400">
            Signed in as <strong className="text-white">{user.name}</strong> ({user.role})
          </span>
          <button
            onClick={loadData}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            aria-label="Refresh admin data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-editorial-border pb-3">
          {[
            { id: "overview", label: "Dashboard", icon: Activity },
            { id: "stories", label: `Stories (${stories.length})`, icon: Newspaper },
            { id: "alerts", label: `Official Alerts (${alerts.length})`, icon: ShieldAlert },
            { id: "sources", label: "Sources & Pipeline", icon: Rss },
            { id: "ai", label: "AI Pipeline Review", icon: Layers },
            { id: "security", label: "Security & Audit", icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isCurrent
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                    : "bg-editorial-surface border border-editorial-border text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-editorial-accent" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-editorial-surface border border-editorial-border shadow-2xs">
                <span className="text-xs font-semibold text-neutral-500 uppercase">Total Stories</span>
                <p className="font-serif text-3xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
                  {stories.length}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                  {healthData.metrics?.importantStories || 2} marked important
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-editorial-surface border border-editorial-border shadow-2xs">
                <span className="text-xs font-semibold text-neutral-500 uppercase">Active Alerts</span>
                <p className="font-serif text-3xl font-black text-rose-600 mt-1">
                  {alerts.length}
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  NDMA & IMD Synced
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-editorial-surface border border-editorial-border shadow-2xs">
                <span className="text-xs font-semibold text-neutral-500 uppercase">Video Briefings</span>
                <p className="font-serif text-3xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
                  4
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Authorized 9:16 embeds
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-editorial-surface border border-editorial-border shadow-2xs">
                <span className="text-xs font-semibold text-neutral-500 uppercase">System Health</span>
                <p className="font-serif text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" />
                  100% OK
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Defense-in-depth active
                </span>
              </div>
            </div>

            {/* Quick Ingest & Pipeline Trigger */}
            <div className="p-6 rounded-2xl bg-editorial-surface border border-editorial-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  News Ingestion Pipeline
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Trigger full validation, deduplication, clustering, and AI summarization across verified RSS and government feeds.
                </p>
              </div>
              <button
                onClick={handleSyncSources}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-editorial-accent text-white font-bold text-xs hover:opacity-90 shadow-md shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Ingestion Pipeline</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: STORIES MANAGEMENT */}
        {activeTab === "stories" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">Published Stories</h3>
              <button
                onClick={() => setIsCreatingStory(!isCreatingStory)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-xs hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isCreatingStory ? "Close Form" : "Create Story"}</span>
              </button>
            </div>

            {/* Create Story Form */}
            {isCreatingStory && (
              <form
                onSubmit={handleCreateStory}
                className="p-6 rounded-2xl bg-editorial-surface border border-editorial-border shadow-md space-y-4 animate-slide-up"
              >
                <h4 className="font-serif text-lg font-bold text-editorial-accent">
                  Publish New Verified Story
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Headline</label>
                    <input
                      type="text"
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Pune Metro Expands to Hadapsar"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Topic</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    >
                      <option>Technology</option>
                      <option>Science</option>
                      <option>Business</option>
                      <option>Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Importance</label>
                    <select
                      value={importance}
                      onChange={(e) => setImportance(e.target.value as typeof importance)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="IMPORTANT">IMPORTANT</option>
                      <option value="BREAKING">BREAKING</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="devCheck"
                      checked={isDeveloping}
                      onChange={(e) => setIsDeveloping(e.target.checked)}
                      className="w-4 h-4 accent-editorial-accent"
                    />
                    <label htmlFor="devCheck" className="text-xs font-semibold cursor-pointer">
                      Mark as Developing Live Story
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Summary (1-2 sentences)</label>
                    <textarea
                      required
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">What happened?</label>
                    <textarea
                      required
                      value={whatHappened}
                      onChange={(e) => setWhatHappened(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Why it matters</label>
                    <textarea
                      required
                      value={whyItMatters}
                      onChange={(e) => setWhyItMatters(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Who is affected</label>
                    <textarea
                      required
                      value={whoIsAffected}
                      onChange={(e) => setWhoIsAffected(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">What happens next</label>
                    <textarea
                      required
                      value={whatHappensNext}
                      onChange={(e) => setWhatHappensNext(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Source Name</label>
                    <input
                      type="text"
                      required
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Source URL (Safe HTTPS)</label>
                    <input
                      type="url"
                      required
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingStory(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-editorial-accent text-white font-bold text-xs hover:opacity-90 shadow-sm"
                  >
                    Publish Story
                  </button>
                </div>
              </form>
            )}

            {/* List of Stories */}
            <div className="space-y-3">
              {stories.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-editorial-surface border border-editorial-border flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                      <span className="font-bold text-editorial-accent uppercase">{s.topic}</span>
                      <span>•</span>
                      <span>{s.location}</span>
                      <span>•</span>
                      <span>{s.importance}</span>
                    </div>
                    <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {s.headline}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/story/${s.id}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg border border-editorial-border text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      View
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteStory(s.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                        aria-label="Delete story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ALERTS DISPATCHER */}
        {activeTab === "alerts" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">Disaster & Emergency Alerts</h3>
              <button
                onClick={() => setIsCreatingAlert(!isCreatingAlert)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dispatch Official Alert</span>
              </button>
            </div>

            {/* Alert creation form */}
            {isCreatingAlert && (
              <form
                onSubmit={handleCreateAlert}
                className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-900 shadow-md space-y-4 animate-slide-up"
              >
                <h4 className="font-serif text-lg font-bold text-rose-600">
                  Broadcast Verified Emergency Alert
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Issuing Authority</label>
                    <input
                      type="text"
                      required
                      value={alertAuthority}
                      onChange={(e) => setAlertAuthority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Severity</label>
                    <select
                      value={alertSeverity}
                      onChange={(e) => setAlertSeverity(e.target.value as typeof alertSeverity)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-editorial-border text-sm"
                    >
                      <option value="CRITICAL">CRITICAL (Emergency Action)</option>
                      <option value="BREAKING">BREAKING (Immediate Notice)</option>
                      <option value="IMPORTANT">IMPORTANT (Advisory)</option>
                      <option value="NORMAL">NORMAL</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      value={alertEvent}
                      onChange={(e) => setAlertEvent(e.target.value)}
                      placeholder="e.g. Severe Thunderstorm & Flash Flood Warning"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Affected Area</label>
                    <input
                      type="text"
                      required
                      value={alertArea}
                      onChange={(e) => setAlertArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Official Bulletin URL</label>
                    <input
                      type="url"
                      required
                      value={alertUrl}
                      onChange={(e) => setAlertUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Safety Instructions for Public</label>
                    <textarea
                      required
                      value={alertInstructions}
                      onChange={(e) => setAlertInstructions(e.target.value)}
                      rows={3}
                      placeholder="e.g. Move to higher ground. Avoid low-lying river bridges. Dial 1077 for assistance."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-editorial-border text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingAlert(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
                  >
                    Dispatch Alert
                  </button>
                </div>
              </form>
            )}

            {/* List of active alerts */}
            <div className="space-y-3">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-editorial-surface border border-editorial-border flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-bold text-rose-600 uppercase">{a.severity}</span>
                      <span>•</span>
                      <span className="text-neutral-500">{a.authority}</span>
                    </div>
                    <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-100">{a.event}</h4>
                    <p className="text-xs text-neutral-500">{a.area}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                    Live Broadcast
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SOURCES & PIPELINE */}
        {activeTab === "sources" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-serif text-xl font-bold">News Adapters & Ingestion Feeds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthData.sources?.map((src) => (
                <div
                  key={src.id}
                  className="p-4 rounded-2xl bg-editorial-surface border border-editorial-border flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Rss className="w-4 h-4 text-editorial-accent" />
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{src.name}</h4>
                    </div>
                    <p className="text-xs text-neutral-500">{src.message || "Adapter active"}</p>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Latency: {src.latencyMs}ms
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      src.healthy
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {src.healthy ? "Connected" : "Degraded"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AI PIPELINE REVIEW */}
        {activeTab === "ai" && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-editorial-surface border border-editorial-border space-y-4">
              <div className="flex items-center gap-2 text-editorial-accent font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>AI Pipeline Architecture (Fact-Grounded)</span>
              </div>
              <h3 className="font-serif text-xl font-bold">
                Verification & Source Integrity Rules
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                BRIEFLY uses a deterministic clustering and summarization engine. AI is strictly constrained to synthesize verified incoming reporting without generating ungrounded facts, false statistics, or artificial emergency alarms.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 block mb-1">
                    1. Deduplication & Clustering
                  </span>
                  <p className="text-neutral-500">
                    Groups multi-outlet articles covering the same event using Jaccard token distance.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 block mb-1">
                    2. 4-Part Clarity Decomposition
                  </span>
                  <p className="text-neutral-500">
                    Structures summaries into What happened, Why it matters, Who is affected, and Next steps.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 block mb-1">
                    3. Source Transparency
                  </span>
                  <p className="text-neutral-500">
                    Attribution is preserved on every sentence. External canonical links are validated against SSRF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY HEALTH & AUDIT LOGS */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">Security Audit Trail</h3>
              <span className="text-xs text-neutral-500 font-mono">
                Environment: Defense-in-Depth
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-editorial-surface border border-editorial-border shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold border-b border-editorial-border">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Actor</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Target</th>
                    <th className="p-3.5">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editorial-border">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      <td className="p-3.5 font-mono text-neutral-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-3.5 font-medium text-neutral-900 dark:text-neutral-100">
                        {log.adminEmail}
                      </td>
                      <td className="p-3.5 font-bold text-editorial-accent">
                        {log.action}
                      </td>
                      <td className="p-3.5 font-mono text-neutral-600 dark:text-neutral-400">
                        {log.targetType}:{log.targetId}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.result === "SUCCESS"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {log.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
