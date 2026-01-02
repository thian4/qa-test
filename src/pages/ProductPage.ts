/**
 * ProductPage - Handles product detail page interactions
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ProductInfo {
  name: string;
  price: number;
  description: string;
  image: string;
}

export class ProductPage extends BasePage {
  // Product detail elements
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;

  // Navigation
  readonly homeLink: Locator;

  constructor(page: Page) {
    super(page);

    // Product details
    this.productName = page.locator('.name');
    this.productPrice = page.locator('.price-container');
    this.productDescription = page.locator('#more-information p');
    this.productImage = page.locator('.product-image img, #imgp img');
    this.addToCartButton = page.locator('a.btn-success', { hasText: 'Add to cart' });

    // Navigation
    this.homeLink = page.locator('a.nav-link', { hasText: 'Home' });
  }

  /**
   * Navigate to a specific product by ID
   */
  async gotoProduct(productId: number): Promise<void> {
    await this.page.goto(`https://www.demoblaze.com/prod.html?idp_=${productId}`);
    await this.waitForProductLoad();
  }

  /**
   * Wait for product details to load
   */
  async waitForProductLoad(): Promise<void> {
    await this.productName.waitFor({ state: 'visible', timeout: 10000 });
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get product information
   */
  async getProductInfo(): Promise<ProductInfo> {
    await this.waitForProductLoad();

    const name = (await this.productName.textContent()) || '';
    const priceText = (await this.productPrice.textContent()) || '0';
    const description = (await this.productDescription.textContent()) || '';
    const image = (await this.productImage.getAttribute('src')) || '';

    // Extract numeric price from text like "$790 *includes tax"
    const priceMatch = priceText.match(/\$(\d+)/);
    const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;

    return {
      name: name.trim(),
      price,
      description: description.trim(),
      image,
    };
  }

  /**
   * Get product name
   */
  async getProductName(): Promise<string> {
    const name = await this.productName.textContent();
    return name?.trim() || '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<number> {
    const priceText = await this.productPrice.textContent();
    const priceMatch = priceText?.match(/\$(\d+)/);
    return priceMatch ? parseInt(priceMatch[1], 10) : 0;
  }

  /**
   * Get product description
   */
  async getProductDescription(): Promise<string> {
    const description = await this.productDescription.textContent();
    return description?.trim() || '';
  }

  /**
   * Add product to cart
   * Returns the alert message
   */
  async addToCart(): Promise<string> {
    return await this.triggerActionAndHandleAlert(async () => {
      await this.addToCartButton.click();
    });
  }

  /**
   * Add product to cart and verify success
   */
  async addToCartAndVerify(): Promise<boolean> {
    const alertMessage = await this.addToCart();
    return alertMessage.toLowerCase().includes('product added');
  }

  /**
   * Check if product page is loaded
   */
  async isProductPageLoaded(): Promise<boolean> {
    try {
      await this.productName.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Navigate back to home from product page
   */
  async goBackToHome(): Promise<void> {
    await this.homeLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Check if Add to Cart button is visible
   */
  async isAddToCartButtonVisible(): Promise<boolean> {
    return await this.addToCartButton.isVisible();
  }

  /**
   * Get product image source
   */
  async getProductImageSrc(): Promise<string> {
    const src = await this.productImage.getAttribute('src');
    return src || '';
  }
}

