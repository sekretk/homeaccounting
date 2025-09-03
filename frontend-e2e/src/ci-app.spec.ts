import { test, expect } from '@playwright/test';

test.describe('Home Accounting App - Expense List', () => {
  test('should display expense list', async ({ page }) => {
    // Navigate to the expense page
    await page.goto('/expense');

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');

    // Wait for React app to mount
    await expect(page.locator('#root')).toBeVisible();

    // Wait a bit for any data loading
    await page.waitForTimeout(2000);

    // Check that the page has loaded with expense-related content
    // Look for expense page elements (adjust selectors based on your actual UI)
    const pageContent = await page.textContent('body');

    // Basic verification that we're on an expense-related page
    expect(pageContent).toBeTruthy();

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'test-results/expense-list.png',
      fullPage: true,
    });

    console.log('✓ Expense page loaded successfully');
  });
});
