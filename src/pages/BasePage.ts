/**
 * BasePage - Common page functionality shared across all pages
 */

import { Page, Locator } from "@playwright/test";
import config from "../utils/config";

export class BasePage {
  readonly page: Page;

  // Common navigation elements
  readonly navHome: Locator;
  readonly navContact: Locator;
  readonly navAbout: Locator;
  readonly navCart: Locator;
  readonly navLogin: Locator;
  readonly navLogout: Locator;
  readonly navSignup: Locator;
  readonly welcomeUser: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation locators
    this.navHome = page.locator("a.nav-link", { hasText: "Home" });
    this.navContact = page.locator("a.nav-link", { hasText: "Contact" });
    this.navAbout = page.locator("a.nav-link", { hasText: "About us" });
    this.navCart = page.locator("#cartur");
    this.navLogin = page.locator("#login2");
    this.navLogout = page.locator("#logout2");
    this.navSignup = page.locator("#signin2");
    this.welcomeUser = page.locator("#nameofuser");
  }

  /**
   * Navigate to the base URL
   */
  async goto(): Promise<void> {
    await this.page.goto(config.baseUrl);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to a specific path
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(`${config.baseUrl}${path}`);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to finish loading
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    // Wait for main content to be visible
    await this.page.waitForSelector(".navbar", { state: "visible" });
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(timeout = 5000): Promise<void> {
    try {
      await this.page.waitForLoadState("networkidle", { timeout });
    } catch (error) {
      // Log but don't fail - network idle is optional
      console.warn(
        "Network did not become idle:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  /**
   * Navigate to Home page
   */
  async goHome(): Promise<void> {
    await this.navHome.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Cart page
   */
  async goToCart(): Promise<void> {
    await this.navCart.click();
    await this.page.waitForURL("**/cart.html");
    await this.waitForPageLoad();
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.welcomeUser.waitFor({ state: "visible", timeout: 3000 });
      const text = await this.welcomeUser.textContent();
      return text !== null && text.includes("Welcome");
    } catch {
      return false;
    }
  }

  /**
   * Get logged in username
   */
  async getLoggedInUsername(): Promise<string | null> {
    try {
      const text = await this.welcomeUser.textContent();
      if (text && text.includes("Welcome")) {
        return text.replace("Welcome ", "").trim();
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    if (await this.isLoggedIn()) {
      await this.navLogout.click();
      await this.navLogin.waitFor({ state: "visible" });
    }
  }

  /**
   * Handle JavaScript alert and return message
   */
  async handleAlert(action: "accept" | "dismiss" = "accept"): Promise<string> {
    return new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        if (action === "accept") {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
        resolve(message);
      });
    });
  }

  /**
   * Setup alert listener (non-blocking)
   * @deprecated Use triggerActionAndHandleAlert for more robust handling
   */
  setupAlertListener(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }

  /**
   * Handle JavaScript alert and return message
   * Uses Promise.all to prevent race conditions
   */
  async triggerActionAndHandleAlert(
    action: () => Promise<void>
  ): Promise<string> {
    const [dialog] = await Promise.all([
      this.page.waitForEvent("dialog"),
      action(),
    ]);
    const message = dialog.message();
    await dialog.accept();
    return message;
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    // Ensure the screenshots directory exists is handled by Playwright usually,
    // but we specify the path clearly
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for a specific amount of time
   */
  async sleep(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
