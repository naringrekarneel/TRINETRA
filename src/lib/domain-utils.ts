import { parse as tldtsParse } from "tldts";
import {
  BRAND_TARGETS,
  HOMOGLYPH_MAP,
  COMMONLY_ABUSED_TLDS,
  SUSPICIOUS_HOSTNAME_KEYWORDS,
} from "./constants";

export interface ParsedDomainInfo {
  hostname: string;
  domain: string; // e.g. "example.co.uk"
  domainWithoutSuffix: string; // e.g. "example"
  subdomain: string; // e.g. "sub.login"
  publicSuffix: string; // e.g. "co.uk"
  isIp: boolean;
  isIpv4: boolean;
  isIpv6: boolean;
}

const base = 36;
const tmin = 1;
const tmax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128;

function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  delta = firstTime ? Math.floor(delta / damp) : Math.floor(delta / 2);
  delta += Math.floor(delta / numPoints);
  let k = 0;
  while (delta > ((base - tmin) * tmax) / 2) {
    delta = Math.floor(delta / (base - tmin));
    k += base;
  }
  return Math.floor(k + ((base - tmin + 1) * delta) / (delta + skew));
}

/**
 * Standard RFC 3492 Punycode decoder (converting xn-- labels to Unicode)
 */
export function punycodeToUnicode(input: string): string {
  try {
    return input
      .split(".")
      .map((part) => {
        if (!part.toLowerCase().startsWith("xn--")) return part;
        const str = part.slice(4).toLowerCase();
        const output: number[] = [];
        let n = initialN;
        let i = 0;
        let bias = initialBias;

        const basicIndex = str.lastIndexOf("-");
        let remaining = str;
        if (basicIndex >= 0) {
          for (let j = 0; j < basicIndex; ++j) {
            output.push(str.charCodeAt(j));
          }
          remaining = str.slice(basicIndex + 1);
        }

        let pos = 0;
        while (pos < remaining.length) {
          const oldi = i;
          let w = 1;
          let k = base;

          while (true) {
            if (pos >= remaining.length) break;
            const charCode = remaining.charCodeAt(pos++);
            const digit =
              charCode >= 48 && charCode <= 57
                ? charCode - 22
                : charCode >= 97 && charCode <= 122
                  ? charCode - 97
                  : charCode - 65;

            i += digit * w;
            const t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
            if (digit < t) break;
            w *= base - t;
            k += base;
          }

          bias = adapt(i - oldi, output.length + 1, oldi === 0);
          n += Math.floor(i / (output.length + 1));
          i %= output.length + 1;
          output.splice(i, 0, n);
          i++;
        }

        return String.fromCodePoint(...output);
      })
      .join(".");
  } catch {
    return input;
  }
}

/**
 * Checks if a string is a standard IPv4 address.
 */
export function isIPv4Address(hostname: string): boolean {
  // Standard IPv4 quad
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Pattern.test(hostname)) return true;

  // Decimal integer IP notation (e.g. 2130706433 for 127.0.0.1)
  if (/^\d{8,10}$/.test(hostname)) {
    const num = Number(hostname);
    if (!isNaN(num) && num >= 0 && num <= 4294967295) return true;
  }

  // Hex notation (e.g. 0x7f000001)
  if (/^0x[0-9a-fA-F]{1,8}$/.test(hostname)) return true;

  // Octal or dword formats
  if (/^0\d{1,11}$/.test(hostname)) return true;

  return false;
}

/**
 * Checks if a string is an IPv6 address (often bracketed in URLs like [::1]).
 */
export function isIPv6Address(hostname: string): boolean {
  const clean = hostname.replace(/^\[|\]$/g, "");
  // Standard IPv6 check
  const ipv6Pattern =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Pattern.test(clean);
}

/**
 * Robustly parses a hostname using Public Suffix List rules via `tldts`.
 */
export function parseDomainInfo(hostname: string): ParsedDomainInfo {
  const cleanHost = hostname.trim().toLowerCase();
  const ipv4 = isIPv4Address(cleanHost);
  const ipv6 = isIPv6Address(cleanHost);

  if (ipv4 || ipv6) {
    return {
      hostname: cleanHost,
      domain: cleanHost,
      domainWithoutSuffix: cleanHost,
      subdomain: "",
      publicSuffix: "",
      isIp: true,
      isIpv4: ipv4,
      isIpv6: ipv6,
    };
  }

  const parsed = tldtsParse(cleanHost, { allowPrivateDomains: true });

  return {
    hostname: cleanHost,
    domain: parsed.domain || cleanHost,
    domainWithoutSuffix: parsed.domainWithoutSuffix || cleanHost,
    subdomain: parsed.subdomain || "",
    publicSuffix: parsed.publicSuffix || "",
    isIp: false,
    isIpv4: false,
    isIpv6: false,
  };
}

/**
 * Checks if a hostname matches an expected domain exactly or as a valid subdomain.
 * Never uses naive substring matching like hostname.includes("google.com").
 */
export function isSubdomainOf(
  hostname: string,
  expectedRootDomain: string,
): boolean {
  const host = hostname.toLowerCase();
  const root = expectedRootDomain.toLowerCase();
  return host === root || host.endsWith("." + root);
}

/**
 * Computes Levenshtein distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return dp[m][n];
}

export interface TyposquatMatch {
  brand: string;
  distance: number;
  observed: string;
}

/**
 * Checks if a registrable domain base is visually similar to a known brand.
 */
export function checkTyposquatting(
  domainBase: string,
  brands: string[] = BRAND_TARGETS,
): TyposquatMatch | null {
  const clean = domainBase.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clean.length < 3) return null;

  for (const brand of brands) {
    if (clean === brand) {
      // Exactly matches brand keyword; handled by brand presence check
      continue;
    }
    const dist = levenshteinDistance(clean, brand);
    // If distance is 1 (e.g. paypa1, gooogle, netfllx) or 2 for long brands
    if (dist === 1 || (dist === 2 && brand.length >= 7)) {
      return {
        brand,
        distance: dist,
        observed: domainBase,
      };
    }
  }

  return null;
}

export interface HomoglyphResult {
  hasHomoglyphs: boolean;
  hasMixedScript: boolean;
  confusableChars: Array<{
    char: string;
    looksLike: string;
    codePoint: string;
  }>;
  normalizedCandidate: string;
}

/**
 * Detects confusable homoglyph characters in a hostname (Cyrillic, Greek, etc.).
 */
export function detectHomoglyphs(hostname: string): HomoglyphResult {
  const confusableChars: Array<{
    char: string;
    looksLike: string;
    codePoint: string;
  }> = [];
  let normalizedCandidate = "";

  let hasLatin = false;
  let hasNonLatin = false;

  for (const char of hostname) {
    const codePoint =
      "U+" +
      (char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0") ?? "");
    if (/[a-zA-Z]/.test(char)) {
      hasLatin = true;
      normalizedCandidate += char;
    } else if (HOMOGLYPH_MAP[char]) {
      hasNonLatin = true;
      const looksLike = HOMOGLYPH_MAP[char];
      confusableChars.push({ char, looksLike, codePoint });
      normalizedCandidate += looksLike;
    } else {
      if (!/[0-9.-]/.test(char)) {
        hasNonLatin = true;
      }
      normalizedCandidate += char;
    }
  }

  return {
    hasHomoglyphs: confusableChars.length > 0,
    hasMixedScript: hasLatin && hasNonLatin,
    confusableChars,
    normalizedCandidate,
  };
}

/**
 * Checks if a TLD is in the commonly abused or high-risk list.
 */
export function isCommonlyAbusedTLD(publicSuffix: string): boolean {
  if (!publicSuffix) return false;
  const tld = publicSuffix.split(".").pop()?.toLowerCase() || "";
  return COMMONLY_ABUSED_TLDS.has(tld);
}

/**
 * Checks if a hostname or subdomain contains suspicious credential/banking keywords.
 */
export function findSuspiciousKeywords(hostname: string): string[] {
  const lower = hostname.toLowerCase();
  return SUSPICIOUS_HOSTNAME_KEYWORDS.filter((kw) => {
    // Check keyword with boundaries like login-, -login, login. or .login
    const regex = new RegExp(`(^|[-._])${kw}([-._]|$)`, "i");
    return regex.test(lower);
  });
}
