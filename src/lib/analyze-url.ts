import { Finding, AnalysisResult, AssessmentStatus } from "../types/security";
import { parseAndValidateURL } from "./url-parser";
import {
  parseDomainInfo,
  detectHomoglyphs,
  checkTyposquatting,
  isCommonlyAbusedTLD,
  findSuspiciousKeywords,
} from "./domain-utils";
import {
  KNOWN_URL_SHORTENERS,
  REDIRECT_PARAM_KEYS,
  BRAND_TARGETS,
  STANDARD_ANALYSIS_LIMITATIONS,
} from "./constants";

export interface RuleContext {
  rawInput: string;
  url: URL;
  hostname: string;
  unicodeHostname: string;
  domain: string;
  domainWithoutSuffix: string;
  subdomain: string;
  publicSuffix: string;
  isIp: boolean;
  isIpv4: boolean;
  isIpv6: boolean;
}

export type SecurityRule = (ctx: RuleContext) => Finding | null;

/**
 * Rule 1: Non-HTTPS HTTP URLs
 */
export const checkNonHttps: SecurityRule = (ctx) => {
  if (ctx.url.protocol === "http:") {
    return {
      id: "rule-non-https",
      severity: "medium",
      title: "Unencrypted HTTP Connection",
      description:
        "This link uses unencrypted HTTP. Data sent to or from this website can be intercepted or altered by anyone on the local network (such as public Wi-Fi).",
      evidence: `Protocol: ${ctx.url.protocol}`,
      recommendation:
        "Avoid submitting passwords, payment details, or sensitive information on unencrypted websites.",
    };
  }
  return null;
};

/**
 * Rule 2: User information embedded before hostname (e.g. https://user@host)
 */
export const checkEmbeddedCredentials: SecurityRule = (ctx) => {
  if (ctx.url.username || ctx.url.password) {
    const credInfo = ctx.url.password
      ? `${ctx.url.username}:***`
      : ctx.url.username;
    return {
      id: "rule-embedded-credentials",
      severity: "high",
      title: "Embedded Credentials / Misleading Host Prefix",
      description:
        'The URL contains user credentials or an "@" symbol before the actual hostname. Attackers frequently use this technique to deceive users into thinking they are visiting the domain before the "@".',
      evidence: `Auth prefix: ${credInfo}@ -> Target host: ${ctx.hostname}`,
      recommendation:
        'Do not trust this link. The browser will navigate to the destination after the "@", not the brand displayed before it.',
    };
  }
  return null;
};

/**
 * Rule 3: Punycode and Internationalized Domain Names (xn--)
 */
export const checkPunycodeHostname: SecurityRule = (ctx) => {
  if (ctx.hostname.includes("xn--")) {
    return {
      id: "rule-punycode-hostname",
      severity: "medium",
      title: "Punycode Internationalized Domain (IDN)",
      description:
        "This domain uses Punycode encoding (xn--). While legitimate for non-Latin languages, Punycode is often abused in homograph phishing attacks to visually spoof popular Latin-character brand names.",
      evidence: `Punycode host: ${ctx.hostname}`,
      recommendation:
        "Verify that the intended language of the domain matches your expectation and check for character spoofing.",
    };
  }
  return null;
};

/**
 * Rule 4: Unicode look-alike character concerns (homoglyphs / mixed scripts)
 */
export const checkHomoglyphs: SecurityRule = (ctx) => {
  const homoglyphs = detectHomoglyphs(ctx.unicodeHostname || ctx.hostname);
  if (homoglyphs.hasHomoglyphs) {
    const sample = homoglyphs.confusableChars
      .slice(0, 3)
      .map((c) => `"${c.char}" (${c.codePoint}) resembles "${c.looksLike}"`)
      .join(", ");

    return {
      id: "rule-homoglyph-confusables",
      severity: homoglyphs.hasMixedScript ? "high" : "medium",
      title: homoglyphs.hasMixedScript
        ? "Mixed-Script Homoglyph Attack Detected"
        : "Confusable Unicode Look-Alike Characters Detected",
      description:
        "The hostname contains characters from non-Latin alphabets (such as Cyrillic or Greek) that look identical or nearly identical to standard Latin letters.",
      evidence: `Look-alikes: ${sample}. Normalized representation: "${homoglyphs.normalizedCandidate}"`,
      recommendation:
        "Exercise extreme caution. This domain may be an IDN homograph clone designed to impersonate another service.",
    };
  }
  return null;
};

/**
 * Rule 5: Suspicious subdomain structures
 */
export const checkSubdomainStructure: SecurityRule = (ctx) => {
  if (ctx.subdomain) {
    const parts = ctx.subdomain.split(".").filter(Boolean);
    if (parts.length >= 3) {
      return {
        id: "rule-deep-subdomain",
        severity: "medium",
        title: "Excessive Subdomain Depth",
        description: `This URL contains ${parts.length} subdomain levels. Attackers often chain subdomains to push the actual registered domain out of view on mobile screens.`,
        evidence: `Subdomains: ${ctx.subdomain} (Registrable domain: ${ctx.domain})`,
        recommendation:
          "Inspect the rightmost registrable domain rather than the beginning of the link.",
      };
    }
  }
  return null;
};

/**
 * Rule 6: URL shorteners and indirect links
 */
export const checkUrlShortener: SecurityRule = (ctx) => {
  if (
    KNOWN_URL_SHORTENERS.has(ctx.domain.toLowerCase()) ||
    KNOWN_URL_SHORTENERS.has(ctx.hostname.toLowerCase())
  ) {
    return {
      id: "rule-url-shortener",
      severity: "medium",
      title: "Known URL Shortener Detected",
      description:
        "This link uses a URL redirection or shortening service. The true final destination is hidden until the redirect occurs.",
      evidence: `Shortener host: ${ctx.hostname}`,
      recommendation:
        "Be cautious when scanning shortened QR codes in public places, as they can conceal arbitrary phishing or malware sites.",
    };
  }
  return null;
};

/**
 * Rule 7: Raw IPv4 or IPv6 hosts
 */
export const checkIpAddressHost: SecurityRule = (ctx) => {
  if (ctx.isIp) {
    return {
      id: "rule-ip-address-host",
      severity: "high",
      title: "Raw IP Address Hostname",
      description:
        "The link uses an IP address directly instead of a registered domain name. Legitimate public services almost always use domain names with verified TLS certificates.",
      evidence: `IP Host: ${ctx.hostname} (${ctx.isIpv4 ? "IPv4" : "IPv6"})`,
      recommendation:
        "Avoid visiting raw IP addresses unless you are deliberately accessing a known private device or internal network.",
    };
  }
  return null;
};

/**
 * Rule 8: Unexpected or uncommon ports
 */
export const checkUnexpectedPort: SecurityRule = (ctx) => {
  if (ctx.url.port) {
    const portNum = parseInt(ctx.url.port, 10);
    const standardPorts = ctx.url.protocol === "https:" ? [443] : [80];

    if (!standardPorts.includes(portNum)) {
      return {
        id: "rule-unexpected-port",
        severity: "medium",
        title: "Non-Standard Web Port",
        description: `The URL connects to non-standard port :${portNum}. Standard web traffic uses port 443 (HTTPS) or 80 (HTTP).`,
        evidence: `Port: :${ctx.url.port}`,
        recommendation:
          "Unusual ports may indicate testing servers, alternate proxies, or evasion of standard web filtering.",
      };
    }
  }
  return null;
};

/**
 * Rule 9: Excessively long hostnames or URL components
 */
export const checkExcessiveLength: SecurityRule = (ctx) => {
  const fullLength = ctx.rawInput.length;
  const hostLength = ctx.hostname.length;
  const longestLabel = Math.max(
    ...ctx.hostname.split(".").map((lbl) => lbl.length),
    0,
  );

  if (fullLength > 255 || hostLength > 100 || longestLabel > 63) {
    return {
      id: "rule-excessive-length",
      severity: "low",
      title: "Excessively Long URL or Hostname",
      description:
        "The URL or one of its components is unusually long. Abnormally long URLs are often used to truncate address bars on mobile browsers.",
      evidence: `Full URL length: ${fullLength} chars; Host length: ${hostLength} chars`,
      recommendation:
        "Verify the full URL carefully to ensure no hidden redirect or tracking parameters exist.",
    };
  }
  return null;
};

/**
 * Rule 10: Suspicious use of percent encoding
 */
export const checkSuspiciousEncoding: SecurityRule = (ctx) => {
  const raw = ctx.rawInput.toLowerCase();
  // Check double encoding (%25), encoded slashes (%2f), encoded dots (%2e), encoded @ (%40)
  const hasDoubleEncoding = /%25[0-9a-f]{2}/i.test(raw);
  const hasEncodedSlash =
    /%2f/i.test(ctx.url.pathname) || /%2f/i.test(ctx.hostname);
  const hasEncodedAt = /%40/i.test(raw);
  const hasEncodedDot = /%2e/i.test(raw);

  if (hasDoubleEncoding || hasEncodedSlash || hasEncodedAt || hasEncodedDot) {
    const reasons: string[] = [];
    if (hasDoubleEncoding) reasons.push("Double percent-encoding (%25)");
    if (hasEncodedSlash) reasons.push("Encoded slash (%2F)");
    if (hasEncodedAt) reasons.push("Encoded @ symbol (%40)");
    if (hasEncodedDot) reasons.push("Encoded dot (%2E)");

    return {
      id: "rule-suspicious-encoding",
      severity: "medium",
      title: "Suspicious Percent-Encoding in URL",
      description:
        "The URL contains percent-encoded delimiters (such as encoded slashes, dots, or double-encoding). Attackers frequently use encoding anomalies to bypass web filters and deceive URL parsers.",
      evidence: reasons.join(", "),
      recommendation:
        "Verify the destination carefully to ensure it is not obscuring path traversal or credentials.",
    };
  }
  return null;
};

/**
 * Rule 11: Misleading brand names in subdomains or paths
 */
export const checkMisleadingBrandPlacement: SecurityRule = (ctx) => {
  const registrableBase = ctx.domainWithoutSuffix.toLowerCase();

  for (const brand of BRAND_TARGETS) {
    // If the brand is the legitimate registrable domain, it's expected
    if (registrableBase === brand) continue;

    // Check if brand appears in the subdomain (e.g. paypal.com.attacker.com or apple-login.phish.com)
    const inSubdomain =
      ctx.subdomain &&
      new RegExp(`(^|[-._])${brand}([-._]|$)`, "i").test(ctx.subdomain);

    // Check if brand appears in the first path segment (e.g. attacker.com/paypal/login or /apple.com/)
    const pathFirstSegment = ctx.url.pathname.split("/")[1] || "";
    const inPath = new RegExp(`(^|[-._])${brand}([-._]|$)`, "i").test(
      pathFirstSegment,
    );

    // Check if brand appears as a delimited token in the domain name itself (combosquatting)
    // e.g. "signin-ebay-accounts-review" contains "ebay" but the registrable domain is not legitimate ebay
    const inDomainLabel =
      registrableBase !== brand &&
      new RegExp(`(^|[-_])${brand}([-_]|$)`, "i").test(registrableBase);

    if (inSubdomain || inPath || inDomainLabel) {
      const locationText = inDomainLabel
        ? "domain name (combosquatting)"
        : inSubdomain
        ? "subdomain"
        : "path";

      return {
        id: "rule-misleading-brand-placement",
        severity: "high",
        title: inDomainLabel
          ? `Deceptive Brand Keyword (${brand}) in Registered Domain Name`
          : `Deceptive Brand Keyword (${brand}) Outside Main Domain`,
        description: inDomainLabel
          ? `The registered domain "${ctx.domain}" incorporates the well-known brand "${brand}" alongside other words. Attackers frequently register brand-combo domains to impersonate legitimate services and lure victims into credential theft.`
          : `The known brand "${brand}" appears in the ${locationText}, but the actual registered destination domain is "${ctx.domain}". This is a very common brand-impersonation technique.`,
        evidence: `Brand: "${brand}" located in ${locationText}, while registered domain is "${ctx.domain}"`,
        recommendation: `Do not log in or trust this page. The site belongs to "${ctx.domain}", NOT ${brand}.`,
      };
    }
  }
  return null;
};

/**
 * Rule 12: Multiple redirect-related parameters
 */
export const checkRedirectParameters: SecurityRule = (ctx) => {
  const foundParams: string[] = [];
  ctx.url.searchParams.forEach((val, key) => {
    const isRedirectKey = REDIRECT_PARAM_KEYS.has(key.toLowerCase());
    const isUrlVal = /^https?:\/\//i.test(val) || /^https?%3A%2F%2F/i.test(val);
    if (isRedirectKey || isUrlVal || (isRedirectKey && val.includes("."))) {
      foundParams.push(
        `${key}=${val.length > 35 ? val.substring(0, 35) + "..." : val}`,
      );
    }
  });

  if (foundParams.length > 0) {
    return {
      id: "rule-redirect-parameter",
      severity: "low",
      title: "Potential Open Redirect Parameter",
      description:
        "The URL contains query parameters frequently associated with redirects or forwarding. Untrusted redirectors can redirect visitors to malicious sites after the initial click.",
      evidence: `Parameters: ${foundParams.join(", ")}`,
      recommendation:
        "Inspect the parameter destination to verify where you will actually be directed.",
    };
  }
  return null;
};

/**
 * Rule 13: Hostnames visually similar to explicitly configured brand examples (typosquatting)
 */
export const checkBrandTyposquatting: SecurityRule = (ctx) => {
  if (ctx.isIp) return null;

  const match = checkTyposquatting(ctx.domainWithoutSuffix, BRAND_TARGETS);
  if (match) {
    return {
      id: "rule-typosquatting",
      severity: "high",
      title: `Potential Typosquatting of Brand "${match.brand}"`,
      description: `The domain "${ctx.domainWithoutSuffix}" is visually almost identical to the well-known brand "${match.brand}" (edit distance: ${match.distance}). Typosquatting domains are registered to prey on typing errors and trick users into phishing sites.`,
      evidence: `Observed: "${match.observed}" (Target brand: "${match.brand}")`,
      recommendation: `Check if you meant to visit the official ${match.brand} website instead. Avoid entering sensitive data.`,
    };
  }
  return null;
};

/**
 * Rule 14: Potentially misleading hostname suffixes or suspicious TLDs
 */
export const checkMisleadingSuffixAndTld: SecurityRule = (ctx) => {
  const isAbusedTld = isCommonlyAbusedTLD(ctx.publicSuffix);
  const keywords = findSuspiciousKeywords(ctx.hostname);

  if (isAbusedTld && keywords.length > 0) {
    return {
      id: "rule-suspicious-tld-keyword",
      severity: "high",
      title: "Suspicious Security Keyword on High-Risk TLD",
      description: `The domain combines sensitive keywords (${keywords.join(", ")}) with a top-level domain (.${ctx.publicSuffix}) frequently associated with phishing or spam.`,
      evidence: `TLD: .${ctx.publicSuffix}, Keywords: ${keywords.join(", ")}`,
      recommendation:
        "High caution advised. Public authentication or payment portals rarely operate on high-risk generic TLDs.",
    };
  } else if (keywords.length > 0 && !ctx.isIp) {
    return {
      id: "rule-suspicious-keywords",
      severity: "low",
      title: "Sensitive Security/Auth Keywords in Hostname",
      description: `The hostname contains authentication or banking terms (${keywords.join(", ")}). While legitimate services use these keywords, verify that this is your genuine provider.`,
      evidence: `Keywords observed: ${keywords.join(", ")}`,
      recommendation:
        "Verify the domain identity against your official provider before entering credentials.",
    };
  } else if (isAbusedTld) {
    return {
      id: "rule-high-risk-tld",
      severity: "low",
      title: "High-Abuse Top-Level Domain",
      description: `This website uses .${ctx.publicSuffix}, a top-level domain with statistically higher rates of abuse according to security industry reporting.`,
      evidence: `TLD: .${ctx.publicSuffix}`,
      recommendation:
        "Verify the sender or creator of the link or QR code before continuing.",
    };
  }

  return null;
};

export const ALL_SECURITY_RULES: SecurityRule[] = [
  checkNonHttps,
  checkEmbeddedCredentials,
  checkPunycodeHostname,
  checkHomoglyphs,
  checkSubdomainStructure,
  checkUrlShortener,
  checkIpAddressHost,
  checkUnexpectedPort,
  checkExcessiveLength,
  checkSuspiciousEncoding,
  checkMisleadingBrandPlacement,
  checkRedirectParameters,
  checkBrandTyposquatting,
  checkMisleadingSuffixAndTld,
];

/**
 * Helper to identify and extract any embedded HTTP/HTTPS redirect target URL.
 */
export function extractNestedRedirectUrl(url: URL): { param: string; targetUrl: string } | null {
  for (const [key, val] of url.searchParams.entries()) {
    const trimmed = val.trim();
    if (!trimmed) continue;

    // Direct HTTP or HTTPS URL in parameter value
    if (/^https?:\/\//i.test(trimmed)) {
      return { param: key, targetUrl: trimmed };
    }

    // URL-encoded HTTP or HTTPS URL (e.g. http%3A%2F%2F...)
    if (/^https?%3A%2F%2F/i.test(trimmed)) {
      try {
        const decoded = decodeURIComponent(trimmed);
        if (/^https?:\/\//i.test(decoded)) {
          return { param: key, targetUrl: decoded };
        }
      } catch {
        // ignore
      }
    }

    // Known redirect parameter key with domain-like value
    if (REDIRECT_PARAM_KEYS.has(key.toLowerCase())) {
      try {
        const decoded = decodeURIComponent(trimmed);
        if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(decoded)) {
          return { param: key, targetUrl: "http://" + decoded };
        }
      } catch {
        // ignore
      }
    }
  }
  return null;
}

/**
 * Executes all modular security analysis rules against the validated URL context.
 */
export function analyzeURL(rawInput: string, depth = 0): AnalysisResult {
  const parseResult = parseAndValidateURL(rawInput);

  if (!parseResult.success || !parseResult.details) {
    return {
      input: rawInput,
      isWebUrl: false,
      status: "review-recommended",
      statusLabel: "Invalid or Unsupported URL",
      statusDescription:
        parseResult.error ||
        "The provided input cannot be parsed as a valid web link.",
      findings: [
        {
          id: "error-invalid-syntax",
          severity: "high",
          title: "Invalid or Unsupported Link",
          description:
            parseResult.error ||
            "The input is not a recognized HTTP or HTTPS web URL.",
          recommendation: "Do not attempt to open this destination.",
        },
      ],
      limitations: STANDARD_ANALYSIS_LIMITATIONS,
      analyzedAt: new Date().toISOString(),
    };
  }

  const details = parseResult.details;
  let parsedUrlObj: URL;
  try {
    parsedUrlObj = new URL(details.normalizedUrl);
  } catch {
    // Fallback if URL object fails
    parsedUrlObj = new URL("https://" + details.hostname);
  }

  const domainInfo = parseDomainInfo(details.hostname);

  const context: RuleContext = {
    rawInput: details.rawInput,
    url: parsedUrlObj,
    hostname: details.hostname,
    unicodeHostname: details.unicodeHostname,
    domain: domainInfo.domain,
    domainWithoutSuffix: domainInfo.domainWithoutSuffix,
    subdomain: domainInfo.subdomain,
    publicSuffix: domainInfo.publicSuffix,
    isIp: details.isIpv4 || details.isIpv6,
    isIpv4: details.isIpv4,
    isIpv6: details.isIpv6,
  };

  // Run all standard rules
  const findings: Finding[] = [];
  for (const rule of ALL_SECURITY_RULES) {
    try {
      const finding = rule(context);
      if (finding) {
        findings.push(finding);
      }
    } catch {
      // Continue running remaining rules even if one fails
    }
  }

  // Deep inspection of intermediate redirect wrappers (e.g. google.com/url?q=http://phish...)
  let redirectTarget: AnalysisResult["redirectTarget"] = undefined;

  if (depth < 2) {
    const nested = extractNestedRedirectUrl(parsedUrlObj);
    if (nested) {
      try {
        const nestedUrlObj = new URL(nested.targetUrl);
        const isExternal =
          nestedUrlObj.hostname.toLowerCase() !== details.hostname.toLowerCase() &&
          !nestedUrlObj.hostname.toLowerCase().endsWith("." + domainInfo.domain.toLowerCase());

        if (isExternal) {
          // Analyze the hidden destination
          const targetResult = analyzeURL(nested.targetUrl, depth + 1);

          // Add a high-severity finding exposing the cloaked redirect
          findings.unshift({
            id: "rule-open-redirect-wrapper",
            severity: "high",
            title: `Cloaked Phishing Link via Intermediate Redirector (${details.hostname})`,
            description: `This link routes through ${details.hostname} (via parameter "${nested.param}") to mask the real destination. Attackers frequently abuse trusted domains (like Google /url redirectors) in phishing emails so the link appears safe to victims and spam filters while forwarding to an untrusted external site.`,
            evidence: `Intermediary Host: ${details.hostname} (param: "${nested.param}") -> True Destination: ${nested.targetUrl}`,
            recommendation: `Do NOT trust this link because it begins with "${details.hostname}". Inspect and verify the true destination: ${nestedUrlObj.hostname}.`,
          });

          // Import findings from target destination
          for (const tf of targetResult.findings) {
            findings.push({
              ...tf,
              id: `target-${tf.id}`,
              title: `[Destination: ${nestedUrlObj.hostname}] ${tf.title}`,
            });
          }

          redirectTarget = {
            targetUrl: nested.targetUrl,
            targetHostname: nestedUrlObj.hostname,
            targetProtocol: nestedUrlObj.protocol,
            paramName: nested.param,
            intermediaryHostname: details.hostname,
            findings: targetResult.findings,
          };
        }
      } catch {
        // Ignore if nested URL is malformed
      }
    }
  }

  // Determine overall status
  const highCount = findings.filter((f) => f.severity === "high").length;
  const mediumCount = findings.filter((f) => f.severity === "medium").length;

  let status: AssessmentStatus = "no-warnings";
  let statusLabel = "No heuristic warnings detected";
  let statusDescription =
    "No suspicious structural patterns were identified by the local heuristic rules engine. This does not guarantee that the website is safe.";

  if (highCount > 0 || mediumCount >= 2) {
    status = "suspicious";
    statusLabel = redirectTarget
      ? "Cloaked Redirect / Phishing Target Detected"
      : "Multiple suspicious patterns detected";
    statusDescription = redirectTarget
      ? `This link routes through ${details.hostname} to mask an external target (${redirectTarget.targetHostname}) with suspicious security indicators.`
      : "Several high-risk or suspicious indicators were detected in the URL structure. Review all findings carefully.";
  } else if (findings.length > 0) {
    status = "review-recommended";
    statusLabel = "Review recommended";
    statusDescription =
      "One or more heuristic alerts were flagged. Inspect the findings before deciding to continue.";
  }

  return {
    input: rawInput,
    normalizedUrl: details.normalizedUrl,
    parsedDetails: details,
    hostname: details.hostname,
    protocol: details.protocol,
    isWebUrl: true,
    status,
    statusLabel,
    statusDescription,
    findings,
    limitations: STANDARD_ANALYSIS_LIMITATIONS,
    analyzedAt: new Date().toISOString(),
    redirectTarget,
  };
}
