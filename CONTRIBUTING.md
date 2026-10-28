# Contributing to Trinetra

Thank you for your interest in contributing to **Trinetra — Think Before You Scan**! We welcome community contributions to improve security heuristics, accessibility, UI/UX, and testing.

## Table of Contents
1. [Development Environment Setup](#development-environment-setup)
2. [Project Architecture](#project-architecture)
3. [Branching & Commit Guidelines](#branching--commit-guidelines)
4. [Writing Detection Rules](#writing-detection-rules)
5. [Testing & Quality Verification](#testing--quality-verification)
6. [Submitting a Pull Request](#submitting-a-pull-request)

---

## Development Environment Setup

Ensure you have:
- Node.js >= 18.0.0 (Node 20+ or 22+ recommended)
- npm >= 9.0.0

```bash
# Clone the repository
git clone https://github.com/placeholder-org/trinetra.git
cd trinetra

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Project Architecture

```
trinetra/
├── src/
│   ├── components/
│   │   ├── analyzer/       # Link input, URL details, findings, warning cards
│   │   ├── layout/         # Header, Footer, PageContainer, Navigation
│   │   ├── scanner/        # Live QR camera, Image upload, status indicators
│   │   └── ui/             # Reusable UI primitives (Buttons, Cards, Badges)
│   ├── hooks/              # Custom hooks (e.g. useQRScanner, useTheme)
│   ├── lib/                # URL parser, security rules engine, domain utilities
│   ├── pages/              # Home, How It Works, Security Guide, About
│   ├── types/              # TypeScript definitions for findings and security
│   ├── App.tsx             # Main routing and global layout
│   └── main.tsx            # App entrypoint
├── tests/                  # Unit and integration tests (Vitest)
└── e2e/                    # End-to-end tests (Playwright)
```

---

## Writing Detection Rules

All URL analysis rules live in `src/lib/analyze-url.ts` or modular rule files.
When adding or modifying a rule:
1. Ensure the rule is deterministic and explainable.
2. Return a structured `Finding` with:
   - `id`: Unique identifier (e.g., `rule-embedded-credentials`)
   - `severity`: `"info"` | `"low"` | `"medium"` | `"high"`
   - `title`: Short descriptive title
   - `description`: Plain-language explanation of why this pattern is suspicious
   - `evidence`: Specific observed token or value
   - `recommendation`: Actionable guidance for the user
3. Never use naive substring matching such as `hostname.includes("paypal.com")`. Always rely on `tldts` Public Suffix List boundaries and exact hostname or validated subdomain checks.
4. Add unit test coverage in `tests/analyze-url.test.ts`.

---

## Testing & Quality Verification

Before submitting a pull request, run all verification scripts:

```bash
# Type check TypeScript in strict mode
npm run typecheck

# Run linter
npm run lint

# Run automated tests
npm test

# Verify production build
npm run build
```

---

## Submitting a Pull Request

1. Fork the repository and create your branch from `main`:
   `git checkout -b feature/your-feature-name`
2. Keep pull requests focused on a single concern.
3. Include tests covering new functionality or bug fixes.
4. Follow the existing code style and formatting (`npm run format`).
5. Open a pull request against `main` with a clear explanation of changes and rationale.
