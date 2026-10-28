import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QRImageUpload } from '../../src/components/scanner/QRImageUpload';
import { Html5Qrcode } from 'html5-qrcode';

// Mock Html5Qrcode
vi.mock('html5-qrcode', () => {
  return {
    Html5Qrcode: vi.fn().mockImplementation(() => {
      return {
        scanFile: vi.fn(),
        clear: vi.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe('QRImageUpload component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-image');
  });

  it('rejects unsupported file formats', async () => {
    render(
      <QRImageUpload onScanSuccess={vi.fn()} onSwitchToCamera={vi.fn()} />
    );

    const file = new File(['text'], 'document.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Unsupported file format/i);
    });
  });

  it('rejects files larger than 10MB', async () => {
    render(
      <QRImageUpload onScanSuccess={vi.fn()} onSwitchToCamera={vi.fn()} />
    );

    const largeFile = new File(['x'.repeat(100)], 'huge.png', {
      type: 'image/png',
    });
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Image file is too large/i);
    });
  });

  it('successfully decodes QR image and triggers onScanSuccess callback', async () => {
    const mockScanSuccess = vi.fn();
    const mockScanFile = vi.fn().mockResolvedValue('https://example.com/decoded');

    vi.mocked(Html5Qrcode).mockImplementation(
      () =>
        ({
          scanFile: mockScanFile,
          clear: vi.fn().mockResolvedValue(undefined),
        }) as unknown as Html5Qrcode
    );

    render(
      <QRImageUpload
        onScanSuccess={mockScanSuccess}
        onSwitchToCamera={vi.fn()}
      />
    );

    const validImage = new File(['binary'], 'qr.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(input, validImage);

    await waitFor(() => {
      expect(mockScanSuccess).toHaveBeenCalledWith('https://example.com/decoded');
    });
  });

  it('displays user-friendly error when no QR code detected in image', async () => {
    const mockScanFile = vi.fn().mockRejectedValue(new Error('No QR code detected'));

    vi.mocked(Html5Qrcode).mockImplementation(
      () =>
        ({
          scanFile: mockScanFile,
          clear: vi.fn().mockResolvedValue(undefined),
        }) as unknown as Html5Qrcode
    );

    render(
      <QRImageUpload onScanSuccess={vi.fn()} onSwitchToCamera={vi.fn()} />
    );

    const validImage = new File(['binary'], 'blank.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(input, validImage);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/No readable QR code was found/i);
    });
  });
});
