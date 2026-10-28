import React from "react";
import {
  ShieldAlert,
  Lock,
  Compass,
  AtSign,
  Type,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

export const SecurityGuidePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          QR Code &amp; Web Link Security Guide
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Understand modern QR phishing (&quot;quishing&quot;), domain spoofing
          techniques, and how to verify destinations before taking action.
        </p>
      </section>

      <div className="space-y-8">
        {/* Topic 1: What is Quishing */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              What is QR Phishing (&quot;Quishing&quot;)?
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            QR code phishing (or &quot;quishing&quot;) occurs when an attacker
            tricks you into scanning a QR code that leads to a fraudulent
            website. Because humans cannot visually decode the black-and-white
            pixel matrix of a QR code, you cannot know where it points until
            your phone or camera app decodes it.
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-charcoal-950 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <strong>Real-World Risk:</strong> Attackers frequently target mobile
            devices because mobile screens have small address bars that truncate
            lengthy URLs, making it easier to hide deceptive domains.
          </div>
        </section>

        {/* Topic 2: Why HTTPS is Not Proof of Safety */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
              <Lock className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Why HTTPS Does Not Mean a Site is Trustworthy
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            A common misconception is that the padlock icon or{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              https://
            </code>{" "}
            guarantees a website is safe. In reality:
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <li>
              <strong>HTTPS only guarantees encryption in transit.</strong> It
              ensures that intermediate observers (such as people on the same
              coffee-shop Wi-Fi) cannot read or tamper with the communication.
            </li>
            <li>
              <strong>
                Attackers obtain free, automated SSL/TLS certificates.
              </strong>{" "}
              Today, over 80% of active phishing websites use HTTPS certificates
              issued by legitimate automated authorities.
            </li>
          </ul>
          <div className="mt-4 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <strong>Key Rule:</strong> HTTPS guarantees{" "}
            <em>encrypted transport</em> to the server you connected to, but it
            says nothing about whether the entity running that server is a
            thief.
          </div>
        </section>

        {/* Topic 3: How to Inspect Hostnames and Subdomains */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              How Subdomains Work &amp; Where to Look
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            In domain names, ownership is determined from right to left,
            anchored by the public suffix:
          </p>
          <div className="rounded-xl bg-slate-100 dark:bg-charcoal-950 p-4 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 space-y-2">
            <div>
              <span className="text-rose-600 font-bold">paypal.com</span>
              <span className="text-slate-500">.</span>
              <span className="text-amber-600 font-bold">attacker</span>
              <span className="text-slate-500">.</span>
              <span className="text-forest-600 font-bold">test</span>
              <span className="text-slate-500">/login</span>
            </div>
            <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
              &uarr; The brand &quot;paypal.com&quot; is just a subdomain! The
              true owner is{" "}
              <span className="font-bold text-amber-600">attacker.test</span>.
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Anyone who registers{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              attacker.test
            </code>{" "}
            can create unlimited subdomains, including{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              bank.com.attacker.test
            </code>
            . Always look at the domain directly before the public suffix.
          </p>
        </section>

        {/* Topic 4: The @ Symbol in URLs */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400">
              <AtSign className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              What the &quot;@&quot; Symbol Means in a Web Address
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            In standard URL syntax (RFC 3986), any text between the scheme and
            the{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              @
            </code>{" "}
            sign is treated as <em>user credentials</em>, not the server name:
          </p>
          <div className="rounded-xl bg-slate-100 dark:bg-charcoal-950 p-4 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
            https://
            <span className="text-slate-400 line-through">google.com</span>@
            <span className="font-bold text-rose-600">attacker.test</span>/
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your browser will completely ignore{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              google.com
            </code>{" "}
            and immediately open{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              attacker.test
            </code>
            . This is why Trinetra flags embedded credentials as high risk.
          </p>
        </section>

        {/* Topic 5: Punycode & Homoglyph Attacks */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Type className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Punycode and Visual Look-Alikes (Homoglyphs)
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            The Cyrillic letter{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              а
            </code>{" "}
            (U+0430) looks indistinguishable on screen from the standard Latin
            letter{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              a
            </code>{" "}
            (U+0061).
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Because domain names support international languages through
            Punycode (
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              xn--...
            </code>
            ), an attacker can register{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              xn--pple-43d.com
            </code>{" "}
            which displays visually as{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
              аpple.com
            </code>
            . Trinetra decodes Punycode and inspects each character for
            confusable homoglyphs.
          </p>
        </section>

        {/* Topic 6: Physical Parking & Payment QR Stickers */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
              <CreditCard className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Physical Parking Meter &amp; Payment Sticker Fraud
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            One of the fastest-growing real-world physical quishing scams
            involves printed stickers affixed over genuine municipal parking
            meters, electric vehicle charging stations, and restaurant tables:
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <li>
              <strong>Physical inspection:</strong> Feel the QR code. Is it a
              sticker pasted on top of an existing metal sign or acrylic stand?
            </li>
            <li>
              <strong>Verify the municipality:</strong> Legitimate city parking
              systems usually direct to well-known apps (e.g. ParkMobile,
              PayByPhone) or official city government domains (
              <code className="font-mono text-xs bg-slate-100 dark:bg-charcoal-800 px-1 py-0.5 rounded">
                .gov
              </code>
              ).
            </li>
            <li>
              <strong>Never rush:</strong> Scammers rely on drivers who are in a
              hurry to avoid parking tickets.
            </li>
          </ul>
        </section>

        {/* Topic 7: Why Clean Checks Don't Guarantee Safety */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-400">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Why a Clean Heuristic Result Does Not Guarantee Safety
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            No local scanner can prove that a destination is 100% benign. An
            attacker could:
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            <li>
              Register an entirely innocuous brand-new domain with zero previous
              abuse reports.
            </li>
            <li>
              Compromise a genuine, reputable website and host a
              credential-stealing form on a subpage.
            </li>
            <li>
              Host malicious files on legitimate cloud storage platforms (Google
              Drive, Microsoft Azure, Amazon S3).
            </li>
          </ul>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Trinetra empowers you to understand the structural signals and
            mechanics of links so you can make informed decisions. When in
            doubt, search for the official organization directly rather than
            following links from untrusted physical stickers.
          </p>
        </section>
      </div>
    </div>
  );
};
