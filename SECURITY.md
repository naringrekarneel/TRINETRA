# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The QRGuard team takes the security of this project seriously. If you discover a security vulnerability or security-relevant issue in QRGuard, please do not file a public issue on GitHub.

Instead, please report vulnerabilities by contacting the project maintainers:
- **Email:** security@example.com *(replace with official contact)*
- **GitHub Security Advisories:** Submit a private advisory via the repository's **Security** tab.

Please include:
- A description of the issue and potential impact
- Step-by-step instructions or proof-of-concept to reproduce the vulnerability
- Any proposed remediations or patches

We will acknowledge receipt within 48 hours and work towards a prompt disclosure and remediation timeline.

---

## Architecture & Privacy Model

QRGuard is built strictly according to privacy-preserving and secure-by-design principles:

1. **Client-Side QR Decoding:** Camera streams and uploaded QR code images are decoded entirely inside the client's browser using HTML5 Canvas / WASM. No image frames or raw files are uploaded to any server.
2. **Zero Default External Network Requests:** The URL security engine is entirely deterministic and runs locally. URLs entered or scanned are never broadcast, logged, or sent to third-party reputation trackers unless explicitly initiated or configured.
3. **No Automatic Navigation:** QRGuard never automatically navigates to decoded links, nor does it automatically dial numbers or join Wi-Fi networks.
4. **No Arbitrary Code Execution:** Decoded input is treated strictly as plain text or parsed through the standard Web `URL` constructor. Input is never evaluated as HTML or scripts.

## Heuristic Security Engine Limitations

QRGuard's URL analyzer operates through deterministic heuristic inspection of URL structure, Public Suffix List boundaries, syntax, homoglyphs, and known suspicious patterns.

**Important Notice:**
- A finding or heuristic warning is **not proof** that a website is malicious.
- The absence of heuristic findings is **not a guarantee** that a destination website is safe, legitimate, or free of malware or phishing.
- Attackers may host credential harvesting pages on reputable cloud providers, compromised domains, or clean vanity subdomains that exhibit valid syntax.
- Always exercise critical thinking ("Think Before You Scan") before entering credentials or sensitive data on any destination website.
