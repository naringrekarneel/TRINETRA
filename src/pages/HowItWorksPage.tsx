import React from "react";
import { EyeOff } from "lucide-react";

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Title */}
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          How Trinetra Works
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          An inside look at our client-side analysis pipeline, Public Suffix
          List domain parsing, and explainable heuristic security checks.
        </p>
      </section>

      {/* Step by Step Breakdown */}
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-300 font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                100% In-Browser QR Decoding
              </h2>
              <span className="text-xs text-forest-700 dark:text-forest-400 font-semibold">
                Privacy By Design
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Whether you use your device camera or upload a picture, decoding
            occurs exclusively inside your browser using HTML5 Canvas and
            WebAssembly. Camera video streams and uploaded files are never
            transmitted to any server.
          </p>
          <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700 dark:bg-charcoal-950 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <EyeOff
              className="h-4 w-4 text-forest-600 shrink-0"
              aria-hidden="true"
            />
            <span>
              Zero telemetry, zero server-side logs, and zero tracking of the
              links you scan.
            </span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-300 font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Public Suffix List Domain Parsing
              </h2>
              <span className="text-xs text-forest-700 dark:text-forest-400 font-semibold">
                Critical Domain Boundary Accuracy
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Naive security tools frequently use faulty checks such as{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              hostname.includes(&quot;paypal.com&quot;)
            </code>{" "}
            or assume domains always end in two parts. This allows attackers to
            register deceiving domains like{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              paypal.com.attacker.org
            </code>{" "}
            or misparse multi-part suffixes like{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              .co.uk
            </code>
            .
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Trinetra uses the official Mozilla Public Suffix List via{" "}
            <code className="font-mono text-xs text-forest-700 dark:text-forest-400">
              tldts
            </code>{" "}
            to isolate the genuine registrable domain from subdomains and public
            suffixes.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-300 font-bold">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                14-Point Heuristic Rule Engine
              </h2>
              <span className="text-xs text-forest-700 dark:text-forest-400 font-semibold">
                Structural Pattern Analysis
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Once parsed, the destination link runs through 14 independent
            security rules:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                1. Non-HTTPS Unencrypted URLs
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags cleartext HTTP traffic susceptible to Wi-Fi sniffing.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                2. Embedded @ Credentials
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags deceptive authority prefixes hiding the true host.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                3. Punycode (xn--) IDN
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags internationalized domains mimicking Latin alphabets.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                4. Mixed-Script Homoglyphs
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Detects Cyrillic and Greek look-alike character attacks.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                5. Deep Subdomains (&ge;3 levels)
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags subdomain chains designed to conceal the root domain.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                6. Known URL Shorteners
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags redirectors that conceal the actual destination.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                7. Raw IPv4 / IPv6 Hosts
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags direct IP addresses that bypass domain reputation.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                8. Non-Standard Ports
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Detects unexpected ports other than standard 80 / 443.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                9. Excessively Long URLs
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Detects URLs engineered to truncate mobile browser address bars.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                10. Suspicious Percent-Encoding
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags encoded delimiters (%2F, %40, %25) used for filter
                evasion.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                11. Deceptive Brand Placement
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags brands placed in subdomains or paths of unrelated domains.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                12. Open Redirect Parameters
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Identifies parameters that may bounce visitors to third-party
                sites.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                13. Brand Typosquatting
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Uses Levenshtein edit distance to spot look-alike brands.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-charcoal-950 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                14. Suspicious TLD / Keywords
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Flags high-abuse TLDs paired with auth or banking keywords.
              </span>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-300 font-bold">
              4
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                No Fake Confidence Scores
              </h2>
              <span className="text-xs text-forest-700 dark:text-forest-400 font-semibold">
                Transparent &amp; Honest Findings
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Many security apps show arbitrary numbers like &quot;98% Safe&quot;.
            We reject fake security scores. If no heuristic flags are found,
            Trinetra states clearly:{" "}
            <em>&quot;No heuristic warnings detected.&quot;</em> It never claims
            a site is 100% safe, because attackers can always spin up brand-new
            domains or host phishing on legitimate clouds.
          </p>
        </div>

        {/* Step 5 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-300 font-bold">
              5
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Safe, Deliberate Navigation
              </h2>
              <span className="text-xs text-forest-700 dark:text-forest-400 font-semibold">
                Never Auto-Navigates
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Trinetra never automatically opens links. If you choose to continue
            to a website, it opens in a new tab with{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              rel=&quot;noopener noreferrer&quot;
            </code>{" "}
            to protect your browsing session from reverse tabnabbing.
          </p>
        </div>
      </div>
    </div>
  );
};
