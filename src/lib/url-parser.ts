import { UNSUPPORTED_DANGEROUS_SCHEMES } from "./constants";
import {
  parseDomainInfo,
  isIPv4Address,
  isIPv6Address,
  punycodeToUnicode,
} from "./domain-utils";
import { ParsedURLDetails } from "../types/security";

export interface URLParseResult {
  success: boolean;
  isWebUrl: boolean;
  details?: ParsedURLDetails;
  error?: string;
  scheme?: string;
}

/**
 * Checks whether an input begins with an unsupported/dangerous scheme.
 */
export function isDangerousScheme(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  return UNSUPPORTED_DANGEROUS_SCHEMES.some((scheme) =>
    trimmed.startsWith(scheme),
  );
}

/**
 * Extracts the scheme from an input string, if any exists.
 */
export function extractScheme(input: string): string | null {
  const match = input.trim().match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Converts a punycode hostname (e.g. xn--pple-43d.com) into Unicode (e.g. аpple.com) safely.
 */
export function toUnicodeHostname(hostname: string): string {
  return punycodeToUnicode(hostname);
}

/**
 * Parses and validates an input URL for web security analysis.
 * Rejects unsupported schemes and invalid URL syntax.
 */
export function parseAndValidateURL(rawInput: string): URLParseResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      success: false,
      isWebUrl: false,
      error: "URL cannot be empty.",
    };
  }

  // Reject dangerous schemes immediately
  if (isDangerousScheme(trimmed)) {
    const scheme = extractScheme(trimmed) || "dangerous";
    return {
      success: false,
      isWebUrl: false,
      scheme: `${scheme}:`,
      error: `Scheme "${scheme}:" is not supported for web navigation due to security restrictions.`,
    };
  }

  // Check scheme
  let urlStringToParse = trimmed;
  const detectedScheme = extractScheme(trimmed);

  if (!detectedScheme) {
    // If user entered e.g. "example.com" or "example.com/login", prepend https:// for inspection
    // while noting the rawInput preserved
    if (/^[a-zA-Z0-9-._]+(\.[a-zA-Z0-9-._]+)+(:\d+)?(\/.*)?$/i.test(trimmed)) {
      urlStringToParse = `https://${trimmed}`;
    } else {
      return {
        success: false,
        isWebUrl: false,
        error:
          "Missing valid protocol. Please provide an absolute URL starting with http:// or https://",
      };
    }
  } else if (detectedScheme !== "http" && detectedScheme !== "https") {
    return {
      success: false,
      isWebUrl: false,
      scheme: `${detectedScheme}:`,
      error: `Unsupported scheme "${detectedScheme}:". Only HTTP and HTTPS web links can be analyzed for website navigation.`,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStringToParse);
  } catch (err) {
    return {
      success: false,
      isWebUrl: false,
      error: `Malformed URL: ${err instanceof Error ? err.message : "Invalid URL syntax"}`,
    };
  }

  // Ensure hostname is non-empty
  if (!parsed.hostname) {
    return {
      success: false,
      isWebUrl: false,
      error: "URL hostname is missing or invalid.",
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const domainInfo = parseDomainInfo(hostname);
  const isPuny = hostname.includes("xn--");
  const unicodeHostname = isPuny ? toUnicodeHostname(hostname) : hostname;

  // Extract embedded credentials if any
  const username = parsed.username || "";
  const password = parsed.password || "";

  const details: ParsedURLDetails = {
    rawInput: trimmed,
    normalizedUrl: parsed.href,
    protocol: parsed.protocol,
    hostname,
    port: parsed.port,
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    username,
    password: password || undefined,
    subdomain: domainInfo.subdomain,
    domain: domainInfo.domain,
    publicSuffix: domainInfo.publicSuffix,
    isIpv4: domainInfo.isIpv4 || isIPv4Address(hostname),
    isIpv6: domainInfo.isIpv6 || isIPv6Address(hostname),
    isPunycode: isPuny,
    unicodeHostname,
  };

  return {
    success: true,
    isWebUrl: true,
    scheme: parsed.protocol,
    details,
  };
}
