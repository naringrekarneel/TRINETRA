import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecurityResults } from '../../src/components/analyzer/SecurityResults';
import { AnalysisResult } from '../../src/types/security';

const mockCleanResult: AnalysisResult = {
  input: 'https://example.com/menu',
  normalizedUrl: 'https://example.com/menu',
  hostname: 'example.com',
  protocol: 'https:',
  isWebUrl: true,
  status: 'no-warnings',
  statusLabel: 'No heuristic warnings detected',
  statusDescription: 'No suspicious patterns identified.',
  parsedDetails: {
    rawInput: 'https://example.com/menu',
    normalizedUrl: 'https://example.com/menu',
    protocol: 'https:',
    hostname: 'example.com',
    port: '',
    pathname: '/menu',
    search: '',
    hash: '',
    username: '',
    subdomain: '',
    domain: 'example.com',
    publicSuffix: 'com',
    isIpv4: false,
    isIpv6: false,
    isPunycode: false,
    unicodeHostname: 'example.com',
  },
  findings: [],
  limitations: ['Test limitation statement.'],
  analyzedAt: new Date().toISOString(),
};

const mockSuspiciousResult: AnalysisResult = {
  ...mockCleanResult,
  status: 'suspicious',
  statusLabel: 'Multiple suspicious patterns detected',
  findings: [
    {
      id: 'rule-embedded-credentials',
      severity: 'high',
      title: 'Embedded Credentials / Misleading Host Prefix',
      description: 'The URL contains user credentials before the host.',
      recommendation: 'Do not trust this link.',
    },
  ],
};

describe('SecurityResults component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders destination hostname and protocol information', () => {
    render(<SecurityResults result={mockCleanResult} onReset={vi.fn()} />);

    expect(screen.getAllByText('example.com').length).toBeGreaterThan(0);
    expect(screen.getByText(/HTTPS \(TLS Encrypted\)/i)).toBeInTheDocument();
    expect(screen.getByText('No heuristic warnings detected')).toBeInTheDocument();
  });

  it('handles Copy URL action with clipboard feedback', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<SecurityResults result={mockCleanResult} onReset={vi.fn()} />);

    const copyBtn = screen.getByRole('button', { name: /Copy inspected URL to clipboard/i });
    await userEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('https://example.com/menu');
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('shows confirmation modal before navigating to high-risk destination', async () => {
    const openMock = vi.fn();
    window.open = openMock;

    render(<SecurityResults result={mockSuspiciousResult} onReset={vi.fn()} />);

    const continueBtn = screen.getByRole('button', { name: /Continue to Website/i });
    await userEvent.click(continueBtn);

    // Modal dialog must be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/You Are Leaving Trinetra/i)).toBeInTheDocument();
    expect(openMock).not.toHaveBeenCalled();

    // Confirm navigation inside modal
    const confirmBtn = screen.getByRole('button', { name: /I Understand the Risks, Proceed/i });
    await userEvent.click(confirmBtn);

    expect(openMock).toHaveBeenCalledWith(
      'https://example.com/menu',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('calls onReset when clicking Scan or Check Another Link', async () => {
    const handleReset = vi.fn();
    render(<SecurityResults result={mockCleanResult} onReset={handleReset} />);

    const resetBtn = screen.getByRole('button', { name: /Scan or Check Another Link/i });
    await userEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('safely renders non-web QR content without website continue button', () => {
    const nonWebResult: AnalysisResult = {
      input: 'WIFI:S:CafeWifi;T:WPA;P:secret123;;',
      isWebUrl: false,
      status: 'review-recommended',
      statusLabel: 'Wi-Fi Network Configuration',
      statusDescription: 'This QR code configures a Wi-Fi connection.',
      findings: [],
      limitations: ['Non-web content.'],
      analyzedAt: new Date().toISOString(),
      qrClassification: {
        type: 'wifi',
        raw: 'WIFI:S:CafeWifi;T:WPA;P:secret123;;',
        title: 'Wi-Fi Network Configuration',
        description: 'This QR code configures a Wi-Fi connection.',
        parsedDetails: {
          'Network Name (SSID)': 'CafeWifi',
          'Password': 'secret123',
        },
        isWebUrl: false,
      },
    };

    render(<SecurityResults result={nonWebResult} onReset={vi.fn()} />);

    expect(screen.getAllByText('Wi-Fi Network Configuration').length).toBeGreaterThan(0);
    expect(screen.getByText('CafeWifi')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Continue to Website/i })).not.toBeInTheDocument();
  });
});
