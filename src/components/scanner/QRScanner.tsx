import React, { useEffect } from "react";
import {
  Camera,
  Square,
  RefreshCw,
  UploadCloud,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useQRScanner } from "../../hooks/useQRScanner";
import { CameraPermissionStateView } from "./CameraPermissionState";
import { NumBadge } from "../../context/ElementNumberContext";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onSwitchToUpload: () => void;
}

const SCANNER_ELEMENT_ID = "qrguard-reader-viewport";

export const QRScanner: React.FC<QRScannerProps> = ({
  onScanSuccess,
  onSwitchToUpload,
}) => {
  const {
    isScanning,
    permissionState,
    errorMessage,
    startScanner,
    stopScanner,
  } = useQRScanner({
    onSuccess: onScanSuccess,
  });

  const handleStart = () => {
    startScanner(SCANNER_ELEMENT_ID);
  };

  const handleStop = async () => {
    await stopScanner();
  };

  // Ensure stop is called on unmount
  useEffect(() => {
    return () => {
      stopScanner().catch(() => {});
    };
  }, [stopScanner]);

  return (
    <div className="space-y-4">
      {/* Privacy reminder (#22) */}
      <div className="relative flex items-center gap-2 text-xs text-forest-800 bg-forest-50 p-2.5 rounded-lg border border-forest-200 dark:bg-forest-950/40 dark:text-forest-300 dark:border-forest-900">
        <NumBadge id={22} />
        <ShieldCheck
          className="h-4 w-4 shrink-0 text-forest-700 dark:text-forest-400"
          aria-hidden="true"
        />
        <span>
          Camera frames are processed in-memory in your browser and never
          transmitted to a server.
        </span>
      </div>

      {/* Permission or Error States */}
      {permissionState !== "idle" && permissionState !== "granted" && (
        <CameraPermissionStateView
          state={permissionState}
          errorMessage={errorMessage}
          onRetry={handleStart}
          onFallbackToUpload={onSwitchToUpload}
        />
      )}

      {/* Camera Viewport Container (#23) */}
      <div className="relative mx-auto max-w-sm sm:max-w-md overflow-hidden rounded-xl border border-slate-300 bg-slate-900 shadow-inner dark:border-slate-800 min-h-[300px] flex flex-col items-center justify-center text-white">
        <NumBadge id={23} />
        {/* Render container for Html5Qrcode */}
        <div
          id={SCANNER_ELEMENT_ID}
          className={`w-full h-full min-h-[300px] ${!isScanning ? "hidden" : "block"}`}
          aria-label="Live camera viewfinder"
        />

        {/* Reticle / Target Overlay when scanning */}
        {isScanning && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center p-8"
            aria-hidden="true"
          >
            <div className="relative h-56 w-56 rounded-2xl border-2 border-forest-400/80 bg-forest-500/5 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 h-6 w-6 border-t-4 border-l-4 border-forest-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 h-6 w-6 border-t-4 border-r-4 border-forest-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-forest-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-forest-400 rounded-br-lg" />
              {/* Target beam animation */}
              <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-forest-400 to-transparent animate-pulse" />
            </div>
          </div>
        )}

        {/* Idle Placeholder when camera not active (#24) */}
        {!isScanning && permissionState !== "requesting" && (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-forest-400 shadow-sm mb-4">
              <Camera className="h-8 w-8" aria-hidden="true" />
            </div>
            <h4 className="text-base font-semibold text-white">
              Camera Scanner Ready
            </h4>
            <p className="mt-1 text-xs text-slate-300 max-w-xs">
              Click &quot;Start Scanner&quot; to inspect a QR code using your
              device camera.
            </p>
            <div className="relative mt-5">
              <NumBadge id={24} />
              <Button
                variant="primary"
                size="md"
                onClick={handleStart}
                className="w-full sm:w-auto"
              >
                <Camera className="h-4 w-4 mr-2" aria-hidden="true" />
                Start Scanner
              </Button>
            </div>
          </div>
        )}

        {/* Live scanning status announcer for screen readers */}
        <div className="sr-only" role="status" aria-live="polite">
          {isScanning
            ? "Camera active. Point camera at a QR code to scan."
            : "Camera scanner stopped."}
        </div>
      </div>

      {/* Scanner Action Controls (#25, #26) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {isScanning ? (
          <div className="relative">
            <NumBadge id={25} />
            <Button
              variant="danger"
              size="sm"
              onClick={handleStop}
              className="w-full sm:w-auto"
            >
              <Square className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Stop Camera
            </Button>
          </div>
        ) : (
          <div className="relative">
            <NumBadge id={24} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleStart}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Restart Camera
            </Button>
          </div>
        )}

        <div className="relative">
          <NumBadge id={26} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwitchToUpload}
            className="w-full sm:w-auto text-slate-600 dark:text-slate-300"
          >
            <UploadCloud className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Switch to Image Upload
          </Button>
        </div>
      </div>
    </div>
  );
};
