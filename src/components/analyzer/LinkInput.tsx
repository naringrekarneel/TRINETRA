import React, { useState } from "react";
import { Search, Clipboard, X, AlertCircle, Shield } from "lucide-react";
import { Button } from "../ui/Button";

interface LinkInputProps {
  onAnalyze: (url: string) => void;
  isLoading?: boolean;
}

export const LinkInput: React.FC<LinkInputProps> = ({
  onAnalyze,
  isLoading = false,
}) => {
  const [urlInput, setUrlInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();

    if (!trimmed) {
      setValidationError("Please enter or paste a URL to inspect.");
      return;
    }

    setValidationError(null);
    onAnalyze(trimmed);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
          setValidationError(null);
        }
      }
    } catch {
      // Clipboard read may be blocked by browser permissions
      setValidationError(
        "Clipboard access was blocked. Please paste manually.",
      );
    }
  };

  const handleClear = () => {
    setUrlInput("");
    setValidationError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="url-link-input"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
        >
          Enter or paste destination web link
        </label>
        <div className="relative flex items-center">
          <input
            id="url-link-input"
            type="text"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g. https://example.com/reservation or parking-pay.com"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? "url-error-msg" : undefined}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:ring-offset-1 dark:bg-charcoal-900 dark:text-white dark:placeholder:text-slate-500 pr-24 ${
              validationError
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                : "border-slate-300 dark:border-slate-700 focus:border-forest-600"
            }`}
          />

          {/* Quick inline action buttons */}
          <div className="absolute right-2 flex items-center gap-1">
            {urlInput && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                aria-label="Clear input"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={handlePaste}
              className="p-1.5 text-slate-500 hover:text-forest-700 dark:text-slate-400 dark:hover:text-forest-400 rounded-md transition-colors"
              title="Paste from clipboard"
              aria-label="Paste from clipboard"
            >
              <Clipboard className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Validation error message */}
        {validationError && (
          <div
            id="url-error-msg"
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Shield
            className="h-3.5 w-3.5 text-forest-700 dark:text-forest-400"
            aria-hidden="true"
          />
          <span>URLs are parsed and evaluated directly in your browser.</span>
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {urlInput && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClear}
              className="flex-1 sm:flex-initial"
            >
              Clear
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="flex-1 sm:flex-initial min-w-[130px]"
          >
            <Search className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Analyze Link
          </Button>
        </div>
      </div>
    </form>
  );
};
