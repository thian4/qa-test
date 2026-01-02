/**
 * LoginPage - Handles login and signup modal interactions
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Login Modal Elements
  readonly loginModal: Locator;
  readonly loginUsername: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginCloseButton: Locator;
  readonly loginXButton: Locator;

  // Signup Modal Elements
  readonly signupModal: Locator;
  readonly signupUsername: Locator;
  readonly signupPassword: Locator;
  readonly signupButton: Locator;
  readonly signupCloseButton: Locator;
  readonly signupXButton: Locator;

  constructor(page: Page) {
    super(page);

    // Login Modal
    this.loginModal = page.locator('#logInModal');
    this.loginUsername = page.locator('#loginusername');
    this.loginPassword = page.locator('#loginpassword');
    this.loginButton = page.locator('#logInModal button.btn-primary');
    this.loginCloseButton = page.locator('#logInModal button.btn-secondary');
    this.loginXButton = page.locator('#logInModal .close');

    // Signup Modal
    this.signupModal = page.locator('#signInModal');
    this.signupUsername = page.locator('#sign-username');
    this.signupPassword = page.locator('#sign-password');
    this.signupButton = page.locator('#signInModal button.btn-primary');
    this.signupCloseButton = page.locator('#signInModal button.btn-secondary');
    this.signupXButton = page.locator('#signInModal .close');
  }

  /**
   * Open the login modal
   */
  async openLoginModal(): Promise<void> {
    await this.navLogin.click();
    await this.loginModal.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(300); // Wait for modal animation
  }

  /**
   * Open the signup modal
   */
  async openSignupModal(): Promise<void> {
    await this.navSignup.click();
    await this.signupModal.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(300); // Wait for modal animation
  }

  /**
   * Close login modal with Close button
   */
  async closeLoginModal(): Promise<void> {
    await this.loginCloseButton.click();
    await this.loginModal.waitFor({ state: 'hidden' });
  }

  /**
   * Close login modal with X button
   */
  async closeLoginModalWithX(): Promise<void> {
    await this.loginXButton.click();
    await this.loginModal.waitFor({ state: 'hidden' });
  }

  /**
   * Close signup modal with Close button
   */
  async closeSignupModal(): Promise<void> {
    await this.signupCloseButton.click();
    await this.signupModal.waitFor({ state: 'hidden' });
  }

  /**
   * Close signup modal with X button
   */
  async closeSignupModalWithX(): Promise<void> {
    await this.signupXButton.click();
    await this.signupModal.waitFor({ state: 'hidden' });
  }

  /**
   * Fill login credentials
   */
  async fillLoginCredentials(username: string, password: string): Promise<void> {
    await this.loginUsername.fill(username);
    await this.loginPassword.fill(password);
  }

  /**
   * Fill signup credentials
   */
  async fillSignupCredentials(username: string, password: string): Promise<void> {
    await this.signupUsername.fill(username);
    await this.signupPassword.fill(password);
  }

  /**
   * Perform login with credentials
   * Returns alert message if any
   */
  async login(username: string, password: string): Promise<string | null> {
    await this.openLoginModal();
    await this.fillLoginCredentials(username, password);

    let alertMessage: string | null = null;
    const handleDialog = async (dialog: import('@playwright/test').Dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    };

    this.page.on('dialog', handleDialog);
    await this.loginButton.click();

    // Wait for either success (welcome user visible) or failure (dialog handled)
    try {
      await Promise.race([
        this.welcomeUser.waitFor({ state: 'visible', timeout: 5000 }),
        // Check for alertMessage indirectly if dialog event didn't resolve quickly enough
        this.page.waitForTimeout(1000).then(() => {
          if (alertMessage) return Promise.resolve();
          return new Promise(() => {}); // Wait longer
        })
      ]);
    } catch {
      // Ignore timeout as we check alertMessage below
    } finally {
      this.page.off('dialog', handleDialog);
    }

    return alertMessage;
  }

  /**
   * Perform signup with credentials
   * Returns alert message
   */
  async signup(username: string, password: string): Promise<string> {
    await this.openSignupModal();
    await this.fillSignupCredentials(username, password);

    return await this.triggerActionAndHandleAlert(async () => {
      await this.signupButton.click();
    });
  }

  /**
   * Quick login - assumes valid credentials
   */
  async quickLogin(username: string, password: string): Promise<void> {
    await this.openLoginModal();
    await this.fillLoginCredentials(username, password);
    await this.loginButton.click();
    await this.welcomeUser.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Check if login modal is visible
   */
  async isLoginModalVisible(): Promise<boolean> {
    return await this.loginModal.isVisible();
  }

  /**
   * Check if signup modal is visible
   */
  async isSignupModalVisible(): Promise<boolean> {
    return await this.signupModal.isVisible();
  }

  /**
   * Get login modal title
   */
  async getLoginModalTitle(): Promise<string> {
    const title = this.loginModal.locator('.modal-title');
    return (await title.textContent()) || '';
  }

  /**
   * Get signup modal title
   */
  async getSignupModalTitle(): Promise<string> {
    const title = this.signupModal.locator('.modal-title');
    return (await title.textContent()) || '';
  }
}

