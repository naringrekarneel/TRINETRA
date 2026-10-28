import React, { useState } from "react";
import { LinkInput } from "../components/analyzer/LinkInput";
import { QRScanner } from "../components/scanner/QRScanner";
import { QRImageUpload } from "../components/scanner/QRImageUpload";
import { SecurityResults } from "../components/analyzer/SecurityResults";
import { analyzeURL } from "../lib/analyze-url";
import { classifyQRContent } from "../lib/analyze-text";
import { AnalysisResult } from "../types/security";
import {
  Link as LinkIcon,
  QrCode,
  ShieldCheck,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

type TabMode = "link" | "qr";
type QRSubMode = "camera" | "upload";

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("link");
  const [qrSubMode, setQrSubMode] = useState<QRSubMode>("camera");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Link analysis workflow
  const handleAnalyzeLink = (url: string) => {
    setIsAnalyzing(true);
    // Instant client-side analysis
    setTimeout(() => {
      const result = analyzeURL(url);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 150);
  };

  // QR scan/upload workflow
  const handleQRDecoded = (decodedText: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const qrClassification = classifyQRContent(decodedText);

      if (qrClassification.isWebUrl) {
        // Run full URL heuristic engine
        const urlResult = analyzeURL(decodedText);
        setAnalysisResult({
          ...urlResult,
          qrClassification,
        });
      } else {
        // Non-web QR content
        const nonWebResult: AnalysisResult = {
          input: decodedText,
          isWebUrl: false,
          status:
            qrClassification.type === "unsupported-scheme"
              ? "suspicious"
              : "review-recommended",
          statusLabel: qrClassification.title,
          statusDescription: qrClassification.description,
          findings: qrClassification.securityNote
            ? [
                {
                  id: "qr-non-web-finding",
                  severity:
                    qrClassification.type === "unsupported-scheme"
                      ? "high"
                      : "medium",
                  title: qrClassification.title,
                  description: qrClassification.description,
                  recommendation: qrClassification.securityNote,
                },
              ]
            : [],
          limitations: [
            "Non-web QR content is classified client-side for safe inspection.",
            "QRGuard does not execute actions, dial numbers, or connect to networks.",
          ],
          analyzedAt: new Date().toISOString(),
          qrClassification,
        };
        setAnalysisResult(nonWebResult);
      }
      setIsAnalyzing(false);
    }, 150);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-900 dark:bg-forest-950/80 dark:text-forest-300 text-xs font-semibold mb-3 border border-forest-200 dark:border-forest-800">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>Think Before You Scan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Check before you trust.
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Inspect links and QR codes for suspicious patterns before visiting a
          website. Zero server uploads, completely client-side.
        </p>
      </section>

      {/* Main Inspection Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900 transition-all">
        {analysisResult ? (
          <SecurityResults result={analysisResult} onReset={handleReset} />
        ) : (
          <div>
            {/* Primary Mode Tabs */}
            <div
              role="tablist"
              aria-label="Inspection method"
              className="grid grid-cols-2 p-1.5 rounded-xl bg-slate-100 dark:bg-charcoal-950 mb-6"
            >
              <button
                role="tab"
                id="tab-link"
                aria-selected={activeTab === "link"}
                aria-controls="panel-link"
                onClick={() => setActiveTab("link")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 ${
                  activeTab === "link"
                    ? "bg-white text-forest-900 shadow-sm dark:bg-charcoal-900 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <LinkIcon className="h-4 w-4" aria-hidden="true" />
                <span>Check a Link</span>
              </button>

              <button
                role="tab"
                id="tab-qr"
                aria-selected={activeTab === "qr"}
                aria-controls="panel-qr"
                onClick={() => setActiveTab("qr")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 ${
                  activeTab === "qr"
                    ? "bg-white text-forest-900 shadow-sm dark:bg-charcoal-900 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <QrCode className="h-4 w-4" aria-hidden="true" />
                <span>Scan a QR Code</span>
              </button>
            </div>

            {/* Link Checker Panel */}
            {activeTab === "link" && (
              <div
                role="tabpanel"
                id="panel-link"
                aria-labelledby="tab-link"
                className="animate-fade-in"
              >
                <LinkInput
                  onAnalyze={handleAnalyzeLink}
                  isLoading={isAnalyzing}
                />
              </div>
            )}

            {/* QR Scanner Panel */}
            {activeTab === "qr" && (
              <div
                role="tabpanel"
                id="panel-qr"
                aria-labelledby="tab-qr"
                className="animate-fade-in space-y-4"
              >
                {/* Secondary QR mode selector (Camera vs Upload) */}
                <div className="flex items-center justify-center gap-2 pb-2">
                  <button
                    type="button"
                    onClick={() => setQrSubMode("camera")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      qrSubMode === "camera"
                        ? "bg-forest-50 border-forest-600 text-forest-900 dark:bg-forest-950/60 dark:border-forest-500 dark:text-forest-200"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-charcoal-800"
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Live Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrSubMode("upload")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      qrSubMode === "upload"
                        ? "bg-forest-50 border-forest-600 text-forest-900 dark:bg-forest-950/60 dark:border-forest-500 dark:text-forest-200"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-charcoal-800"
                    }`}
                  >
                    <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Upload Image</span>
                  </button>
                </div>

                {qrSubMode === "camera" ? (
                  <QRScanner
                    onScanSuccess={handleQRDecoded}
                    onSwitchToUpload={() => setQrSubMode("upload")}
                  />
                ) : (
                  <QRImageUpload
                    onScanSuccess={handleQRDecoded}
                    onSwitchToCamera={() => setQrSubMode("camera")}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary Use Cases Grid */}
      <section className="mt-12">
        <h2 className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
          Everyday QR Scenarios Where Caution is Essential
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-charcoal-900">
            <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 dark:text-white mb-1">
              <AlertTriangle
                className="h-4 w-4 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <span>Parking &amp; Meter Stickers</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Scammers place physical stickers over real parking meters to steal
              credit card payments via fake portals.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-charcoal-900">
            <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 dark:text-white mb-1">
              <CheckCircle2
                className="h-4 w-4 text-forest-700 dark:text-forest-400"
                aria-hidden="true"
              />
              <span>Restaurant Menus</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ensure table QR codes point to the official restaurant domain
              before ordering or entering contact info.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-charcoal-900">
            <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 dark:text-white mb-1">
              <HelpCircle
                className="h-4 w-4 text-sky-600 dark:text-sky-400"
                aria-hidden="true"
              />
              <span>Poster &amp; Message Links</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Event flyers and SMS messages frequently use URL shorteners that
              obscure the real final destination.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
