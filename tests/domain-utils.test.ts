import { describe, it, expect } from 'vitest';
import {
  isIPv4Address,
  isIPv6Address,
  parseDomainInfo,
  isSubdomainOf,
  levenshteinDistance,
  checkTyposquatting,
  detectHomoglyphs,
  isCommonlyAbusedTLD,
  findSuspiciousKeywords,
} from '../src/lib/domain-utils';

describe('domain-utils', () => {
  describe('isIPv4Address', () => {
    it('identifies valid IPv4 addresses', () => {
      expect(isIPv4Address('192.168.1.1')).toBe(true);
      expect(isIPv4Address('10.0.0.1')).toBe(true);
      expect(isIPv4Address('127.0.0.1')).toBe(true);
      expect(isIPv4Address('8.8.8.8')).toBe(true);
    });

    it('identifies integer and hex IP representations', () => {
      expect(isIPv4Address('2130706433')).toBe(true); // 127.0.0.1
      expect(isIPv4Address('0x7f000001')).toBe(true);
    });

    it('rejects regular domain names', () => {
      expect(isIPv4Address('example.com')).toBe(false);
      expect(isIPv4Address('192.168.1')).toBe(false);
      expect(isIPv4Address('999.999.999.999')).toBe(false);
    });
  });

  describe('isIPv6Address', () => {
    it('identifies valid IPv6 addresses', () => {
      expect(isIPv6Address('::1')).toBe(true);
      expect(isIPv6Address('[::1]')).toBe(true);
      expect(isIPv6Address('2001:db8::1')).toBe(true);
    });

    it('rejects invalid or regular domain names', () => {
      expect(isIPv6Address('example.com')).toBe(false);
      expect(isIPv6Address('127.0.0.1')).toBe(false);
    });
  });

  describe('parseDomainInfo with Public Suffix List', () => {
    it('handles standard domains correctly', () => {
      const info = parseDomainInfo('sub.example.com');
      expect(info.domain).toBe('example.com');
      expect(info.subdomain).toBe('sub');
      expect(info.publicSuffix).toBe('com');
    });

    it('handles multi-level public suffixes like co.uk correctly', () => {
      const info = parseDomainInfo('login.banking.example.co.uk');
      expect(info.domain).toBe('example.co.uk');
      expect(info.domainWithoutSuffix).toBe('example');
      expect(info.subdomain).toBe('login.banking');
      expect(info.publicSuffix).toBe('co.uk');
    });

    it('handles IP addresses as hosts', () => {
      const info = parseDomainInfo('192.168.0.1');
      expect(info.isIp).toBe(true);
      expect(info.isIpv4).toBe(true);
      expect(info.domain).toBe('192.168.0.1');
    });
  });

  describe('isSubdomainOf', () => {
    it('accurately verifies exact and subdomain matches without false substrings', () => {
      expect(isSubdomainOf('auth.google.com', 'google.com')).toBe(true);
      expect(isSubdomainOf('google.com', 'google.com')).toBe(true);
      // Critical check: evilgoogle.com is NOT a subdomain of google.com!
      expect(isSubdomainOf('evilgoogle.com', 'google.com')).toBe(false);
      expect(isSubdomainOf('notgoogle.com', 'google.com')).toBe(false);
    });
  });

  describe('levenshteinDistance and checkTyposquatting', () => {
    it('computes exact edit distances', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
      expect(levenshteinDistance('paypal', 'paypa1')).toBe(1);
      expect(levenshteinDistance('google', 'gooogle')).toBe(1);
    });

    it('identifies typosquats of target brands', () => {
      const match1 = checkTyposquatting('paypa1', ['paypal']);
      expect(match1).not.toBeNull();
      expect(match1?.brand).toBe('paypal');
      expect(match1?.distance).toBe(1);

      const match2 = checkTyposquatting('gooogle', ['google']);
      expect(match2).not.toBeNull();
      expect(match2?.brand).toBe('google');

      // Exact match is not a typosquat
      expect(checkTyposquatting('paypal', ['paypal'])).toBeNull();
      // Completely unrelated domain is not a typosquat
      expect(checkTyposquatting('restaurant', ['paypal', 'google'])).toBeNull();
    });
  });

  describe('detectHomoglyphs', () => {
    it('detects Cyrillic "а" lookalike in Latin domain', () => {
      // Latin 'p', 'p', 'l', 'e' with Cyrillic 'а' (\u0430)
      const fakeApple = '\u0430pple.com';
      const result = detectHomoglyphs(fakeApple);
      expect(result.hasHomoglyphs).toBe(true);
      expect(result.confusableChars.length).toBeGreaterThan(0);
      expect(result.normalizedCandidate).toBe('apple.com');
      expect(result.hasMixedScript).toBe(true);
    });

    it('detects pure ASCII as clean', () => {
      const result = detectHomoglyphs('apple.com');
      expect(result.hasHomoglyphs).toBe(false);
      expect(result.confusableChars.length).toBe(0);
    });
  });

  describe('isCommonlyAbusedTLD', () => {
    it('identifies known high-abuse TLDs', () => {
      expect(isCommonlyAbusedTLD('xyz')).toBe(true);
      expect(isCommonlyAbusedTLD('top')).toBe(true);
      expect(isCommonlyAbusedTLD('work')).toBe(true);
      expect(isCommonlyAbusedTLD('tk')).toBe(true);
    });

    it('recognizes standard TLDs as not high abuse', () => {
      expect(isCommonlyAbusedTLD('com')).toBe(false);
      expect(isCommonlyAbusedTLD('org')).toBe(false);
      expect(isCommonlyAbusedTLD('gov.uk')).toBe(false);
    });
  });

  describe('findSuspiciousKeywords', () => {
    it('finds keywords like login, verify, secure', () => {
      expect(findSuspiciousKeywords('paypal-login-verify.com')).toEqual(
        expect.arrayContaining(['login', 'verify'])
      );
      expect(findSuspiciousKeywords('secure-banking-portal.net')).toEqual(
        expect.arrayContaining(['secure', 'portal', 'banking'])
      );
    });
  });
});
