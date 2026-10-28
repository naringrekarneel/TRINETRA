import { describe, it, expect } from 'vitest';
import { analyzeURL } from '../src/lib/analyze-url';

describe('analyze-url security rules', () => {
  it('Rule 1: flags unencrypted HTTP URLs', () => {
    const res = analyzeURL('http://example.com/login');
    const finding = res.findings.find((f) => f.id === 'rule-non-https');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('medium');
    expect(res.status).toBe('review-recommended');
  });

  it('Rule 2: flags embedded credentials before hostname', () => {
    const res = analyzeURL('https://trusted.example@attacker.test/login');
    const finding = res.findings.find((f) => f.id === 'rule-embedded-credentials');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('high');
    expect(res.status).toBe('suspicious');
  });

  it('Rule 3: flags Punycode hostnames (xn--)', () => {
    const res = analyzeURL('https://xn--pple-43d.com/');
    const finding = res.findings.find((f) => f.id === 'rule-punycode-hostname');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('medium');
  });

  it('Rule 4: flags Unicode look-alike characters and mixed script homoglyphs', () => {
    // Cyrillic 'а' replacing Latin 'a' in apple.com
    const res = analyzeURL('https://\u0430pple.com/');
    const finding = res.findings.find((f) => f.id === 'rule-homoglyph-confusables');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('high');
    expect(res.status).toBe('suspicious');
  });

  it('Rule 5: flags excessive subdomain depth', () => {
    const res = analyzeURL('https://a.b.c.d.example.com/');
    const finding = res.findings.find((f) => f.id === 'rule-deep-subdomain');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('medium');
  });

  it('Rule 6: flags known URL shorteners', () => {
    const res = analyzeURL('https://bit.ly/3xSample');
    const finding = res.findings.find((f) => f.id === 'rule-url-shortener');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('medium');
  });

  it('Rule 7: flags raw IPv4 and IPv6 hosts', () => {
    const resV4 = analyzeURL('https://192.168.1.1/');
    const findingV4 = resV4.findings.find((f) => f.id === 'rule-ip-address-host');
    expect(findingV4).toBeDefined();
    expect(findingV4?.severity).toBe('high');

    const resV6 = analyzeURL('https://[::1]/');
    const findingV6 = resV6.findings.find((f) => f.id === 'rule-ip-address-host');
    expect(findingV6).toBeDefined();
    expect(findingV6?.severity).toBe('high');
  });

  it('Rule 8: flags unexpected or uncommon ports', () => {
    const res = analyzeURL('https://example.com:8443/api');
    const finding = res.findings.find((f) => f.id === 'rule-unexpected-port');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('medium');
  });

  it('Rule 9: flags excessively long URLs', () => {
    const longPath = 'a'.repeat(300);
    const res = analyzeURL(`https://example.com/${longPath}`);
    const finding = res.findings.find((f) => f.id === 'rule-excessive-length');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('low');
  });

  it('Rule 10: flags suspicious percent encoding anomalies', () => {
    const res = analyzeURL('https://example.com/%2f%2e%2e/test%2520');
    const finding = res.findings.find((f) => f.id === 'rule-suspicious-encoding');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('medium');
  });

  it('Rule 11: flags misleading brand names in subdomains or paths', () => {
    // Brand in subdomain
    const resSub = analyzeURL('https://paypal.com.attacker.test/login');
    const findingSub = resSub.findings.find((f) => f.id === 'rule-misleading-brand-placement');
    expect(findingSub).toBeDefined();
    expect(findingSub?.severity).toBe('high');

    // Brand in path
    const resPath = analyzeURL('https://attacker.test/apple/login');
    const findingPath = resPath.findings.find((f) => f.id === 'rule-misleading-brand-placement');
    expect(findingPath).toBeDefined();
    expect(findingPath?.severity).toBe('high');
  });

  it('Rule 12: flags open redirect parameters', () => {
    const res = analyzeURL('https://example.com/login?redirect_url=https://attacker.test/phish');
    const finding = res.findings.find((f) => f.id === 'rule-redirect-parameter');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('low');
  });

  it('Rule 13: flags typosquatting of known brands', () => {
    const res = analyzeURL('https://paypa1.com/home');
    const finding = res.findings.find((f) => f.id === 'rule-typosquatting');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('high');
    expect(finding?.description).toContain('paypal');
  });

  it('Rule 14: flags suspicious security keywords on high-risk TLDs', () => {
    const res = analyzeURL('https://login-verify-account.xyz/');
    const finding = res.findings.find((f) => f.id === 'rule-suspicious-tld-keyword');
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('high');
  });

  it('returns clean "no-warnings" for standard benign domain', () => {
    const res = analyzeURL('https://example.com/');
    expect(res.findings.length).toBe(0);
    expect(res.status).toBe('no-warnings');
    expect(res.statusLabel).toBe('No heuristic warnings detected');
    // Crucial requirement: Must never claim site is 100% safe
    expect(res.statusDescription).toContain('does not guarantee');
    expect(res.limitations.length).toBeGreaterThan(0);
  });
});
