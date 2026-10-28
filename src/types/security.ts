export type Severity = "info" | "low" | "medium" | "high";

export type AssessmentStatus =
  | "no-warnings"
  | "review-recommended"
  | "suspicious"
  | "threat-reported"
  | "reputation-unavailable";

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  evidence?: string;
  recommendation: string;
}

export type QRContentType =
  | "web-url"
  | "plain-text"
  | "wifi"
  | "vcard"
  | "email"
  | "tel"
  | "sms"
  | "unsupported-scheme"
  | "other";

export interface QRClassification {
  type: QRContentType;
  raw: string;
  title: string;
  description: string;
  parsedDetails?: Record<string, string>;
  isWebUrl: boolean;
  securityNote?: string;
}

export interface ParsedURLDetails {
  rawInput: string;
  normalizedUrl: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  username: string;
  password?: string;
  subdomain: string;
  domain: string; // Registrable domain e.g. example.co.uk
  publicSuffix: string; // e.g. co.uk
  isIpv4: boolean;
  isIpv6: boolean;
  isPunycode: boolean;
  unicodeHostname: string;
}

export interface AnalysisResult {
  input: string;
  normalizedUrl?: string;
  parsedDetails?: ParsedURLDetails;
  hostname?: string;
  protocol?: string;
  isWebUrl: boolean;
  status: AssessmentStatus;
  statusLabel: string;
  statusDescription: string;
  findings: Finding[];
  limitations: string[];
  analyzedAt: string;
  qrClassification?: QRClassification;
}
