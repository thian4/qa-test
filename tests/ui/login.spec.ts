/**
 * Login Feature Tests
 *
 * Test scenarios covering:
 * - Valid login with auto-created account
 * - Invalid password rejection
 * - Empty username/password validation
 * - Non-existent user handling
 * - Logout functionality
 * - Signup functionality
 */

import { test, expect } from "../../src/fixtures";
import { LoginPage } from "../../src/pages";
import { generateTestUser } from "../../src/utils/config";

test.describe("Login Feature", () => {
  test.describe("Valid Login Scenarios", () => {
    test("should login successfully with valid credentials", async ({
      loginPage,
      testUser,
    }) => {
      // Navigate to homepage
      await loginPage.goto();

      // Perform login with auto-created test user
      const alertMessage = await loginPage.login(
        testUser.username,
        testUser.password
      );

      // Should not show any error alert
      expect(alertMessage).toBeNull();

      // Verify user is logged in
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(true);

      // Verify welcome message contains username
      const loggedInUser = await loginPage.getLoggedInUsername();
      expect(loggedInUser).toBe(testUser.username);
    });

    test("should display welcome message with username after login", async ({
      authenticatedPage,
    }) => {
      const { page, user } = authenticatedPage;

      // Verify welcome message is visible
      await expect(page.welcomeUser).toBeVisible();

      // Verify username is displayed
      const welcomeText = await page.welcomeUser.textContent();
      expect(welcomeText).toContain(user.username);
    });

    test("should persist login state after page refresh", async ({
      authenticatedPage,
    }) => {
      const { page, user } = authenticatedPage;

      // Refresh the page
      await page.page.reload();
      await page.waitForPageLoad();

      // Verify user is still logged in
      const isLoggedIn = await page.isLoggedIn();
      expect(isLoggedIn).toBe(true);

      // Verify username is still displayed
      const loggedInUser = await page.getLoggedInUsername();
      expect(loggedInUser).toBe(user.username);
    });
  });

  test.describe("Logout Functionality", () => {
    test("should logout successfully", async ({ authenticatedPage }) => {
      const { page } = authenticatedPage;

      // Perform logout
      await page.logout();

      // Verify user is logged out
      const isLoggedIn = await page.isLoggedIn();
      expect(isLoggedIn).toBe(false);

      // Verify login button is visible again
      await expect(page.navLogin).toBeVisible();
    });

    test("should show login button after logout", async ({
      authenticatedPage,
    }) => {
      const { page } = authenticatedPage;

      // Logout
      await page.logout();

      // Verify login and signup buttons are visible
      await expect(page.navLogin).toBeVisible();
      await expect(page.navSignup).toBeVisible();

      // Verify logout button is hidden
      await expect(page.navLogout).toBeHidden();
    });
  });

  test.describe("Invalid Login Scenarios", () => {
    test("should reject login with wrong password", async ({
      loginPage,
      testUser,
    }) => {
      await loginPage.goto();

      // Try to login with wrong password
      const alertMessage = await loginPage.login(
        testUser.username,
        "wrongpassword123"
      );

      // Should show error alert
      expect(alertMessage).toBe("Wrong password.");

      // User should not be logged in
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });

    test("should reject login with non-existent username", async ({
      loginPage,
    }) => {
      await loginPage.goto();

      // Try to login with non-existent user
      const nonExistentUser = `nonexistent_${Date.now()}`;
      const alertMessage = await loginPage.login(
        nonExistentUser,
        "anypassword"
      );

      // Should show user does not exist error
      expect(alertMessage).toBe("User does not exist.");

      // User should not be logged in
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });

    test("should reject login with empty username", async ({ loginPage }) => {
      await loginPage.goto();

      // Try to login with empty username
      const alertMessage = await loginPage.login("", "somepassword");

      // Should show validation error
      expect(alertMessage).toBe("Please fill out Username and Password.");

      // User should not be logged in
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });

    test("should reject login with empty password", async ({
      loginPage,
      testUser,
    }) => {
      await loginPage.goto();

      // Try to login with empty password
      const alertMessage = await loginPage.login(testUser.username, "");

      // Should show validation error
      expect(alertMessage).toBe("Please fill out Username and Password.");

      // User should not be logged in
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });

    test("should reject login with both fields empty", async ({
      loginPage,
    }) => {
      await loginPage.goto();

      // Try to login with both fields empty
      const alertMessage = await loginPage.login("", "");

      // Should show validation error
      expect(alertMessage).toBe("Please fill out Username and Password.");

      // User should not be logged in
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });
  });

  test.describe("Signup Functionality", () => {
    test("should signup successfully with new username", async ({
      loginPage,
    }) => {
      await loginPage.goto();

      // Generate unique credentials
      const newUser = generateTestUser();

      // Perform signup
      const alertMessage = await loginPage.signup(
        newUser.username,
        newUser.password
      );

      // Should show success message
      expect(alertMessage).toBe("Sign up successful.");

      // Verify user can now login
      const loginAlert = await loginPage.login(
        newUser.username,
        newUser.password
      );
      expect(loginAlert).toBeNull();

      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(true);
    });

    test("should reject signup with existing username", async ({
      loginPage,
      testUser,
    }) => {
      await loginPage.goto();

      // Try to signup with already existing username
      const alertMessage = await loginPage.signup(
        testUser.username,
        "newpassword123"
      );

      // Should show user exists error
      expect(alertMessage).toBe("This user already exist.");
    });
  });

  test.describe("Modal Behavior", () => {
    test("should open login modal when clicking Log in", async ({
      loginPage,
    }) => {
      await loginPage.goto();

      // Open login modal
      await loginPage.openLoginModal();

      // Verify modal is visible
      const isVisible = await loginPage.isLoginModalVisible();
      expect(isVisible).toBe(true);

      // Verify modal title
      const title = await loginPage.getLoginModalTitle();
      expect(title).toBe("Log in");
    });

    test("should close login modal with Close button", async ({
      loginPage,
    }) => {
      await loginPage.goto();

      // Open and close modal
      await loginPage.openLoginModal();
      await loginPage.closeLoginModal();

      // Verify modal is hidden
      const isVisible = await loginPage.isLoginModalVisible();
      expect(isVisible).toBe(false);
    });

    test("should close login modal with X button", async ({ loginPage }) => {
      await loginPage.goto();

      // Open and close modal with X
      await loginPage.openLoginModal();
      await loginPage.closeLoginModalWithX();

      // Verify modal is hidden
      const isVisible = await loginPage.isLoginModalVisible();
      expect(isVisible).toBe(false);
    });

    test("should open signup modal when clicking Sign up", async ({
      loginPage,
    }) => {
      await loginPage.goto();

      // Open signup modal
      await loginPage.openSignupModal();

      // Verify modal is visible
      const isVisible = await loginPage.isSignupModalVisible();
      expect(isVisible).toBe(true);

      // Verify modal title
      const title = await loginPage.getSignupModalTitle();
      expect(title).toBe("Sign up");
    });

    test("should close signup modal with Close button", async ({
      loginPage,
    }) => {
      await loginPage.goto();

      // Open and close modal
      await loginPage.openSignupModal();
      await loginPage.closeSignupModal();

      // Verify modal is hidden
      const isVisible = await loginPage.isSignupModalVisible();
      expect(isVisible).toBe(false);
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle special characters in username", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Try login with special characters
      const specialUsername = `test@user#${Date.now()}`;
      const alertMessage = await loginPage.login(
        specialUsername,
        "password123"
      );

      // Should handle gracefully (either user not found or successful if created)
      expect(alertMessage).toBeTruthy();
    });

    test("should handle very long username", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Create a very long username (100+ characters)
      const longUsername = "a".repeat(150);
      const alertMessage = await loginPage.login(longUsername, "password123");

      // Should handle gracefully
      expect(alertMessage).toBeTruthy();
    });

    test("should handle whitespace-only username", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Try login with whitespace only
      const alertMessage = await loginPage.login("   ", "password123");

      // Should show validation error or user not found
      expect(alertMessage).toBeTruthy();
    });
  });
});
