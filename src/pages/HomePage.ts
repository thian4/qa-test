/**
 * HomePage - Handles homepage interactions including category filtering and product browsing
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductCategory } from '../types';

export interface ProductCard {
  name: string;
  price: number;
  description: string;
  image: string;
  element: Locator;
}

export class HomePage extends BasePage {
  // Category elements
  readonly categoriesContainer: Locator;
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;

  // Product grid
  readonly productContainer: Locator;
  readonly productCards: Locator;

  // Carousel
  readonly carousel: Locator;
  readonly carouselPrev: Locator;
  readonly carouselNext: Locator;

  // Footer
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);

    // Categories
    this.categoriesContainer = page.locator('#contcont .list-group');
    this.phonesCategory = page.locator('a#itemc', { hasText: 'Phones' });
    this.laptopsCategory = page.locator('a#itemc', { hasText: 'Laptops' });
    this.monitorsCategory = page.locator('a#itemc', { hasText: 'Monitors' });

    // Products
    this.productContainer = page.locator('#tbodyid');
    this.productCards = page.locator('#tbodyid .card');

    // Carousel
    this.carousel = page.locator('#carouselExampleIndicators');
    this.carouselPrev = page.locator('.carousel-control-prev');
    this.carouselNext = page.locator('.carousel-control-next');

    // Footer
    this.footer = page.locator('#footc');
  }

  /**
   * Navigate to homepage
   */
  async gotoHomepage(): Promise<void> {
    await this.goto();
    await this.waitForProductsToLoad();
  }

  /**
   * Wait for products to load
   */
  async waitForProductsToLoad(): Promise<void> {
    await this.productContainer.waitFor({ state: 'visible' });
    // Wait for at least one product to appear
    await this.page.waitForSelector('#tbodyid .card', { timeout: 10000 });
    // Small delay for products to fully render
    await this.page.waitForTimeout(300);
  }

  /**
   * Select a product category and wait for the grid to refresh
   */
  async selectCategory(category: ProductCategory): Promise<void> {
    // Get the current first product name to detect change
    const firstProductBefore = await this.productCards.first()
      .locator('.card-title a')
      .textContent()
      .catch(() => '');
    
    switch (category) {
      case 'phone':
        await this.phonesCategory.click();
        break;
      case 'notebook':
        await this.laptopsCategory.click();
        break;
      case 'monitor':
        await this.monitorsCategory.click();
        break;
    }

    // Wait for the first item to change OR for the grid to refresh
    await this.page.waitForFunction(
      (oldName) => {
        const firstCard = document.querySelector('#tbodyid .card .card-title a');
        return firstCard && firstCard.textContent?.trim() !== oldName?.trim();
      },
      firstProductBefore,
      { timeout: 5000 }
    ).catch(() => {}); // Fallback if it's the same item

    await this.waitForProductsToLoad();
  }

  /**
   * Optimized: Extract all products in a single browser-side execution
   */
  async getProductCards(): Promise<ProductCard[]> {
    await this.waitForProductsToLoad();
    
    const productData = await this.page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#tbodyid .card'));
      return cards.map(card => {
        const name = card.querySelector('.card-title a')?.textContent?.trim() || '';
        const priceText = card.querySelector('h5')?.textContent || '0';
        const description = card.querySelector('.card-text')?.textContent?.trim() || '';
        const image = card.querySelector('.card-img-top')?.getAttribute('src') || '';
        
        const priceMatch = priceText.match(/\$(\d+)/);
        const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;
        
        return { name, price, description, image };
      });
    });

    const cards = await this.productCards.all();
    return productData.map((data, i) => ({
      ...data,
      element: cards[i]
    }));
  }

  /**
   * Get product names only
   */
  async getProductNames(): Promise<string[]> {
    const cards = await this.getProductCards();
    return cards.map((card) => card.name);
  }

  /**
   * Get count of visible products
   */
  async getProductCount(): Promise<number> {
    await this.waitForProductsToLoad();
    return await this.productCards.count();
  }

  /**
   * Click on a product by name
   */
  async clickProduct(productName: string): Promise<void> {
    const productLink = this.productContainer.locator('.card-title a', { hasText: productName });
    await productLink.click();
    await this.page.waitForURL('**/prod.html**');
    await this.waitForPageLoad();
  }

  /**
   * Click on first product
   */
  async clickFirstProduct(): Promise<string> {
    await this.waitForProductsToLoad();
    const firstProduct = this.productCards.first();
    const productName = await firstProduct.locator('.card-title a').textContent();
    await firstProduct.locator('.card-title a').click();
    await this.page.waitForURL('**/prod.html**');
    await this.waitForPageLoad();
    return productName?.trim() || '';
  }

  /**
   * Check if a specific product is visible
   */
  async isProductVisible(productName: string): Promise<boolean> {
    const productLink = this.productContainer.locator('.card-title a', { hasText: productName });
    return await productLink.isVisible();
  }

  /**
   * Navigate carousel forward
   */
  async nextCarouselSlide(): Promise<void> {
    await this.carouselNext.click();
    await this.page.waitForTimeout(700); // Carousel animation time
  }

  /**
   * Navigate carousel backward
   */
  async prevCarouselSlide(): Promise<void> {
    await this.carouselPrev.click();
    await this.page.waitForTimeout(700); // Carousel animation time
  }

  /**
   * Get all category links
   */
  async getCategoryLinks(): Promise<string[]> {
    const links = await this.categoriesContainer.locator('a#itemc').all();
    const categories: string[] = [];
    for (const link of links) {
      const text = await link.textContent();
      if (text) {
        categories.push(text.trim());
      }
    }
    return categories;
  }

  /**
   * Check if products container is visible
   */
  async isProductContainerVisible(): Promise<boolean> {
    return await this.productContainer.isVisible();
  }

  /**
   * Filter and verify products by category
   */
  async filterByCategory(category: ProductCategory): Promise<ProductCard[]> {
    await this.selectCategory(category);
    return await this.getProductCards();
  }
}

