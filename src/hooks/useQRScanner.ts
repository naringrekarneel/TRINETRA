import { useState, useRef, useCallback, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export type CameraPermissionState =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable"
  | "in-use"
  | "unsupported";

interface UseQRScannerOptions {
  onSuccess: (decodedText: string) => void;
  onError?: (errorMessage: string) => void;
}

export function useQRScanner({ onSuccess, onError }: UseQRScannerOptions) {
  const [isScanning, setIsScanning] = useState(false);
  const [permissionState, setPermissionState] =
    useState<CameraPermissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasProcessedResult = useRef(false);
  const isTransitioningRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cleanup on unmount
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current
              .stop()
              .catch(() => {})
              .finally(() => {
                try {
                  scannerRef.current?.clear();
                } catch {
                  // ignore
                }
              });
          } else {
            scannerRef.current.clear();
          }
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const stopScanner = useCallback(async () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      }
    } catch (err) {
      console.warn("Error stopping scanner:", err);
    } finally {
      if (isMountedRef.current) {
        setIsScanning(false);
      }
      isTransitioningRef.current = false;
    }
  }, []);

  const startScanner = useCallback(
    async (elementId: string) => {
      if (isScanning || isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      hasProcessedResult.current = false;
      setErrorMessage(null);
      setPermissionState("requesting");

      // Check if mediaDevices is supported (secure context required)
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setPermissionState("unsupported");
        setErrorMessage(
          "Camera access requires a secure context (HTTPS or localhost) and a supported browser.",
        );
        isTransitioningRef.current = false;
        return;
      }

      try {
        // Initialize instance if not already done
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(elementId);
        }

        const config = {
          fps: 10,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edge = Math.floor(minEdge * 0.7);
            return { width: edge, height: edge };
          },
          aspectRatio: 1.0,
        };

        const successCallback = async (decodedText: string) => {
          if (hasProcessedResult.current) return;
          hasProcessedResult.current = true;

          // Stop scanning on valid decode
          try {
            await stopScanner();
          } catch {
            // ignore
          }

          if (isMountedRef.current) {
            onSuccess(decodedText);
          }
        };

        const errorCallback = (scanError: string) => {
          // Continuous frame decode errors are ordinary while aiming; don't report unless fatal
          if (onError) {
            onError(scanError);
          }
        };

        await scannerRef.current.start(
          { facingMode: "environment" },
          config,
          successCallback,
          errorCallback,
        );

        if (isMountedRef.current) {
          setPermissionState("granted");
          setIsScanning(true);
        }
      } catch (err: unknown) {
        const error = err as { name?: string; message?: string };
        const name = error.name || "";
        const msg = error.message || "";

        if (
          name === "NotAllowedError" ||
          msg.includes("Permission denied") ||
          msg.includes("Permission dismissed")
        ) {
          setPermissionState("denied");
          setErrorMessage(
            "Camera permission was denied. Please allow camera access in browser permissions or upload an image file instead.",
          );
        } else if (
          name === "NotFoundError" ||
          name === "DevicesNotFoundError" ||
          msg.includes("No camera found")
        ) {
          setPermissionState("unavailable");
          setErrorMessage("No camera device detected on this device.");
        } else if (name === "NotReadableError" || name === "TrackStartError") {
          setPermissionState("in-use");
          setErrorMessage(
            "The camera is currently in use by another application or tab.",
          );
        } else {
          setPermissionState("unavailable");
          setErrorMessage(
            msg ||
              "Unable to start camera scanner. Try uploading a QR image file.",
          );
        }

        // Clean up
        try {
          if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop();
          }
        } catch {
          // ignore
        }
      } finally {
        isTransitioningRef.current = false;
      }
    },
    [isScanning, onSuccess, onError, stopScanner],
  );

  return {
    isScanning,
    permissionState,
    errorMessage,
    startScanner,
    stopScanner,
  };
}
