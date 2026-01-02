/**
 * Common helper utilities for the test framework
 */

import { Page } from '@playwright/test';

/**
 * Wait for a specified amount of time
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch {
    // Network didn't become idle, continue anyway
  }
}

/**
 * Handle JavaScript alert dialogs
 */
export async function handleAlert(
  page: Page,
  action: 'accept' | 'dismiss' = 'accept'
): Promise<string> {
  return new Promise((resolve) => {
    page.once('dialog', async (dialog) => {
      const message = dialog.message();
      if (action === 'accept') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
      resolve(message);
    });
  });
}

/**
 * Setup alert listener and return message when triggered
 */
export function setupAlertListener(page: Page): Promise<string> {
  return new Promise((resolve) => {
    page.once('dialog', async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      resolve(message);
    });
  });
}

/**
 * Extract numeric price from string (e.g., "$790" -> 790)
 */
export function extractPrice(priceString: string): number {
  const match = priceString.match(/[\d,]+/);
  if (match) {
    return parseInt(match[0].replace(/,/g, ''), 10);
  }
  return 0;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number): string {
  return `$${price}`;
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delayMs * attempt);
      }
    }
  }

  throw lastError;
}

/**
 * Generate random string of specified length
 */
export function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if string contains SQL injection patterns
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)(\s|$)/i,
    /('|")\s*(OR|AND)\s*('|"|\d)/i,
    /;\s*(SELECT|INSERT|UPDATE|DELETE|DROP)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Log object as JSON string (for debugging)
 */
export function logJson(label: string, obj: unknown): void {
  console.log(`${label}: ${JSON.stringify(obj, null, 2)}`);
}

