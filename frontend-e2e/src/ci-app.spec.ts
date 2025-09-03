import { test, expect } from '@playwright/test';

test.describe('Home Accounting App', () => {
  test('should load and be healthy', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');

    // Wait for React app to mount
    await expect(page.locator('#root')).toBeVisible();

    // Basic verification that the page has content
    await expect(page.locator('body')).toHaveText(/.+/);

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'test-results/app-healthy.png',
      fullPage: true,
    });

    console.log('✓ App loaded and healthy');
  });

  test('should show expenses page', async ({ page }) => {
    // Navigate to the expense page
    await page.goto('/expense');

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');

    // Wait for React app to mount
    await expect(page.locator('#root')).toBeVisible();

    // Wait a bit for any data loading
    await page.waitForTimeout(2000);

    // Basic verification that the page has content
    await expect(page.locator('body')).toHaveText(/.+/);

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'test-results/expenses-page.png',
      fullPage: true,
    });

    console.log('✓ Expenses page loaded successfully');
  });
});
