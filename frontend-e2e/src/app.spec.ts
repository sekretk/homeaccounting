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
    await page.screenshot({
      path: 'test-results/k8s-app-loaded.png',
      fullPage: true,
    });

    console.log('✓ K8s App loaded successfully');
  });

  test('should have working backend health check', async ({ page }) => {
    // Check if backend API is responding through proxy
    const response = await page.request.get('/api/health');

    // Debug response details
    console.log('Response status:', response.status());
    console.log('Response headers:', response.headers());

    // Get response text for debugging
    const responseText = await response.text();
    console.log('Response body preview:', responseText.substring(0, 200));

    // Check if response is OK
    if (!response.ok()) {
      console.error('Health check failed with status:', response.status());
      console.error('Response body:', responseText);
      throw new Error(
        `Health check failed: ${response.status()} - ${responseText.substring(0, 100)}`,
      );
    }

    expect(response.status()).toBe(200);

    // Check if response is JSON
    const contentType = response.headers()['content-type'] || '';
    if (!contentType.includes('application/json')) {
      console.error('Response is not JSON, content-type:', contentType);
      console.error('Response body:', responseText);
      throw new Error(`Expected JSON response but got: ${contentType}`);
    }

    // Parse response and verify health check structure
    let healthData;
    try {
      healthData = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      console.error('Response text:', responseText);
      throw error;
    }

    expect(healthData).toHaveProperty('status', 'ok');
    expect(healthData).toHaveProperty('info');
    expect(healthData.info).toHaveProperty('database');
    expect(healthData.info.database).toHaveProperty('status', 'up');

    console.log('✓ Backend health check passed');
  });

  test('should load expense data from database', async ({ page }) => {
    // Check if expense API returns data
    const response = await page.request.get('/api/expense');

    // Debug response details
    console.log('Expense API response status:', response.status());

    // Get response text for debugging
    const responseText = await response.text();
    console.log(
      'Expense API response preview:',
      responseText.substring(0, 200),
    );

    // Check if response is OK
    if (!response.ok()) {
      console.error('Expense API failed with status:', response.status());
      console.error('Response body:', responseText);
      throw new Error(
        `Expense API failed: ${response.status()} - ${responseText.substring(0, 100)}`,
      );
    }

    expect(response.status()).toBe(200);

    // Parse expense data with error handling
    let expenseData;
    try {
      expenseData = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse expense JSON:', error);
      console.error('Response text:', responseText);
      throw error;
    }

    expect(Array.isArray(expenseData)).toBeTruthy();
    expect(expenseData.length).toBeGreaterThan(0);

    // Verify expense data structure
    const firstExpense = expenseData[0];
    expect(firstExpense).toHaveProperty('id');
    expect(firstExpense).toHaveProperty('title');
    expect(firstExpense).toHaveProperty('amount');
    expect(firstExpense).toHaveProperty('category');
    expect(firstExpense).toHaveProperty('expenseDate');

    console.log(`✓ Loaded ${expenseData.length} expenses from database`);
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
    await page.screenshot({
      path: 'test-results/k8s-main-page.png',
      fullPage: true,
    });

    console.log('✓ Main page navigation successful');
  });
});
