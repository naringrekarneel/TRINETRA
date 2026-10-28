import { describe, it, expect } from 'vitest';
import { classifyQRContent } from '../src/lib/analyze-text';

describe('analyze-text QR content classification', () => {
  it('classifies standard HTTP/HTTPS URLs as web-url', () => {
    const res = classifyQRContent('https://restaurant.example.com/menu');
    expect(res.type).toBe('web-url');
    expect(res.isWebUrl).toBe(true);
  });

  it('classifies Wi-Fi connection strings', () => {
    const res = classifyQRContent('WIFI:S:GuestCoffee;T:WPA;P:SecretPass123;;');
    expect(res.type).toBe('wifi');
    expect(res.isWebUrl).toBe(false);
    expect(res.parsedDetails?.['Network Name (SSID)']).toBe('GuestCoffee');
    expect(res.parsedDetails?.['Password']).toBe('SecretPass123');
    expect(res.parsedDetails?.['Security Type']).toBe('WPA');
  });

  it('classifies vCard contacts', () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:Alice Smith\nTEL:+1555123456\nEMAIL:alice@example.org\nEND:VCARD`;
    const res = classifyQRContent(vcard);
    expect(res.type).toBe('vcard');
    expect(res.isWebUrl).toBe(false);
    expect(res.parsedDetails?.['Full Name']).toBe('Alice Smith');
    expect(res.parsedDetails?.['Phone']).toBe('+1555123456');
    expect(res.parsedDetails?.['Email']).toBe('alice@example.org');
  });

  it('classifies mailto links', () => {
    const res = classifyQRContent('mailto:support@example.com?subject=Help');
    expect(res.type).toBe('email');
    expect(res.isWebUrl).toBe(false);
    expect(res.parsedDetails?.['Recipient']).toBe('support@example.com');
  });

  it('classifies tel links', () => {
    const res = classifyQRContent('tel:+18005550199');
    expect(res.type).toBe('tel');
    expect(res.isWebUrl).toBe(false);
    expect(res.parsedDetails?.['Phone Number']).toBe('+18005550199');
  });

  it('blocks dangerous schemes like javascript:', () => {
    const res = classifyQRContent('javascript:alert(document.domain)');
    expect(res.type).toBe('unsupported-scheme');
    expect(res.isWebUrl).toBe(false);
    expect(res.securityNote).toContain('Dangerous executable scheme blocked');
  });

  it('classifies plain text notes', () => {
    const res = classifyQRContent('Table 14 - Reserved for private event');
    expect(res.type).toBe('plain-text');
    expect(res.isWebUrl).toBe(false);
  });
});
