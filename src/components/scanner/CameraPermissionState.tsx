import React from "react";
import {
  Camera,
  CameraOff,
  AlertCircle,
  RefreshCw,
  UploadCloud,
} from "lucide-react";
import { Button } from "../ui/Button";
import { CameraPermissionState as PermState } from "../../hooks/useQRScanner";

interface CameraPermissionStateProps {
  state: PermState;
  errorMessage: string | null;
  onRetry: () => void;
  onFallbackToUpload: () => void;
}

export const CameraPermissionStateView: React.FC<
  CameraPermissionStateProps
> = ({ state, errorMessage, onRetry, onFallbackToUpload }) => {
  if (state === "idle" || state === "granted") {
    return null;
  }

  const renderContent = () => {
    switch (state) {
      case "requesting":
        return (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-forest-100 flex items-center justify-center text-forest-800 dark:bg-forest-900/60 dark:text-forest-400 animate-pulse">
              <Camera className="h-6 w-6" aria-hidden="true" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              Requesting Camera Permission
            </h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              Please click &quot;Allow&quot; in your browser&apos;s camera
              prompt to start scanning QR codes live.
            </p>
          </div>
        );

      case "denied":
        return (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 dark:bg-rose-950 dark:text-rose-400">
              <CameraOff className="h-6 w-6" aria-hidden="true" />
            </div>
            <h4 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
              Camera Access Denied
            </h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-md">
              Your browser or device has blocked camera access for this page. To
              scan with your camera, grant permission in your site settings.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Try Again
              </Button>
              <Button variant="primary" size="sm" onClick={onFallbackToUpload}>
                <UploadCloud className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Upload Image Instead
              </Button>
            </div>
          </div>
        );

      case "unavailable":
      case "unsupported":
      case "in-use":
        return (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 dark:bg-amber-950 dark:text-amber-400">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h4 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
              {state === "in-use"
                ? "Camera Currently In Use"
                : "Camera Unavailable"}
            </h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-md">
              {errorMessage || "Unable to access video stream on this device."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Retry
              </Button>
              <Button variant="primary" size="sm" onClick={onFallbackToUpload}>
                <UploadCloud className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Upload Image Instead
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      role="alert"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-charcoal-900"
    >
      {renderContent()}
    </div>
  );
};
