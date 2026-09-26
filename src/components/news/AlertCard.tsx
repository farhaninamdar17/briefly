import React from "react";
import { OfficialAlertDTO } from "@/lib/dal/dto";
import { ShieldAlert, ExternalLink, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface AlertCardProps {
  alert: OfficialAlertDTO;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const isCritical = alert.severity === "CRITICAL";
  const isBreaking = alert.severity === "BREAKING";

  const borderColor = isCritical
    ? "border-rose-500 bg-rose-500/5 dark:bg-rose-950/20"
    : isBreaking
    ? "border-amber-500 bg-amber-500/5 dark:bg-amber-950/20"
    : "border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/10";

  const badgeBg = isCritical
    ? "bg-rose-600 text-white"
    : isBreaking
    ? "bg-amber-600 text-white"
    : "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200";

  return (
    <div
      className={`relative w-full rounded-xl border p-4 sm:p-5 transition-all shadow-sm ${borderColor}`}
      role="alert"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${badgeBg}`}>
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            OFFICIAL ALERT • {alert.severity}
          </span>
          {alert.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Authority
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(alert.timestamp)}
          </span>
        </div>
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-2 leading-snug">
        {alert.event}
      </h3>

      <div className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium mb-3">
        <MapPin className="w-3.5 h-3.5 text-editorial-accent shrink-0" />
        <span>{alert.area}</span>
      </div>

      <div className="bg-white/80 dark:bg-neutral-900/80 rounded-lg p-3 border border-neutral-200/80 dark:border-neutral-800 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 mb-4 leading-relaxed">
        <strong className="font-semibold block text-neutral-900 dark:text-white mb-1">
          Official Safety Instructions:
        </strong>
        {alert.instructions}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-neutral-200/60 dark:border-neutral-800/60 pt-3">
        <span className="text-neutral-500 dark:text-neutral-400">
          Authority: <span className="font-medium text-neutral-700 dark:text-neutral-300">{alert.authority}</span>
        </span>

        <a
          href={alert.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-editorial-accent hover:underline"
        >
          <span>View official alert bulletin</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
