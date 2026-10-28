export const UNSUPPORTED_DANGEROUS_SCHEMES = [
  "javascript:",
  "data:",
  "file:",
  "intent:",
  "vbscript:",
  "blob:",
  "about:",
  "chrome:",
  "content:",
  "ms-appx:",
  "jar:",
  "view-source:",
] as const;

export const KNOWN_URL_SHORTENERS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "adf.ly",
  "bit.do",
  "shorturl.at",
  "rebrand.ly",
  "cutt.ly",
  "tiny.cc",
  "rb.gy",
  "lnkd.in",
  "qr.ae",
  "qr.net",
  "linktr.ee",
  "bl.ink",
  "s.id",
  "t.me",
  "wa.me",
]);

export const REDIRECT_PARAM_KEYS = new Set([
  "redirect",
  "redirect_url",
  "redirect_uri",
  "return",
  "return_url",
  "returl",
  "next",
  "target",
  "dest",
  "destination",
  "go",
  "url",
  "link",
  "r",
  "u",
  "forward",
  "goto",
  "out",
  "relay",
]);

export const BRAND_TARGETS = [
  "google",
  "paypal",
  "microsoft",
  "apple",
  "amazon",
  "netflix",
  "facebook",
  "instagram",
  "whatsapp",
  "twitter",
  "chase",
  "wellsfargo",
  "bankofamerica",
  "citibank",
  "github",
  "gitlab",
  "linkedin",
  "binance",
  "coinbase",
  "dropbox",
  "spotify",
  "adobe",
  "steam",
  "discord",
  "roblox",
];

export const SUSPICIOUS_HOSTNAME_KEYWORDS = [
  "login",
  "signin",
  "verify",
  "verification",
  "security",
  "secure",
  "account",
  "update",
  "authenticate",
  "auth",
  "portal",
  "billing",
  "support",
  "confirm",
  "recover",
  "helpdesk",
  "wallet",
  "banking",
  "passcode",
  "payment",
];

export const COMMONLY_ABUSED_TLDS = new Set([
  "top",
  "xyz",
  "work",
  "click",
  "buzz",
  "club",
  "surf",
  "country",
  "stream",
  "gq",
  "cf",
  "ml",
  "tk",
  "ga",
  "rest",
  "cam",
]);

// Cyrillic and Greek look-alike mapping to Latin characters
export const HOMOGLYPH_MAP: Record<string, string> = {
  // Cyrillic
  "\u0430": "a", // Cyrillic Small Letter A
  "\u0441": "c", // Cyrillic Small Letter Es
  "\u0435": "e", // Cyrillic Small Letter Ie
  "\u0456": "i", // Cyrillic Small Letter Byelorussian-Ukrainian I
  "\u0458": "j", // Cyrillic Small Letter Je
  "\u043E": "o", // Cyrillic Small Letter O
  "\u0440": "p", // Cyrillic Small Letter Er
  "\u0455": "s", // Cyrillic Small Letter Dze
  "\u0445": "x", // Cyrillic Small Letter Ha
  "\u0443": "y", // Cyrillic Small Letter U
  "\u0410": "A",
  "\u0412": "B",
  "\u0421": "C",
  "\u0415": "E",
  "\u041D": "H",
  "\u0406": "I",
  "\u041C": "M",
  "\u041E": "O",
  "\u0420": "P",
  "\u0422": "T",
  "\u0425": "X",
  // Greek
  "\u03B1": "a", // Greek Small Letter Alpha
  "\u03BF": "o", // Greek Small Letter Omicron
  "\u03C1": "p", // Greek Small Letter Rho
  "\u03BD": "v", // Greek Small Letter Nu
  "\u0391": "A",
  "\u0392": "B",
  "\u0395": "E",
  "\u0397": "H",
  "\u0399": "I",
  "\u039A": "K",
  "\u039C": "M",
  "\u039D": "N",
  "\u039F": "O",
  "\u03A1": "P",
  "\u03A4": "T",
  "\u03A7": "X",
  "\u03A5": "Y",
  "\u0396": "Z",
};

export const STANDARD_ANALYSIS_LIMITATIONS = [
  "Local heuristic analysis checks URL syntax, structure, Public Suffix List boundaries, and known suspicious patterns.",
  "This analyzer does not contact destination servers, retrieve live web pages, inspect TLS certificates, or verify domain ownership.",
  "Attackers can host malicious or phishing pages on legitimate cloud platforms, content delivery networks, or newly registered domains without triggering structural heuristics.",
  "The absence of warnings does not guarantee that a destination website is safe, legitimate, or free of malware.",
];
