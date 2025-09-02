import { test, expect } from '@playwright/test';

test.describe('Home Accounting App', () => {
  test('should load the application successfully', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the DOM to be loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for specific content to appear (more reliable)
    await expect(page.locator('body')).toBeVisible();
    
    // If you have a specific app root element, wait for it:
    // await expect(page.locator('#root')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/app-loaded.png', fullPage: true });
    
    console.log('✓ App loaded successfully');
  });

  test('should have working backend health check', async ({ page }) => {
    // Check if backend API is responding
    const response = await page.request.get('/api/health');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    // Parse response
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status');
    
    console.log('✓ Backend health check passed');
  });
});

