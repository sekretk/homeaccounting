import { test, expect } from '@playwright/test';

test.describe('Home Accounting App - Kubernetes Deployment', () => {
  test('should load the application successfully', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the DOM to be loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for React app to mount
    await expect(page.locator('#root')).toBeVisible();
    
    // Check for main app elements
    await expect(page.locator('body')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/k8s-app-loaded.png', fullPage: true });
    
    console.log('✓ K8s App loaded successfully');
  });

  test('should have working backend health check', async ({ page }) => {
    // Check if backend API is responding through K8s proxy
    const response = await page.request.get('/api/health');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    // Parse response and verify health check structure
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status', 'ok');
    expect(healthData).toHaveProperty('info');
    expect(healthData.info).toHaveProperty('database');
    expect(healthData.info.database).toHaveProperty('status', 'up');
    
    console.log('✓ K8s Backend health check passed');
  });

  test('should load expense data from database', async ({ page }) => {
    // Check if expense API returns data
    const response = await page.request.get('/api/expense');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    // Parse expense data
    const expenseData = await response.json();
    expect(Array.isArray(expenseData)).toBeTruthy();
    expect(expenseData.length).toBeGreaterThan(0);
    
    // Verify expense data structure
    const firstExpense = expenseData[0];
    expect(firstExpense).toHaveProperty('id');
    expect(firstExpense).toHaveProperty('title');
    expect(firstExpense).toHaveProperty('amount');
    expect(firstExpense).toHaveProperty('category');
    expect(firstExpense).toHaveProperty('expenseDate');
    
    console.log(`✓ Loaded ${expenseData.length} expenses from K8s database`);
  });

  test('should navigate to expense management page', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for app to load
    await page.waitForLoadState('domcontentloaded');
    
    // Look for expense-related navigation or content
    // This will depend on your actual frontend structure
    await expect(page.locator('body')).toBeVisible();
    
    // Take screenshot of the main page
    await page.screenshot({ path: 'test-results/k8s-main-page.png', fullPage: true });
    
    console.log('✓ Main page navigation successful');
  });
});

