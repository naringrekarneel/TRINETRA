import { test, expect } from '@playwright/test';

test.describe('QRGuard User Journeys', () => {
  test('Journey 1: Analyze link and inspect security findings', async ({ page }) => {
    await page.goto('/');

    // Check title and tagline
    await expect(page).toHaveTitle(/QRGuard — Think Before You Scan/i);
    await expect(page.getByText('Check before you trust.')).toBeVisible();

    // Check input field
    const input = page.getByLabel(/Enter or paste destination web link/i);
    await expect(input).toBeVisible();

    // Fill in a suspicious URL
    await input.fill('https://paypal.com.attacker.test/login');
    await page.getByRole('button', { name: /Analyze Link/i }).click();

    // Verify findings are displayed
    await expect(page.getByText(/Multiple suspicious patterns detected/i)).toBeVisible();
    await expect(page.getByText('attacker.test', { exact: true })).toBeVisible();
    await expect(page.getByText(/Deceptive Brand Keyword/i)).toBeVisible();

    // Test Copy URL button
    const copyBtn = page.getByRole('button', { name: /Copy inspected URL to clipboard/i });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(page.getByText('Copied!')).toBeVisible();

    // Test Continue to Website triggers security warning modal
    await page.getByRole('button', { name: /Continue to Website/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/You Are Leaving QRGuard/i)).toBeVisible();
    await page.getByRole('button', { name: /Cancel & Stay Safe/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Test Reset
    await page.getByRole('button', { name: /Scan or Check Another Link/i }).click();
    await expect(page.getByLabel(/Enter or paste destination web link/i)).toBeVisible();
  });

  test('Journey 2: Tab switching between Link and QR inspection', async ({ page }) => {
    await page.goto('/');

    // Switch to QR tab
    await page.getByRole('tab', { name: /Scan a QR Code/i }).click();

    // Verify Camera scanner is shown with explicit start button
    await expect(page.getByRole('button', { name: /Start Scanner/i })).toBeVisible();
    await expect(page.getByText(/Camera frames are processed in-memory/i)).toBeVisible();

    // Switch to Image upload submode
    await page.getByRole('button', { name: /Upload Image/i }).click();
    await expect(page.getByLabel(/Upload QR code image/i)).toBeVisible();
    await expect(page.getByText(/Supported formats: PNG, JPG, JPEG, WEBP, SVG/i)).toBeVisible();
  });

  test('Journey 3: Educational Security Guide and How It Works pages', async ({ page }) => {
    await page.goto('/how-it-works');
    await expect(page.getByRole('heading', { level: 1, name: /How QRGuard Works/i })).toBeVisible();
    await expect(page.getByText(/14-Point Heuristic Rule Engine/i)).toBeVisible();

    await page.goto('/security-guide');
    await expect(page.getByRole('heading', { level: 1, name: /QR Code & Web Link Security Guide/i })).toBeVisible();
    await expect(page.getByText(/Why HTTPS Does Not Mean a Site is Trustworthy/i)).toBeVisible();
    await expect(page.getByText(/Physical Parking Meter & Payment Sticker Fraud/i)).toBeVisible();

    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1, name: /About QRGuard/i })).toBeVisible();
    await expect(page.getByText(/Explicit Security Limitations & Disclaimers/i)).toBeVisible();
  });
});
