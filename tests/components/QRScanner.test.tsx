import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QRScanner } from '../../src/components/scanner/QRScanner';
import { Html5Qrcode } from 'html5-qrcode';

vi.mock('html5-qrcode', () => {
  return {
    Html5Qrcode: vi.fn(),
  };
});

describe('QRScanner component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default navigator.mediaDevices mock
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue({}),
      },
    });
  });

  it('renders idle state with explicit Start Scanner button', () => {
    render(
      <QRScanner onScanSuccess={vi.fn()} onSwitchToUpload={vi.fn()} />
    );

    expect(screen.getByRole('button', { name: /Start Scanner/i })).toBeInTheDocument();
    expect(screen.getByText(/Camera Scanner Ready/i)).toBeInTheDocument();
  });

  it('handles camera permission denied gracefully', async () => {
    const mockStart = vi.fn().mockRejectedValue({
      name: 'NotAllowedError',
      message: 'Permission denied',
    });

    vi.mocked(Html5Qrcode).mockImplementation(
      () =>
        ({
          start: mockStart,
          stop: vi.fn().mockResolvedValue(undefined),
          clear: vi.fn().mockResolvedValue(undefined),
          isScanning: false,
        }) as unknown as Html5Qrcode
    );

    render(
      <QRScanner onScanSuccess={vi.fn()} onSwitchToUpload={vi.fn()} />
    );

    const startBtn = screen.getByRole('button', { name: /Start Scanner/i });
    await userEvent.click(startBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Camera Access Denied/i);
    });
  });

  it('handles camera unavailable gracefully', async () => {
    const mockStart = vi.fn().mockRejectedValue({
      name: 'NotFoundError',
      message: 'No camera found',
    });

    vi.mocked(Html5Qrcode).mockImplementation(
      () =>
        ({
          start: mockStart,
          stop: vi.fn().mockResolvedValue(undefined),
          clear: vi.fn().mockResolvedValue(undefined),
          isScanning: false,
        }) as unknown as Html5Qrcode
    );

    render(
      <QRScanner onScanSuccess={vi.fn()} onSwitchToUpload={vi.fn()} />
    );

    const startBtn = screen.getByRole('button', { name: /Start Scanner/i });
    await userEvent.click(startBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Camera Unavailable/i);
    });
  });

  it('prevents duplicate callbacks when a QR result is scanned', async () => {
    let capturedSuccessCallback: ((text: string) => void) | null = null;
    const mockStop = vi.fn().mockResolvedValue(undefined);
    const mockClear = vi.fn().mockResolvedValue(undefined);

    const mockStart = vi.fn().mockImplementation((_camera, _config, onSuccess) => {
      capturedSuccessCallback = onSuccess;
      return Promise.resolve();
    });

    vi.mocked(Html5Qrcode).mockImplementation(
      () =>
        ({
          start: mockStart,
          stop: mockStop,
          clear: mockClear,
          isScanning: true,
        }) as unknown as Html5Qrcode
    );

    const handleScanSuccess = vi.fn();

    render(
      <QRScanner
        onScanSuccess={handleScanSuccess}
        onSwitchToUpload={vi.fn()}
      />
    );

    const startBtn = screen.getByRole('button', { name: /Start Scanner/i });
    await userEvent.click(startBtn);

    await waitFor(() => {
      expect(capturedSuccessCallback).not.toBeNull();
    });

    // Simulate scanning the same result twice rapidly
    if (capturedSuccessCallback) {
      (capturedSuccessCallback as (text: string) => void)('https://example.com/one');
      (capturedSuccessCallback as (text: string) => void)('https://example.com/duplicate');
    }

    await waitFor(() => {
      expect(handleScanSuccess).toHaveBeenCalledTimes(1);
      expect(handleScanSuccess).toHaveBeenCalledWith('https://example.com/one');
    });
  });

  it('cleans up camera resources on unmount', async () => {
    const mockStop = vi.fn().mockResolvedValue(undefined);
    const mockClear = vi.fn().mockResolvedValue(undefined);

    const mockStart = vi.fn().mockResolvedValue(undefined);

    vi.mocked(Html5Qrcode).mockImplementation(
      () =>
        ({
          start: mockStart,
          stop: mockStop,
          clear: mockClear,
          isScanning: true,
        }) as unknown as Html5Qrcode
    );

    const { unmount } = render(
      <QRScanner onScanSuccess={vi.fn()} onSwitchToUpload={vi.fn()} />
    );

    const startBtn = screen.getByRole('button', { name: /Start Scanner/i });
    await userEvent.click(startBtn);

    unmount();

    await waitFor(() => {
      expect(mockStop).toHaveBeenCalled();
    });
  });
});
