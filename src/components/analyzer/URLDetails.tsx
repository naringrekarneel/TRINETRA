import React from "react";
import { ParsedURLDetails } from "../../types/security";
import { Globe, Lock, Unlock, Compass, FileCode } from "lucide-react";
import { NumBadge } from "../../context/ElementNumberContext";

interface URLDetailsProps {
  details: ParsedURLDetails;
}

export const URLDetails: React.FC<URLDetailsProps> = ({ details }) => {
  const isHttps = details.protocol === "https:";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-charcoal-900 space-y-4">
      {/* Prominent Hostname Header (#29, #30) */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Target Destination Hostname
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-charcoal-800 text-slate-900 dark:text-white font-mono text-base font-bold break-all">
            <NumBadge id={29} />
            <Globe
              className="h-4 w-4 text-forest-700 dark:text-forest-400 shrink-0"
              aria-hidden="true"
            />
            <span>{details.hostname}</span>
          </div>

          <div className="relative">
            <NumBadge id={30} />
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                isHttps
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              }`}
            >
              {isHttps ? (
                <>
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>HTTPS (TLS Encrypted)</span>
                </>
              ) : (
                <>
                  <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>HTTP (Unencrypted)</span>
                </>
              )}
            </span>
          </div>

          {details.isPunycode && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
              <FileCode className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Unicode: {details.unicodeHostname}</span>
            </span>
          )}
        </div>
      </div>

      {/* Structured Domain Grid (#31, #32, #33, #34) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
        <div className="relative rounded-lg bg-slate-50 p-2.5 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
          <NumBadge id={31} />
          <span className="text-slate-500 dark:text-slate-400 block font-medium">
            Registrable Domain
          </span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 break-all">
            {details.domain || "N/A"}
          </span>
        </div>

        <div className="relative rounded-lg bg-slate-50 p-2.5 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
          <NumBadge id={32} />
          <span className="text-slate-500 dark:text-slate-400 block font-medium">
            Subdomain
          </span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 break-all">
            {details.subdomain || "(none)"}
          </span>
        </div>

        <div className="relative rounded-lg bg-slate-50 p-2.5 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
          <NumBadge id={33} />
          <span className="text-slate-500 dark:text-slate-400 block font-medium">
            Public Suffix (TLD)
          </span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            .{details.publicSuffix || "none"}
          </span>
        </div>

        <div className="relative rounded-lg bg-slate-50 p-2.5 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
          <NumBadge id={34} />
          <span className="text-slate-500 dark:text-slate-400 block font-medium">
            Port
          </span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {details.port
              ? `:${details.port}`
              : isHttps
                ? "443 (default)"
                : "80 (default)"}
          </span>
        </div>
      </div>

      {/* Path & Query details if present (#35) */}
      {(details.pathname !== "/" || details.search) && (
        <div className="relative rounded-lg bg-slate-50 p-3 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800 text-xs">
          <NumBadge id={35} />
          <div className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 mb-1">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Resource Path &amp; Parameters</span>
          </div>
          <div className="font-mono text-slate-800 dark:text-slate-300 break-all">
            <span className="font-semibold">{details.pathname}</span>
            {details.search && (
              <span className="text-slate-600 dark:text-slate-400">
                {details.search}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Raw normalized destination URL (#36) */}
      <div className="relative pt-1">
        <NumBadge id={36} />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
          Full Normalized Destination URL
        </span>
        <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-mono text-slate-800 dark:bg-charcoal-950 dark:text-slate-300 border border-slate-200 dark:border-slate-800 break-all select-all">
          {details.normalizedUrl}
        </div>
      </div>
    </div>
  );
};
