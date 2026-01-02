/**
 * Configuration utilities for the test framework
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Base URL for the application
  baseUrl: process.env.BASE_URL || 'https://www.demoblaze.com',

  // API endpoints
  api: {
    baseUrl: 'https://api.demoblaze.com',
    signup: '/signup',
    login: '/login',
    entries: '/entries',
    addToCart: '/addtocart',
    viewCart: '/viewcart',
    deleteFromCart: '/deleteitem',
  },

  // Timeouts
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    navigation: 30000,
    action: 15000,
  },

  // Test data
  testData: {
    defaultPassword: 'TestPass123!',
    usernamePrefix: 'testuser_',
  },

  // Product categories
  categories: {
    phones: 'phone',
    laptops: 'notebook',
    monitors: 'monitor',
  } as const,
};

/**
 * Generate a unique username for test users
 */
export function generateUniqueUsername(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${config.testData.usernamePrefix}${timestamp}_${random}`;
}

/**
 * Generate test user credentials
 */
export function generateTestUser(): { username: string; password: string } {
  return {
    username: generateUniqueUsername(),
    password: config.testData.defaultPassword,
  };
}

export default config;

