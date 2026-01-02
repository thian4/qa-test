/**
 * TypeScript interfaces for DemoBlaze QA Automation Framework
 */

// User credentials interface
export interface UserCredentials {
  username: string;
  password: string;
}

// Product information interface
export interface Product {
  id?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

// Cart item interface
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
}

// Order information interface
export interface OrderInfo {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

// API response interfaces
export interface AuthResponse {
  success?: boolean;
  errorMessage?: string;
}

export interface SignupResponse extends AuthResponse {
  // Signup specific fields
}

export interface LoginResponse extends AuthResponse {
  'Auth_token'?: string;
}

// Category types
export type ProductCategory = 'phone' | 'notebook' | 'monitor';

// Test data interfaces
export interface TestUser extends UserCredentials {
  createdAt?: Date;
}

// Page element selectors interface
export interface PageSelectors {
  [key: string]: string;
}

// Test case documentation interfaces
export interface TestCase {
  id: string;
  module: string;
  feature: string;
  scenario: string;
  preconditions: string;
  testSteps: string;
  expectedResult: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Functional' | 'Negative' | 'Edge Case' | 'Security';
  status: 'Ready' | 'Draft' | 'Deprecated';
}

export interface TestCaseSuite {
  login: TestCase[];
  cart: TestCase[];
}

