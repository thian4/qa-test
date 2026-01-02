/**
 * AuthAPI - API helper for authentication operations
 */

import { APIRequestContext } from '@playwright/test';
import config, { generateUniqueUsername } from '../utils/config';
import { UserCredentials, SignupResponse, LoginResponse } from '../types';

export class AuthAPI {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = config.api.baseUrl;
  }

  /**
   * Encode password to Base64 (required by DemoBlaze API)
   */
  private encodePassword(password: string): string {
    return Buffer.from(password).toString('base64');
  }

  /**
   * Create a new test user via API
   */
  async createTestUser(
    username?: string,
    password?: string
  ): Promise<{ username: string; password: string; success: boolean; message?: string }> {
    const user = {
      username: username || generateUniqueUsername(),
      password: password || config.testData.defaultPassword,
    };

    const response = await this.signup(user.username, user.password);

    return {
      ...user,
      success: !response.errorMessage,
      message: response.errorMessage,
    };
  }

  /**
   * Signup a new user
   */
  async signup(username: string, password: string): Promise<SignupResponse> {
    try {
      const response = await this.request.post(`${this.baseUrl}${config.api.signup}`, {
        data: {
          username,
          password: this.encodePassword(password),
        },
      });

      const status = response.status();
      const responseText = await response.text();

      // Check HTTP status
      if (status !== 200) {
        return {
          success: false,
          errorMessage: `Signup failed with status ${status}: ${responseText || 'No response'}`,
        };
      }

      // DemoBlaze returns empty response on success, or error message
      if (!responseText || responseText === '') {
        return { success: true };
      }

      // Check for error responses
      if (responseText.includes('already exist')) {
        return { success: false, errorMessage: 'This user already exist.' };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errorMessage: `Signup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Login user via API
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.request.post(`${this.baseUrl}${config.api.login}`, {
        data: {
          username,
          password: this.encodePassword(password),
        },
      });

      const status = response.status();
      const responseText = await response.text();

      // Check HTTP status
      if (status !== 200) {
        return {
          success: false,
          errorMessage: `Login failed with status ${status}: ${responseText || 'No response'}`,
        };
      }

      // Check for error responses
      if (responseText.includes('Wrong password')) {
        return { success: false, errorMessage: 'Wrong password.' };
      }

      if (responseText.includes('User does not exist')) {
        return { success: false, errorMessage: 'User does not exist.' };
      }

      // Extract auth token from response
      const tokenMatch = responseText.match(/Auth_token:\s*([^\s"]+)/);
      if (tokenMatch) {
        return {
          success: true,
          'Auth_token': tokenMatch[1],
        };
      }

      // If we got a response without errors, consider it success
      if (responseText && !responseText.includes('error')) {
        return { success: true, 'Auth_token': responseText.trim() };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errorMessage: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Create and login a test user (convenience method)
   */
  async createAndLoginUser(): Promise<{
    credentials: UserCredentials;
    success: boolean;
    authToken?: string;
    error?: string;
  }> {
    // Create user
    const createResult = await this.createTestUser();

    if (!createResult.success) {
      return {
        credentials: { username: createResult.username, password: createResult.password },
        success: false,
        error: createResult.message,
      };
    }

    // Login user
    const loginResult = await this.login(createResult.username, createResult.password);

    return {
      credentials: {
        username: createResult.username,
        password: createResult.password,
      },
      success: loginResult.success ?? false,
      authToken: loginResult['Auth_token'],
      error: loginResult.errorMessage,
    };
  }

  /**
   * Check if user exists by attempting login
   */
  async userExists(username: string): Promise<boolean> {
    const response = await this.login(username, 'test-password-check');
    // If we get "Wrong password", user exists. If "User does not exist", they don't.
    return response.errorMessage !== 'User does not exist.';
  }

  /**
   * Validate signup response
   */
  isSignupSuccessful(response: SignupResponse): boolean {
    return response.success === true && !response.errorMessage;
  }

  /**
   * Validate login response
   */
  isLoginSuccessful(response: LoginResponse): boolean {
    return response.success === true && !response.errorMessage;
  }
}

export default AuthAPI;

