import React from "react";
import { Finding } from "../../types/security";
import { Badge } from "../ui/Badge";
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react";

interface WarningCardProps {
  finding: Finding;
}

export const WarningCard: React.FC<WarningCardProps> = ({ finding }) => {
  const borderColors = {
    high: "border-l-4 border-l-rose-500 border-slate-200 dark:border-slate-800 dark:border-l-rose-500",
    medium:
      "border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800 dark:border-l-amber-500",
    low: "border-l-4 border-l-emerald-500 border-slate-200 dark:border-slate-800 dark:border-l-emerald-500",
    info: "border-l-4 border-l-sky-500 border-slate-200 dark:border-slate-800 dark:border-l-sky-500",
  };

  const severityIcons = {
    high: (
      <ShieldAlert
        className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0"
        aria-hidden="true"
      />
    ),
    medium: (
      <AlertTriangle
        className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0"
        aria-hidden="true"
      />
    ),
    low: (
      <AlertCircle
        className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0"
        aria-hidden="true"
      />
    ),
    info: (
      <Info
        className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0"
        aria-hidden="true"
      />
    ),
  };

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm dark:bg-charcoal-900 transition-all ${borderColors[finding.severity]}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {severityIcons[finding.severity]}
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {finding.title}
          </h4>
        </div>
        <div>
          <Badge severity={finding.severity} />
        </div>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
        {finding.description}
      </p>

      {finding.evidence && (
        <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 dark:bg-charcoal-950 dark:text-slate-300 border border-slate-200 dark:border-slate-800 break-all">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            Observed Evidence:{" "}
          </span>
          {finding.evidence}
        </div>
      )}

      <div className="flex items-start gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-forest-900 dark:text-forest-300 font-medium">
        <ChevronRight
          className="h-4 w-4 shrink-0 text-forest-600 dark:text-forest-400 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <span className="font-semibold">Recommended Action: </span>
          <span>{finding.recommendation}</span>
        </div>
      </div>
    </div>
  );
};
