"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, ShieldAlert, Moon, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { usePreferences } from "@/context/PreferencesContext";
import { formatTimeAgo } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  severity: string;
  timestamp: string;
  source: string;
  url: string;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { preferences, updatePreferences } = usePreferences();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestPush = () => {
    toast("🚨 Test Alert: Heavy Rainfall & Ghat Flash Flood Advisory for Pune issued by NDMA.", "error");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 sm:pt-16 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-editorial-surface rounded-2xl shadow-2xl border border-editorial-border overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-editorial-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-editorial-accent" />
            <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Important Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiet Hours & Policy Pill */}
        <div className="p-3 bg-neutral-100/70 dark:bg-neutral-900 text-xs flex items-center justify-between border-b border-editorial-border">
          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {preferences.quietHoursEnabled ? "Quiet Hours Active (10 PM – 7 AM)" : "Quiet Hours Disabled"}
            </span>
          </div>
          <button
            onClick={() => updatePreferences({ quietHoursEnabled: !preferences.quietHoursEnabled })}
            className="font-bold text-editorial-accent hover:underline text-[11px]"
          >
            {preferences.quietHoursEnabled ? "Turn Off" : "Turn On"}
          </button>
        </div>

        {/* List of Alerts & Notifications */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">No urgent alerts</p>
              <p className="mt-1">All monitored disaster and civil channels are clear.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 font-bold text-rose-600 uppercase text-[10px]">
                    <ShieldAlert className="w-3 h-3" />
                    {notif.severity}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {formatTimeAgo(notif.timestamp)}
                  </span>
                </div>

                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">
                  {notif.title}
                </h4>

                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs">
                  {notif.body}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">{notif.source}</span>
                  <a
                    href={notif.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-editorial-accent hover:underline flex items-center gap-0.5"
                  >
                    <span>View Bulletin</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900 border-t border-editorial-border flex items-center justify-between text-xs">
          <button
            onClick={handleTestPush}
            className="flex items-center gap-1 text-editorial-accent font-semibold hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Push Delivery</span>
          </button>

          <span className="text-neutral-400 text-[11px]">NDMA CAP Synced</span>
        </div>
      </div>
    </div>
  );
};
