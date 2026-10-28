import { QRClassification } from "../types/security";
import { isDangerousScheme, extractScheme } from "./url-parser";

/**
 * Classifies the decoded contents of a QR code into safe structured categories.
 * Ensures non-URL contents are identified and prevented from opening in browser.
 */
export function classifyQRContent(rawText: string): QRClassification {
  const trimmed = rawText.trim();

  if (!trimmed) {
    return {
      type: "plain-text",
      raw: "",
      title: "Empty Content",
      description: "The decoded QR code contains no readable text.",
      isWebUrl: false,
    };
  }

  // 1. Check for dangerous / unsupported schemes
  if (isDangerousScheme(trimmed)) {
    const scheme = extractScheme(trimmed) || "dangerous";
    return {
      type: "unsupported-scheme",
      raw: trimmed,
      title: `Blocked Scheme (${scheme}:)`,
      description: `This QR code contains an executable or local scheme (${scheme}:) which is blocked to prevent cross-site scripting or local file access.`,
      isWebUrl: false,
      securityNote:
        "Dangerous executable scheme blocked. Do not attempt to run or open this content.",
    };
  }

  // 2. Check for Wi-Fi configurations (WIFI:S:...;T:...;P:...;;)
  if (/^WIFI:/i.test(trimmed)) {
    const parsedDetails: Record<string, string> = {};
    const ssidMatch = trimmed.match(/S:([^;]+);/i);
    const typeMatch = trimmed.match(/T:([^;]+);/i);
    const passMatch = trimmed.match(/P:([^;]+);/i);
    const hiddenMatch = trimmed.match(/H:([^;]+);/i);

    if (ssidMatch) parsedDetails["Network Name (SSID)"] = ssidMatch[1];
    if (typeMatch) parsedDetails["Security Type"] = typeMatch[1];
    if (passMatch) parsedDetails["Password"] = passMatch[1];
    if (hiddenMatch) parsedDetails["Hidden Network"] = hiddenMatch[1];

    return {
      type: "wifi",
      raw: trimmed,
      title: "Wi-Fi Network Configuration",
      description:
        "This QR code configures a Wi-Fi connection. QRGuard does not automatically connect to Wi-Fi networks.",
      parsedDetails,
      isWebUrl: false,
      securityNote:
        "Connecting to untrusted Wi-Fi access points can expose unencrypted network traffic. Verify the network name before connecting manually.",
    };
  }

  // 3. Check for vCard / MeCard contacts
  if (/^BEGIN:VCARD/i.test(trimmed) || /^MECARD:/i.test(trimmed)) {
    const parsedDetails: Record<string, string> = {};
    if (/^BEGIN:VCARD/i.test(trimmed)) {
      const fnMatch = trimmed.match(/FN:([^\r\n]+)/i);
      const telMatch = trimmed.match(/TEL[^:]*:([^\r\n]+)/i);
      const emailMatch = trimmed.match(/EMAIL[^:]*:([^\r\n]+)/i);
      const orgMatch = trimmed.match(/ORG:([^\r\n]+)/i);

      if (fnMatch) parsedDetails["Full Name"] = fnMatch[1].trim();
      if (telMatch) parsedDetails["Phone"] = telMatch[1].trim();
      if (emailMatch) parsedDetails["Email"] = emailMatch[1].trim();
      if (orgMatch) parsedDetails["Organization"] = orgMatch[1].trim();
    } else {
      const nMatch = trimmed.match(/N:([^;]+);/i);
      const telMatch = trimmed.match(/TEL:([^;]+);/i);
      const emailMatch = trimmed.match(/EMAIL:([^;]+);/i);

      if (nMatch) parsedDetails["Name"] = nMatch[1];
      if (telMatch) parsedDetails["Phone"] = telMatch[1];
      if (emailMatch) parsedDetails["Email"] = emailMatch[1];
    }

    return {
      type: "vcard",
      raw: trimmed,
      title: "Contact Card (vCard)",
      description:
        "This QR code contains contact information. QRGuard does not automatically import or dial contacts.",
      parsedDetails,
      isWebUrl: false,
      securityNote:
        "Verify unknown contact cards before saving them or calling the provided telephone numbers.",
    };
  }

  // 4. Check for Email (mailto: or MATMSG:)
  if (/^mailto:/i.test(trimmed) || /^MATMSG:/i.test(trimmed)) {
    const parsedDetails: Record<string, string> = {};
    if (/^mailto:/i.test(trimmed)) {
      try {
        const mailUrl = new URL(trimmed);
        parsedDetails["Recipient"] = mailUrl.pathname;
        const subject = mailUrl.searchParams.get("subject");
        const body = mailUrl.searchParams.get("body");
        if (subject) parsedDetails["Subject"] = subject;
        if (body) parsedDetails["Body Preview"] = body;
      } catch {
        parsedDetails["Recipient"] = trimmed.replace(/^mailto:/i, "");
      }
    } else {
      const toMatch = trimmed.match(/TO:([^;]+);/i);
      const subMatch = trimmed.match(/SUB:([^;]+);/i);
      const bodyMatch = trimmed.match(/BODY:([^;]+);/i);
      if (toMatch) parsedDetails["Recipient"] = toMatch[1];
      if (subMatch) parsedDetails["Subject"] = subMatch[1];
      if (bodyMatch) parsedDetails["Body Preview"] = bodyMatch[1];
    }

    return {
      type: "email",
      raw: trimmed,
      title: "Email Action",
      description:
        "This QR code initiates an email. QRGuard does not automatically send emails or open your mail client.",
      parsedDetails,
      isWebUrl: false,
      securityNote:
        "Ensure the recipient email address matches who you expect before composing a response.",
    };
  }

  // 5. Check for Telephone links (tel:)
  if (/^tel:/i.test(trimmed)) {
    const number = trimmed.replace(/^tel:/i, "").trim();
    return {
      type: "tel",
      raw: trimmed,
      title: "Telephone Number",
      description:
        "This QR code contains a telephone number. QRGuard will not automatically dial.",
      parsedDetails: { "Phone Number": number },
      isWebUrl: false,
      securityNote:
        "Do not dial premium-rate or unexpected international numbers from public QR codes.",
    };
  }

  // 6. Check for SMS links (sms: or smsto:)
  if (/^(sms|smsto):/i.test(trimmed)) {
    const clean = trimmed.replace(/^(sms|smsto):/i, "");
    const parts = clean.split(/[?:;]/);
    const recipient = parts[0];
    return {
      type: "sms",
      raw: trimmed,
      title: "SMS Message",
      description:
        "This QR code drafts a text message. QRGuard will not send messages automatically.",
      parsedDetails: { Recipient: recipient },
      isWebUrl: false,
      securityNote:
        "Be cautious of QR codes requesting text messages to unknown numbers or shortcodes.",
    };
  }

  // 7. Check for HTTP / HTTPS Web URLs
  if (/^https?:\/\//i.test(trimmed)) {
    return {
      type: "web-url",
      raw: trimmed,
      title: "Web Link (HTTP/HTTPS)",
      description:
        "Destination web link detected. Proceeding to security analysis.",
      isWebUrl: true,
    };
  }

  // 8. If text looks like a domain name (e.g. www.example.com or example.org/page)
  if (
    /^[a-zA-Z0-9-._]+(\.[a-zA-Z0-9-._]+)+(:\d+)?(\/.*)?$/i.test(trimmed) &&
    !trimmed.includes(" ")
  ) {
    return {
      type: "web-url",
      raw: trimmed,
      title: "Web Link (Implicit Protocol)",
      description: "Hostname detected without explicit protocol scheme.",
      isWebUrl: true,
    };
  }

  // 9. Plain text fallback
  return {
    type: "plain-text",
    raw: trimmed,
    title: "Plain Text Content",
    description:
      "This QR code contains plain text rather than a web link or system action.",
    isWebUrl: false,
  };
}
