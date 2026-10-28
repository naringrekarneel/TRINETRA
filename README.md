# Trinetra — Think Before You Scan

[![CI](https://github.com/placeholder-org/trinetra/actions/workflows/ci.yml/badge.svg)](https://github.com/placeholder-org/trinetra/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-forest.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)

> **"Think Before You Scan."**  
> A client-side, privacy-first cybersecurity utility to inspect links and QR codes for suspicious patterns before opening their destinations.

---

## Table of Contents

1. [Overview & Problem Statement](#overview--problem-statement)
2. [Key Features](#key-features)
3. [Privacy Architecture](#privacy-architecture)
4. [Heuristic Detection Engine (14 Rules)](#heuristic-detection-engine-14-rules)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Getting Started & Local Development](#getting-started--local-development)
8. [Automated Testing](#automated-testing)
9. [Deployment (Vercel)](#deployment-vercel)
10. [Heuristic Limitations & Disclaimers](#heuristic-limitations--disclaimers)
11. [Contributing & Security Policy](#contributing--security-policy)
12. [License](#license)

---

## Overview & Problem Statement

QR codes have become ubiquitous across restaurant menus, public parking meters, event posters, transit hubs, and SMS notifications. Because humans cannot visually decode the two-dimensional pixel matrix of a QR code, malicious actors increasingly exploit them through **"quishing"** (QR phishing).

Attackers physically paste deceptive QR stickers over legitimate parking meters, embed credentials before hostnames, register typosquatted domains, and hide destinations behind multi-level subdomains or URL shorteners.

**Trinetra** solves this by offering an instant, zero-upload inspection workflow that explains potential risks in plain language **before** you visit the website.

---

## Key Features

- **Check a Link**: Paste or enter any destination URL for structural and security inspection.
- **Live Camera QR Scanning**: Point your device camera (rear-facing on mobile) at any QR code with real-time targeting and frame detection.
- **Image Upload Decoding**: Drag-and-drop or upload PNG, JPEG, WEBP, or SVG images containing QR codes.
- **Shared Analysis Engine**: Both entry points feed into the exact same deterministic rules engine for consistent security findings.
- **Content Classification**: Distinguishes between Web URLs, Wi-Fi networks, vCard contacts, email links, phone numbers, SMS messages, and blocked schemes (`javascript:`, `data:`, `file:`).
- **Safe Website Continuation**: Never automatically navigates to scanned links. Opens exclusively on deliberate user confirmation with `target="_blank"` and `rel="noopener noreferrer"`.
- **Honest Assessments**: Rejects arbitrary or misleading confidence scores (e.g. "98% Safe"). If no heuristic flags are found, it transparently states *"No heuristic warnings detected"* while explaining what could and could not be verified.
- **Accessibility & Contrast**: Built to meet WCAG 2.2 AA guidelines with keyboard navigation, visible focus indicators, semantic HTML, and light/dark theme support.

---

## Privacy Architecture

Privacy is not an afterthought in Trinetra; it is a core design constraint:

1. **100% In-Browser Decoding**: Camera streams and uploaded images are processed entirely inside the client browser using HTML5 Canvas and WebAssembly. **No image is ever uploaded to any server.**
2. **Zero Default Telemetry**: No third-party analytics, tracking scripts, or error loggers capture the links you inspect.
3. **No Database / No Accounts**: Trinetra requires no accounts, passwords, or payment info.
4. **No External API Keys**: Core functionality requires no third-party reputation lookups or external API tokens.

---

## Heuristic Detection Engine (14 Rules)

Trinetra executes 14 modular, explainable security rules against every parsed web link:

| # | Rule Identifier | Severity | Threat Explained |
|---|-----------------|----------|------------------|
| 1 | `rule-non-https` | Medium | Unencrypted HTTP connection susceptible to eavesdropping on public Wi-Fi. |
| 2 | `rule-embedded-credentials` | High | User credentials before the `@` symbol (e.g. `https://google.com@attacker.test/`) deceiving users about the true destination. |
| 3 | `rule-punycode-hostname` | Medium | Internationalized Domain Names (`xn--...`) often used in visual homograph attacks. |
| 4 | `rule-homoglyph-confusables` | High | Mixed-script look-alikes (e.g., Cyrillic `а` vs Latin `a` in `аpple.com`). |
| 5 | `rule-deep-subdomain` | Medium | &ge;3 subdomain levels used to push the registrable domain out of view on mobile screens. |
| 6 | `rule-url-shortener` | Medium | Shorteners (`bit.ly`, `tinyurl.com`, etc.) concealing the true destination. |
| 7 | `rule-ip-address-host` | High | Raw IPv4/IPv6 addresses bypassing domain registration and reputation. |
| 8 | `rule-unexpected-port` | Medium | Non-standard web ports (other than 80 or 443). |
| 9 | `rule-excessive-length` | Low | Abnormally long URLs engineered to truncate mobile browser address bars. |
| 10 | `rule-suspicious-encoding` | Medium | Percent-encoded delimiters (`%2F`, `%40`, `%2E`, double `%25`) used for filter evasion. |
| 11 | `rule-misleading-brand-placement` | High | Trusted brand keywords placed in subdomains or paths of unrelated domains (e.g., `paypal.com.attacker.test`). |
| 12 | `rule-redirect-parameter` | Low | Open redirect parameters (`?redirect_url=`, `?next=`, `?dest=`). |
| 13 | `rule-typosquatting` | High | Levenshtein edit distance detecting look-alike brand domains (e.g., `paypa1.com`, `gooogle.com`). |
| 14 | `rule-suspicious-tld-keyword` | High | High-abuse generic TLDs combined with banking or authentication keywords. |

### Public Suffix List Integration

Trinetra strictly avoids naive substring checks like `hostname.includes("paypal.com")`. Instead, it uses Mozilla's **Public Suffix List** (via `tldts`) to accurately delineate registrable domains from multi-part public suffixes like `.co.uk`, `.gov.uk`, or `.github.io`.

---

## Tech Stack

- **Frontend**: React 18, TypeScript (strict mode), Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **QR Decoding**: `html5-qrcode`
- **Domain Analysis**: `tldts`
- **Unit / Component Testing**: Vitest, React Testing Library, `@testing-library/user-event`, `jsdom`
- **E2E Testing**: Playwright
- **Linting & Code Quality**: ESLint 9, Prettier
- **Hosting**: Vercel (static single-page application)

---

## Project Structure

```
trinetra/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline
├── e2e/
│   └── qrguard.spec.ts          # Playwright end-to-end tests
├── public/
│   ├── favicon.svg              # SVG shield & QR brand icon
│   └── robots.txt               # Web crawler instructions
├── src/
│   ├── components/
│   │   ├── analyzer/
│   │   │   ├── LinkInput.tsx        # URL input, clipboard paste, validation
│   │   │   ├── SecurityResults.tsx  # Unified assessment, safe navigation
│   │   │   ├── URLDetails.tsx       # Hostname, protocol, and domain breakdown
│   │   │   └── WarningCard.tsx      # Finding card with recommendation
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Brand, nav, theme toggle, mobile drawer
│   │   │   ├── Footer.tsx           # Privacy banner, links, disclaimers
│   │   │   └── PageContainer.tsx    # Skip link and semantic main shell
│   │   ├── scanner/
│   │   │   ├── CameraPermissionState.tsx # Permission prompts & error states
│   │   │   ├── QRImageUpload.tsx    # Client-side image drag & drop decoder
│   │   │   └── QRScanner.tsx        # Camera scanning viewfinder
│   │   └── ui/
│   │       ├── Badge.tsx            # Severity badges with accessible text
│   │       ├── Button.tsx           # Accessible button variants
│   │       └── Card.tsx             # Card containers
│   ├── hooks/
│   │   ├── useQRScanner.ts      # Camera lifecycle, cleanup, and error handling
│   │   └── useTheme.ts          # Dark/light theme toggle
│   ├── lib/
│   │   ├── analyze-text.ts      # QR payload classifier (Wi-Fi, vCard, URLs)
│   │   ├── analyze-url.ts       # 14-rule security engine
│   │   ├── constants.ts         # Brand lists, high-risk TLDs, homoglyph map
│   │   ├── domain-utils.ts      # PSL parsing, Levenshtein, Punycode decoder
│   │   └── url-parser.ts        # WHATWG URL parser & scheme validator
│   ├── pages/
│   │   ├── AboutPage.tsx        # Transparency, third-party libraries, limitations
│   │   ├── HomePage.tsx         # Main entry point (Check Link / Scan QR)
│   │   ├── HowItWorksPage.tsx   # 5-step analysis pipeline breakdown
│   │   └── SecurityGuidePage.tsx# Educational quishing and URL guide
│   ├── types/
│   │   └── security.ts          # TypeScript domain and finding types
│   ├── App.tsx                  # Client-side routing configuration
│   ├── index.css                # Tailwind directives and motion styles
│   └── main.tsx                 # React entrypoint
├── tests/
│   ├── components/              # Component tests for LinkInput, Scanner, Results
│   ├── analyze-text.test.ts     # QR classifier unit tests
│   ├── analyze-url.test.ts      # 14 security rules unit tests
│   ├── domain-utils.test.ts     # PSL, homoglyphs, and typosquat tests
│   ├── setup.ts                 # Vitest testing setup
│   └── url-parser.test.ts       # Scheme validation and URL parser tests
├── .env.example                 # Example environment variables
├── .gitignore                   # Standard Git ignore list
├── CODE_OF_CONDUCT.md           # Community code of conduct
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # MIT License
├── package.json                 # Dependencies and scripts
├── playwright.config.ts         # Playwright test configuration
├── postcss.config.js            # PostCSS configuration
├── README.md                    # Project documentation
├── SECURITY.md                  # Vulnerability reporting policy
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript strict configuration
└── vercel.json                  # Vercel deployment and routing rules
```

---

## Getting Started & Local Development

### Prerequisites

- **Node.js**: >= 18.0.0 (Node 20+ or 22+ recommended)
- **npm**: >= 9.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/placeholder-org/trinetra.git
cd trinetra

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Automated Testing

Trinetra features an extensive test suite covering unit heuristics, domain parsing, component interactions, and browser end-to-end flows:

```bash
# Run all unit and component tests (Vitest)
npm test

# Run tests in watch mode
npm run test:watch

# Run TypeScript strict typecheck
npm run typecheck

# Run linter
npm run lint

# Run end-to-end browser tests (Playwright)
npm run test:e2e
```

---

## Deployment (Vercel)

Trinetra is configured for zero-configuration static deployment on Vercel:

1. **Output Directory**: `dist`
2. **Build Command**: `npm run build`
3. **Install Command**: `npm install` (or `npm ci`)
4. **Client Routing**: Configured in `vercel.json` with rewrite rules sending `/*` to `/index.html` and security headers (`Permissions-Policy: camera=(self)`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).

### Deploy via Vercel CLI

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy
vercel
```

---

## Heuristic Limitations & Disclaimers

> [!IMPORTANT]
> - **Heuristics are not an antivirus or live malware sandbox.** Trinetra inspects URL syntax and structural anomalies. It does not fetch remote HTML payloads, download files, or execute live JavaScript.
> - **Clean checks are not an endorsement of absolute safety.** Attackers can host malicious credential harvesting forms on legitimate cloud providers or newly registered domains without triggering structural heuristics.
> - Always exercise critical thinking (**"Think Before You Scan"**) before entering sensitive information on any external website.

---

## Contributing & Security Policy

We welcome community contributions, additional heuristic rules, and UI improvements!
- Review [CONTRIBUTING.md](./CONTRIBUTING.md) for local workflow details.
- Review [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community standards.
- Review [SECURITY.md](./SECURITY.md) for private vulnerability disclosure instructions.

---

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.
