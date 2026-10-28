import React, { useState } from "react";
import { AnalysisResult } from "../../types/security";
import { URLDetails } from "./URLDetails";
import { WarningCard } from "./WarningCard";
import { Button } from "../ui/Button";
import { NumBadge } from "../../context/ElementNumberContext";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Info,
  Wifi,
  UserCheck,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  AlertOctagon,
  X,
} from "lucide-react";

interface SecurityResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const SecurityResults: React.FC<SecurityResultsProps> = ({
  result,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleCopyUrl = async () => {
    const textToCopy = result.normalizedUrl || result.input;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const hasHighRisk = result.findings.some((f) => f.severity === "high");
  const hasMediumRisk = result.findings.some((f) => f.severity === "medium");

  const handleContinueClick = () => {
    if (hasHighRisk || hasMediumRisk) {
      // Deliberate confirmation modal required for risky destinations
      setConfirmModalOpen(true);
    } else {
      window.open(result.normalizedUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleConfirmLeave = () => {
    setConfirmModalOpen(false);
    if (result.normalizedUrl) {
      window.open(result.normalizedUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Status banner styling based on assessment
  const statusStyles = {
    "no-warnings": {
      border: "border-forest-200 dark:border-forest-900",
      bg: "bg-forest-50/70 dark:bg-forest-950/30",
      text: "text-forest-900 dark:text-forest-200",
      icon: (
        <CheckCircle2
          className="h-6 w-6 text-forest-700 dark:text-forest-400 shrink-0"
          aria-hidden="true"
        />
      ),
    },
    "review-recommended": {
      border: "border-amber-200 dark:border-amber-900",
      bg: "bg-amber-50/70 dark:bg-amber-950/30",
      text: "text-amber-900 dark:text-amber-200",
      icon: (
        <AlertTriangle
          className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0"
          aria-hidden="true"
        />
      ),
    },
    suspicious: {
      border: "border-rose-200 dark:border-rose-900",
      bg: "bg-rose-50/70 dark:bg-rose-950/30",
      text: "text-rose-900 dark:text-rose-200",
      icon: (
        <ShieldAlert
          className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0"
          aria-hidden="true"
        />
      ),
    },
    "threat-reported": {
      border: "border-rose-300 dark:border-rose-900",
      bg: "bg-rose-100/70 dark:bg-rose-950/50",
      text: "text-rose-950 dark:text-rose-100",
      icon: (
        <AlertOctagon
          className="h-6 w-6 text-rose-700 dark:text-rose-400 shrink-0"
          aria-hidden="true"
        />
      ),
    },
    "reputation-unavailable": {
      border: "border-slate-200 dark:border-slate-800",
      bg: "bg-slate-50 dark:bg-charcoal-900",
      text: "text-slate-800 dark:text-slate-200",
      icon: (
        <Info
          className="h-6 w-6 text-slate-600 dark:text-slate-400 shrink-0"
          aria-hidden="true"
        />
      ),
    },
  };

  const currentStatus = statusStyles[result.status];

  // If non-web QR classification exists
  const qr = result.qrClassification;

  return (
    <div className="space-y-6">
      {/* Overall Assessment Status Banner (#28) */}
      <div className="relative">
        <NumBadge id={28} />
        <div
          role="region"
          aria-label="Security assessment outcome"
          className={`rounded-xl border p-5 shadow-sm transition-all ${currentStatus.border} ${currentStatus.bg}`}
        >
          <div className="flex items-start gap-4">
            {currentStatus.icon}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className={`text-base font-bold ${currentStatus.text}`}>
                  {result.statusLabel}
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Inspected at {new Date(result.analyzedAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {result.statusDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Web QR Content Display (if applicable) */}
      {qr && !qr.isWebUrl && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-charcoal-900 space-y-4">
          <div className="flex items-center gap-2.5">
            {qr.type === "wifi" && (
              <Wifi
                className="h-5 w-5 text-forest-700 dark:text-forest-400"
                aria-hidden="true"
              />
            )}
            {qr.type === "vcard" && (
              <UserCheck
                className="h-5 w-5 text-forest-700 dark:text-forest-400"
                aria-hidden="true"
              />
            )}
            {qr.type === "email" && (
              <Mail
                className="h-5 w-5 text-forest-700 dark:text-forest-400"
                aria-hidden="true"
              />
            )}
            {qr.type === "tel" && (
              <Phone
                className="h-5 w-5 text-forest-700 dark:text-forest-400"
                aria-hidden="true"
              />
            )}
            {qr.type === "sms" && (
              <MessageSquare
                className="h-5 w-5 text-forest-700 dark:text-forest-400"
                aria-hidden="true"
              />
            )}
            {qr.type === "plain-text" && (
              <FileText
                className="h-5 w-5 text-forest-700 dark:text-forest-400"
                aria-hidden="true"
              />
            )}
            {qr.type === "unsupported-scheme" && (
              <AlertOctagon
                className="h-5 w-5 text-rose-600 dark:text-rose-400"
                aria-hidden="true"
              />
            )}

            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {qr.title}
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {qr.description}
          </p>

          {/* Structured Key-Value Pairs */}
          {qr.parsedDetails && Object.keys(qr.parsedDetails).length > 0 && (
            <div className="rounded-lg bg-slate-50 p-3.5 dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              {Object.entries(qr.parsedDetails).map(([key, val]) => (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-1 border-b border-slate-200/60 dark:border-slate-800 last:border-0 last:pb-0"
                >
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    {key}:
                  </span>
                  <span className="font-mono text-slate-900 dark:text-slate-100 select-all break-all">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Safe raw textual representation */}
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Safe Text Representation (Raw Payload)
            </span>
            <pre className="rounded-lg bg-slate-100 p-3 text-xs font-mono text-slate-800 dark:bg-charcoal-950 dark:text-slate-300 border border-slate-200 dark:border-slate-800 whitespace-pre-wrap break-all select-all">
              {qr.raw}
            </pre>
          </div>

          {qr.securityNote && (
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2">
              <AlertTriangle
                className="h-4 w-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{qr.securityNote}</span>
            </div>
          )}
        </div>
      )}

      {/* URL Structure Details (When Web URL) */}
      {result.isWebUrl && result.parsedDetails && (
        <URLDetails details={result.parsedDetails} />
      )}

      {/* Findings List (#37, #38) */}
      {result.findings.length > 0 ? (
        <div className="space-y-3 relative">
          <div className="relative flex items-center justify-between">
            <NumBadge id={37} />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Heuristic Security Findings ({result.findings.length})
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Structured inspection results
            </span>
          </div>

          <div className="space-y-3 relative">
            <NumBadge id={38} />
            {result.findings.map((finding) => (
              <WarningCard key={finding.id} finding={finding} />
            ))}
          </div>
        </div>
      ) : (
        result.isWebUrl && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-charcoal-900 flex items-start gap-3">
            <CheckCircle2
              className="h-5 w-5 text-forest-700 dark:text-forest-400 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                No Heuristic Flags Triggered
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                The URL structure does not trigger any of the 14 automated
                heuristic rules. However, attackers can host malicious content
                on newly created or ordinary domain names. Always verify the
                domain name matches your intended service.
              </p>
            </div>
          </div>
        )
      )}

      {/* Analysis Limitations Notice (#39) */}
      <div className="relative rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-charcoal-950 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <NumBadge id={39} />
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
          <Info
            className="h-4 w-4 shrink-0 text-slate-500"
            aria-hidden="true"
          />
          <span>What Was and Was Not Inspected</span>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          {result.limitations.map((limit, idx) => (
            <li key={idx}>{limit}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons Bar (#40, #41, #42) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-auto">
          <NumBadge id={40} />
          <Button
            variant="outline"
            size="md"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Scan or Check Another Link
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <NumBadge id={41} />
            <Button
              variant="secondary"
              size="md"
              onClick={handleCopyUrl}
              className="w-full sm:w-auto"
              aria-label="Copy inspected URL to clipboard"
            >
              {copied ? (
                <>
                  <Check
                    className="h-4 w-4 mr-1.5 text-forest-600"
                    aria-hidden="true"
                  />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  <span>Copy URL</span>
                </>
              )}
            </Button>
          </div>

          {result.isWebUrl && result.normalizedUrl && (
            <div className="relative flex-1 sm:flex-initial">
              <NumBadge id={42} />
              <Button
                variant={hasHighRisk ? "danger" : "primary"}
                size="md"
                onClick={handleContinueClick}
                className="w-full sm:w-auto"
              >
                <span>Continue to Website</span>
                <ExternalLink className="h-4 w-4 ml-1.5" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Deliberate Confirmation Modal for Risky Links */}
      {confirmModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-charcoal-900 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 dark:bg-rose-950 dark:text-rose-400 shrink-0">
                  <ShieldAlert className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3
                    id="confirm-modal-title"
                    className="text-base font-bold text-slate-900 dark:text-white"
                  >
                    You Are Leaving QRGuard
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Caution: Potential risks flagged
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              You are about to navigate to an external website that triggered
              security alerts. Please verify that the target destination is
              genuinely what you intend to visit:
            </p>

            <div className="rounded-lg bg-slate-100 p-3 font-mono text-xs text-slate-800 dark:bg-charcoal-950 dark:text-slate-200 border border-slate-200 dark:border-slate-800 break-all select-all">
              <span className="font-semibold block text-slate-500 mb-0.5">
                Target Host:
              </span>
              <span className="font-bold">{result.hostname}</span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Never enter passwords, credit card numbers, or download
              unsolicited software on unverified websites.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel &amp; Stay Safe
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmLeave}
                className="w-full sm:w-auto"
              >
                I Understand the Risks, Proceed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
