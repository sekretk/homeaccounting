import { test, expect } from '@playwright/test';

test.describe('Home Accounting App - CI Environment', () => {
  test('should load the application successfully in CI', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Wait for the DOM to be loaded
    await page.waitForLoadState('domcontentloaded');

    // Wait for React app to mount
    await expect(page.locator('#root')).toBeVisible();

    // Check for main app elements
    await expect(page.locator('body')).toBeVisible();

    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'test-results/ci-app-loaded.png',
      fullPage: true,
    });

    console.log('✓ CI App loaded successfully');
  });

  test('should have working backend health check in CI', async ({ page }) => {
    // Check if backend API is responding
    const response = await page.request.get('/api/health');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse response and verify health check structure
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status', 'ok');
    expect(healthData).toHaveProperty('info');
    expect(healthData.info).toHaveProperty('database');
    expect(healthData.info.database).toHaveProperty('status', 'up');

    console.log('✓ CI Backend health check passed');
  });

  test('should handle API requests without existing data', async ({ page }) => {
    // Check if expense API is accessible (may be empty in CI)
    const response = await page.request.get('/api/expense');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse expense data (might be empty array)
    const expenseData = await response.json();
    expect(Array.isArray(expenseData)).toBeTruthy();

    console.log(`✓ CI API accessible, returned ${expenseData.length} expenses`);
  });

  test('should display proper frontend structure', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Wait for app to load
    await page.waitForLoadState('domcontentloaded');

    // Check for basic React app structure
    await expect(page.locator('#root')).toBeVisible();

    // Check page title or other basic elements
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Take screenshot of the main page
    await page.screenshot({
      path: 'test-results/ci-main-page.png',
      fullPage: true,
    });

    console.log('✓ CI Frontend structure verified');
  });
});
