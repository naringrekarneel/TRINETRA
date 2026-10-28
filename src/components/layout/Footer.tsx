import React from "react";
import { Link } from "react-router-dom";
import { Lock, EyeOff, FileText, Github, CheckCircle2, ShieldCheck } from "lucide-react";
import { NumBadge } from "../../context/ElementNumberContext";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-charcoal-900 transition-colors mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Privacy Banner Box (#47) */}
        <div className="relative mb-8 rounded-xl border border-forest-200 bg-forest-50/50 p-4 dark:border-forest-900/50 dark:bg-forest-950/20">
          <NumBadge id={47} />
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-forest-100 p-2 text-forest-800 dark:bg-forest-900 dark:text-forest-300 shrink-0">
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Privacy By Design Guarantee
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                QR decoding happens in your browser. Your image is not uploaded
                by Trinetra. No camera frames, uploaded pictures, or inspected
                URLs are stored on any remote server.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info (#48) */}
          <div className="relative">
            <NumBadge id={48} />
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="Trinetra Logo"
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Trinetra
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Think Before You Scan. Inspect web links and QR codes before
              opening destinations to guard against phishing, malicious
              redirects, and credential theft.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Lock
                className="h-3.5 w-3.5 text-forest-600 shrink-0"
                aria-hidden="true"
              />
              <span>Free &amp; Open Source Software (MIT License)</span>
            </div>
          </div>

          {/* Security Standards (#49 - Fills space between #48 and #50) */}
          <div className="relative">
            <NumBadge id={49} />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Security Standards
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-forest-600 dark:text-forest-400 shrink-0" aria-hidden="true" />
                <span>14-Rule Heuristic Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-forest-600 dark:text-forest-400 shrink-0" aria-hidden="true" />
                <span>100% Client-Side Processing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-forest-600 dark:text-forest-400 shrink-0" aria-hidden="true" />
                <span>Zero Server Uploads &amp; No Logs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-forest-600 dark:text-forest-400 shrink-0" aria-hidden="true" />
                <span>Public Suffix Domain Boundaries</span>
              </li>
            </ul>
          </div>

          {/* Legal / Limitations (#50) */}
          <div className="relative">
            <NumBadge id={50} />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Transparency
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/placeholder-org/trinetra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-forest-700 dark:text-slate-400 dark:hover:text-forest-400 transition-colors"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link
                  to="/about#limitations"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-forest-700 dark:text-slate-400 dark:hover:text-forest-400 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Security Limitations
                </Link>
              </li>
              <li>
                <Link
                  to="/security-guide"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-forest-700 dark:text-slate-400 dark:hover:text-forest-400 transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Quishing &amp; Phishing Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright (#51) */}
        <div className="relative mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NumBadge id={51} />
          <p>
            &copy; {new Date().getFullYear()} Trinetra Contributors. Released
            under the MIT License.
          </p>
          <p className="text-center sm:text-right text-[11px] text-slate-500 max-w-md">
            Notice: Local heuristic checks inspect structure and known patterns.
            They do not constitute an absolute guarantee of safety. Always
            remain vigilant.
          </p>
        </div>
      </div>
    </footer>
  );
};
