/**
 * Auth API Tests
 *
 * Minimal API tests validating:
 * - Signup API - successful registration
 * - Signup API - duplicate user rejection
 * - Login API - valid credentials
 * - Login API - invalid credentials
 */

import { test, expect } from "../../src/fixtures";
import { generateTestUser } from "../../src/utils/config";

test.describe("Auth API", () => {
  test.describe("Signup API", () => {
    test("should successfully create new user", async ({ authAPI }) => {
      // Generate unique credentials
      const credentials = generateTestUser();

      // Attempt signup
      const response = await authAPI.signup(
        credentials.username,
        credentials.password
      );

      // Verify success
      expect(response.success).toBe(true);
      expect(response.errorMessage).toBeUndefined();
    });

    test("should reject duplicate username", async ({ authAPI }) => {
      // Generate unique credentials
      const credentials = generateTestUser();

      // First signup - should succeed
      const firstResponse = await authAPI.signup(
        credentials.username,
        credentials.password
      );
      expect(firstResponse.success).toBe(true);

      // Second signup with same username - should fail
      const secondResponse = await authAPI.signup(
        credentials.username,
        "differentpassword"
      );

      // Verify rejection
      expect(secondResponse.success).toBe(false);
      expect(secondResponse.errorMessage).toContain("already exist");
    });
  });

  test.describe("Login API", () => {
    test("should login successfully with valid credentials", async ({
      authAPI,
    }) => {
      // Create a new user first
      const credentials = generateTestUser();
      await authAPI.signup(credentials.username, credentials.password);

      // Attempt login
      const response = await authAPI.login(
        credentials.username,
        credentials.password
      );

      // Verify success
      expect(response.success).toBe(true);
      expect(response.errorMessage).toBeUndefined();
      // Auth token may or may not be present depending on API behavior
    });

    test("should reject login with invalid password", async ({ authAPI }) => {
      // Create a new user first
      const credentials = generateTestUser();
      await authAPI.signup(credentials.username, credentials.password);

      // Attempt login with wrong password
      const response = await authAPI.login(
        credentials.username,
        "wrongpassword123"
      );

      // Verify rejection
      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe("Wrong password.");
    });

    test("should reject login for non-existent user", async ({ authAPI }) => {
      // Generate a username that doesn't exist
      const nonExistentUser = `nonexistent_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;

      // Attempt login
      const response = await authAPI.login(nonExistentUser, "anypassword");

      // Verify rejection
      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe("User does not exist.");
    });
  });

  test.describe("Helper Methods", () => {
    test("should create and login user in one call", async ({ authAPI }) => {
      // Use the convenience method
      const result = await authAPI.createAndLoginUser();

      // Verify both operations succeeded
      expect(result.success).toBe(true);
      expect(result.credentials.username).toBeTruthy();
      expect(result.credentials.password).toBeTruthy();
      expect(result.error).toBeUndefined();
    });

    test("should check if user exists", async ({ authAPI }) => {
      // Create a user
      const credentials = generateTestUser();
      await authAPI.signup(credentials.username, credentials.password);

      // Check if user exists
      const exists = await authAPI.userExists(credentials.username);
      expect(exists).toBe(true);

      // Check non-existent user
      const nonExistentUser = `nonexistent_${Date.now()}`;
      const notExists = await authAPI.userExists(nonExistentUser);
      expect(notExists).toBe(false);
    });
  });
});
