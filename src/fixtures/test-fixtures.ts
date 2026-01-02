/**
 * Custom Playwright fixtures for DemoBlaze testing
 */

import { test as base, expect } from '@playwright/test';
import { LoginPage, HomePage, ProductPage, CartPage } from '../pages';
import { AuthAPI } from '../api/AuthAPI';
import { UserCredentials } from '../types';
import { generateTestUser } from '../utils/config';

// Define custom fixture types
type CustomFixtures = {
  // Page objects
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;

  // API helper
  authAPI: AuthAPI;

  // Test user with auto-created account
  testUser: UserCredentials;

  // Authenticated page (already logged in)
  authenticatedPage: {
    page: LoginPage;
    user: UserCredentials;
  };
};

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  // Login Page fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Home Page fixture
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // Product Page fixture
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },

  // Cart Page fixture
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  // Auth API fixture
  authAPI: async ({ request }, use) => {
    const authAPI = new AuthAPI(request);
    await use(authAPI);
  },

  // Test user fixture - creates a new user via UI signup for each test
  testUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const credentials = generateTestUser();

    // Navigate to homepage
    await loginPage.goto();

    // Create user via UI signup
    const alertMessage = await loginPage.signup(credentials.username, credentials.password);

    if (!alertMessage.includes('Sign up successful')) {
      throw new Error(`Failed to create test user: ${alertMessage}`);
    }

    await use(credentials);

    // Cleanup could go here if needed
  },

  // Authenticated page fixture - user is already logged in
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    // Create a new test user via UI
    const credentials = generateTestUser();
    
    await loginPage.goto();
    
    // Signup via UI
    const signupMessage = await loginPage.signup(credentials.username, credentials.password);
    
    if (!signupMessage.includes('Sign up successful')) {
      throw new Error(`Failed to create test user: ${signupMessage}`);
    }

    // Login via UI
    await loginPage.quickLogin(credentials.username, credentials.password);

    // Verify login was successful
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    await use({
      page: loginPage,
      user: credentials,
    });

    // Logout after test
    try {
      await loginPage.logout();
    } catch {
      // Ignore logout errors
    }
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';

// Test info types
export type TestFixtures = CustomFixtures;

