import { describe, it, expect } from 'vitest';
import { parseAndValidateURL, isDangerousScheme } from '../src/lib/url-parser';

describe('url-parser', () => {
  describe('isDangerousScheme', () => {
    it('detects dangerous schemes', () => {
      expect(isDangerousScheme('javascript:alert(1)')).toBe(true);
      expect(isDangerousScheme('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe(true);
      expect(isDangerousScheme('file:///etc/passwd')).toBe(true);
      expect(isDangerousScheme('intent://scan/#Intent;')).toBe(true);
      expect(isDangerousScheme('vbscript:msgbox(1)')).toBe(true);
    });

    it('returns false for web schemes', () => {
      expect(isDangerousScheme('https://example.com')).toBe(false);
      expect(isDangerousScheme('http://example.com')).toBe(false);
    });
  });

  describe('parseAndValidateURL', () => {
    it('successfully parses standard HTTPS URL', () => {
      const result = parseAndValidateURL('https://example.com/menu?table=4#order');
      expect(result.success).toBe(true);
      expect(result.isWebUrl).toBe(true);
      expect(result.details?.hostname).toBe('example.com');
      expect(result.details?.protocol).toBe('https:');
      expect(result.details?.pathname).toBe('/menu');
      expect(result.details?.search).toBe('?table=4');
      expect(result.details?.hash).toBe('#order');
    });

    it('correctly handles multi-level domains with public suffixes (co.uk)', () => {
      const result = parseAndValidateURL('https://sub.service.example.co.uk/');
      expect(result.success).toBe(true);
      expect(result.details?.domain).toBe('example.co.uk');
      expect(result.details?.subdomain).toBe('sub.service');
      expect(result.details?.publicSuffix).toBe('co.uk');
    });

    it('extracts embedded credentials', () => {
      const result = parseAndValidateURL('https://admin:secret@attacker.test/login');
      expect(result.success).toBe(true);
      expect(result.details?.username).toBe('admin');
      expect(result.details?.password).toBe('secret');
      expect(result.details?.hostname).toBe('attacker.test');
    });

    it('handles punycode hostnames', () => {
      const result = parseAndValidateURL('https://xn--e1afmkfd.xn--p1ai/');
      expect(result.success).toBe(true);
      expect(result.details?.isPunycode).toBe(true);
    });

    it('handles IPv4 and IPv6 URLs', () => {
      const resV4 = parseAndValidateURL('http://192.168.1.1:8080/setup');
      expect(resV4.success).toBe(true);
      expect(resV4.details?.isIpv4).toBe(true);
      expect(resV4.details?.port).toBe('8080');

      const resV6 = parseAndValidateURL('https://[2001:db8::1]/');
      expect(resV6.success).toBe(true);
      expect(resV6.details?.isIpv6).toBe(true);
    });

    it('rejects unsupported dangerous schemes', () => {
      const jsResult = parseAndValidateURL('javascript:alert(document.cookie)');
      expect(jsResult.success).toBe(false);
      expect(jsResult.isWebUrl).toBe(false);
      expect(jsResult.error).toContain('Scheme "javascript:" is not supported');

      const dataResult = parseAndValidateURL('data:text/html,<script>alert(1)</script>');
      expect(dataResult.success).toBe(false);
      expect(dataResult.isWebUrl).toBe(false);
    });

    it('rejects malformed inputs and empty strings', () => {
      expect(parseAndValidateURL('').success).toBe(false);
      expect(parseAndValidateURL('   ').success).toBe(false);
      expect(parseAndValidateURL('not a valid url').success).toBe(false);
    });
  });
});
