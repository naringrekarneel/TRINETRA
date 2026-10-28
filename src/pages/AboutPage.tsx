import React from "react";
import {
  Github,
  FileCode,
  CheckCircle2,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/Button";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Title */}
      <section className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-2xl bg-white p-1 shadow-md ring-1 ring-slate-200 dark:ring-slate-700">
          <img src="/logo.png" alt="Trinetra Emblem" className="h-full w-full object-contain" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-900 dark:bg-forest-950/80 dark:text-forest-300 text-xs font-semibold mb-3 border border-forest-200 dark:border-forest-800">
          <span>Open Source Security Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About Trinetra
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          An open-source, privacy-first cybersecurity utility designed to
          demystify web addresses and physical QR codes before you open them.
        </p>
      </section>

      {/* Core Principles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="h-10 w-10 rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-300 flex items-center justify-center mb-4">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Zero Server Uploads
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your camera feed, uploaded image files, and parsed URLs stay
            entirely on your device. We believe security tools should never
            become privacy vulnerabilities.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="h-10 w-10 rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-300 flex items-center justify-center mb-4">
            <FileCode className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Deterministic Heuristics
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            No black-box guesses or arbitrary percentage scores. Every finding
            references RFC standards, Public Suffix List boundaries, or observed
            structural anomalies.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="h-10 w-10 rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-300 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            No Third-Party APIs
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            No API keys, mandatory accounts, or subscription paywalls. Trinetra
            functions completely standalone as a static application deployable
            anywhere.
          </p>
        </div>
      </section>

      {/* Limitations Section */}
      <section
        id="limitations"
        className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8 dark:border-amber-900/50 dark:bg-amber-950/20 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Explicit Security Limitations &amp; Disclaimers
          </h2>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          While Trinetra detects numerous common phishing and evasion tactics,
          users must understand the boundaries of client-side heuristic
          inspection:
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <li>
            <strong>Heuristics &ne; Malware Sandbox:</strong> Trinetra does not
            download or execute remote web page HTML, JavaScript, or payloads.
            It cannot check if a destination site has drive-by downloads or
            zero-day exploits.
          </li>
          <li>
            <strong>Legitimate Cloud Infrastructure:</strong> Cybercriminals
            frequently build phishing forms on Google Forms, Microsoft
            SharePoint, Canva, or Cloudflare Workers. These often possess valid
            domains and TLS certificates.
          </li>
          <li>
            <strong>Absence of warnings &ne; Proof of Safety:</strong> Passing
            all 14 heuristic checks only indicates the URL structure is normal.
            It is not an absolute endorsement or certificate of safety.
          </li>
        </ul>
      </section>

      {/* Open Source & Dependencies */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Open Source Transparency &amp; Third-Party Libraries
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Trinetra is released under the permissive{" "}
            <strong>MIT License</strong>. We believe in minimal dependencies and
            vetted open-source libraries:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block font-mono">
              html5-qrcode
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Client-side camera scanning and canvas image QR decoding.
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block font-mono">
              tldts
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              High-performance Mozilla Public Suffix List domain parser.
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block font-mono">
              lucide-react
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Clean, accessible SVG iconography.
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block font-mono">
              tailwindcss
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Utility-first styling with accessible color contrast and
              responsive tokens.
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Interested in contributing or reporting an issue? Check our
            repository on GitHub.
          </div>
          <a
            href="https://github.com/placeholder-org/trinetra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Button variant="primary" size="sm">
              <Github className="h-4 w-4 mr-1.5" aria-hidden="true" />
              View on GitHub
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};
