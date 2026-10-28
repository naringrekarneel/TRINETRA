import React, { useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  UploadCloud,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  X,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../ui/Button";
import { NumBadge } from "../../context/ElementNumberContext";

interface QRImageUploadProps {
  onScanSuccess: (decodedText: string) => void;
  onSwitchToCamera: () => void;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

export const QRImageUpload: React.FC<QRImageUploadProps> = ({
  onScanSuccess,
  onSwitchToCamera,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenReaderId = "qrguard-upload-hidden-decoder";

  const clearSelection = () => {
    setImagePreview(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const decodeImageFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);

      // Validate MIME type
      if (
        !ALLOWED_MIME_TYPES.includes(file.type) &&
        !file.name.match(/\.(png|jpe?g|webp|svg)$/i)
      ) {
        setErrorMessage(
          "Unsupported file format. Please upload a PNG, JPEG, WEBP, or SVG image.",
        );
        return;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          "Image file is too large. Please select an image under 10 MB.",
        );
        return;
      }

      // Set preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsDecoding(true);

      try {
        const qrScanner = new Html5Qrcode(hiddenReaderId);
        try {
          // Client-side decode: does not upload file
          const decodedText = await qrScanner.scanFile(file, false);
          await qrScanner.clear();
          setIsDecoding(false);
          onScanSuccess(decodedText);
        } catch {
          await qrScanner.clear();
          setIsDecoding(false);
          setErrorMessage(
            "No readable QR code was found in this image. Please ensure the QR code is clearly visible, well-lit, and not blurry.",
          );
        }
      } catch (err) {
        setIsDecoding(false);
        setErrorMessage(
          `Decoding error: ${err instanceof Error ? err.message : "Unable to parse image"}`,
        );
      }
    },
    [onScanSuccess],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        decodeImageFile(file);
      }
    },
    [decodeImageFile],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      decodeImageFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden container required for html5-qrcode file scanning */}
      <div id={hiddenReaderId} className="hidden" aria-hidden="true" />

      {/* Privacy reminder */}
      <div className="flex items-center gap-2 text-xs text-forest-800 bg-forest-50 p-2.5 rounded-lg border border-forest-200 dark:bg-forest-950/40 dark:text-forest-300 dark:border-forest-900">
        <ShieldCheck
          className="h-4 w-4 shrink-0 text-forest-700 dark:text-forest-400"
          aria-hidden="true"
        />
        <span>
          QR decoding happens client-side in your browser. Your image is never
          uploaded to any server.
        </span>
      </div>

      {/* Upload Dropzone (#27) */}
      <div className="relative">
        <NumBadge id={27} />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isDecoding && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
            isDragging
              ? "border-forest-600 bg-forest-50/50 dark:border-forest-400 dark:bg-forest-950/20"
              : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-charcoal-900 dark:hover:border-slate-600 dark:hover:bg-charcoal-800"
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload QR code image"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleFileInputChange}
            aria-hidden="true"
          />

          {imagePreview ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={imagePreview}
                  alt="Uploaded QR Preview"
                  className="max-h-48 max-w-full rounded-lg object-contain shadow-sm border border-slate-200 dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  aria-label="Remove uploaded image"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {isDecoding ? (
                <div className="flex items-center gap-2 text-sm font-medium text-forest-700 dark:text-forest-400">
                  <RefreshCw
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Decoding QR Code in browser...</span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Click or drop another image to replace
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 dark:bg-charcoal-800 dark:text-slate-300 mb-3">
                <UploadCloud className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                <span className="text-forest-700 dark:text-forest-400 underline">
                  Choose a file
                </span>{" "}
                or drag and drop here
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Supported formats: PNG, JPG, JPEG, WEBP, SVG (up to 10 MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <AlertCircle
            className="h-5 w-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400"
            aria-hidden="true"
          />
          <div className="flex-1">
            <h4 className="text-sm font-semibold">QR Code Not Detected</h4>
            <p className="mt-0.5 text-xs text-rose-800 dark:text-rose-300">
              {errorMessage}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-rose-300 hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/50"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Try Another Image
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Switch to camera control (#26) */}
      <div className="flex items-center justify-end pt-1">
        <div className="relative">
          <NumBadge id={26} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwitchToCamera}
            className="text-slate-600 dark:text-slate-300"
          >
            <ImageIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Switch to Live Camera
          </Button>
        </div>
      </div>
    </div>
  );
};
