/**
 * CartPage - Handles cart page interactions and checkout
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { OrderInfo, CartItem } from '../types';

export class CartPage extends BasePage {
  // Cart elements
  readonly cartTable: Locator;
  readonly cartTableBody: Locator;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly placeOrderButton: Locator;

  // Order Modal elements
  readonly orderModal: Locator;
  readonly orderName: Locator;
  readonly orderCountry: Locator;
  readonly orderCity: Locator;
  readonly orderCreditCard: Locator;
  readonly orderMonth: Locator;
  readonly orderYear: Locator;
  readonly purchaseButton: Locator;
  readonly orderCloseButton: Locator;
  readonly orderXButton: Locator;

  // Success Modal elements
  readonly successModal: Locator;
  readonly successMessage: Locator;
  readonly successOkButton: Locator;

  constructor(page: Page) {
    super(page);

    // Cart elements
    this.cartTable = page.locator('#tbodyid');
    this.cartTableBody = page.locator('#tbodyid');
    this.cartItems = page.locator('#tbodyid tr');
    this.totalPrice = page.locator('#totalp');
    this.placeOrderButton = page.locator('button[data-target="#orderModal"]');

    // Order Modal
    this.orderModal = page.locator('#orderModal');
    this.orderName = page.locator('#name');
    this.orderCountry = page.locator('#country');
    this.orderCity = page.locator('#city');
    this.orderCreditCard = page.locator('#card');
    this.orderMonth = page.locator('#month');
    this.orderYear = page.locator('#year');
    this.purchaseButton = page.locator('#orderModal button.btn-primary');
    this.orderCloseButton = page.locator('#orderModal button.btn-secondary');
    this.orderXButton = page.locator('#orderModal .close');

    // Success Modal
    this.successModal = page.locator('.sweet-alert');
    this.successMessage = page.locator('.sweet-alert p');
    this.successOkButton = page.locator('.sweet-alert .confirm');
  }

  /**
   * Navigate to cart page
   */
  async gotoCart(): Promise<void> {
    await this.page.goto('https://www.demoblaze.com/cart.html');
    await this.waitForCartLoad();
  }

  /**
   * Wait for cart to load
   */
  async waitForCartLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for cart table to be visible
    await this.cartTable.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If table not visible, continue anyway
    });
    // Small delay for AJAX to complete
    await this.page.waitForTimeout(500);
  }

  /**
   * Get all cart items
   */
  async getCartItems(): Promise<CartItem[]> {
    await this.waitForCartLoad();
    const rows = await this.cartItems.all();
    const items: CartItem[] = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 3) {
        const image = (await cells[0].locator('img').getAttribute('src')) || '';
        const title = (await cells[1].textContent()) || '';
        const priceText = (await cells[2].textContent()) || '0';

        items.push({
          id: (await row.getAttribute('id')) || '',
          title: title.trim(),
          price: parseInt(priceText, 10) || 0,
          image,
        });
      }
    }

    return items;
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    await this.waitForCartLoad();
    const items = await this.cartItems.all();
    return items.length;
  }

  /**
   * Get cart total price
   */
  async getTotalPrice(): Promise<number> {
    await this.waitForCartLoad();
    try {
      const totalText = await this.totalPrice.textContent();
      return parseInt(totalText || '0', 10);
    } catch {
      return 0;
    }
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    await this.waitForCartLoad();
    const count = await this.getCartItemCount();
    return count === 0;
  }

  /**
   * Remove item from cart by title
   */
  async removeItem(itemTitle: string): Promise<void> {
    const rows = await this.cartItems.all();

    for (const row of rows) {
      const titleCell = await row.locator('td').nth(1).textContent();
      if (titleCell && titleCell.trim() === itemTitle) {
        await row.locator('a', { hasText: 'Delete' }).click();
        
        // Wait for deletion to complete
        await this.page.waitForTimeout(1000);
        break;
      }
    }
  }

  /**
   * Remove item at specific index
   */
  async removeItemAtIndex(index: number): Promise<void> {
    const deleteLink = this.cartItems.nth(index).locator('a', { hasText: 'Delete' });
    await deleteLink.click();
    
    // Wait for deletion to complete
    await this.page.waitForTimeout(1000);
  }

  /**
   * Remove all items from cart
   */
  async clearCart(): Promise<void> {
    let count = await this.getCartItemCount();
    
    // Safety limit - only clear reasonable number of items (prevents clearing large carts from other tests)
    const maxItemsToClear = 10;
    if (count > maxItemsToClear) {
      console.warn(`Cart has ${count} items, which exceeds safety limit of ${maxItemsToClear}. Skipping clear.`);
      return;
    }
    
    let maxIterations = count + 2; // Allow a few extra attempts for safety
    let consecutiveFailures = 0;
    
    while (count > 0 && maxIterations > 0) {
      const countBefore = await this.getCartItemCount();
      await this.removeItemAtIndex(0);
      await this.waitForCartLoad();
      const countAfter = await this.getCartItemCount();
      
      // Safety check - if count didn't decrease, increment failure counter
      if (countAfter >= countBefore) {
        consecutiveFailures++;
        if (consecutiveFailures >= 2) {
          console.warn(`Cart clear stalled at ${countAfter} items after ${consecutiveFailures} attempts`);
          break;
        }
      } else {
        consecutiveFailures = 0; // Reset on success
      }
      
      count = countAfter;
      maxIterations--;
    }
    
    // Final verification
    const finalCount = await this.getCartItemCount();
    if (finalCount > 0) {
      console.warn(`Cart clear incomplete. ${finalCount} items remaining.`);
    }
  }

  /**
   * Open order modal
   */
  async openOrderModal(): Promise<void> {
    await this.placeOrderButton.click();
    await this.orderModal.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(300); // Wait for modal animation
  }

  /**
   * Close order modal
   */
  async closeOrderModal(): Promise<void> {
    await this.orderCloseButton.click();
    await this.orderModal.waitFor({ state: 'hidden' });
  }

  /**
   * Fill order form
   */
  async fillOrderForm(orderInfo: OrderInfo): Promise<void> {
    await this.orderName.fill(orderInfo.name);
    await this.orderCountry.fill(orderInfo.country);
    await this.orderCity.fill(orderInfo.city);
    await this.orderCreditCard.fill(orderInfo.creditCard);
    await this.orderMonth.fill(orderInfo.month);
    await this.orderYear.fill(orderInfo.year);
  }

  /**
   * Complete purchase with order info
   * Returns alert message if validation fails, or success message
   */
  async placeOrder(orderInfo: OrderInfo): Promise<{ success: boolean; message: string }> {
    await this.openOrderModal();
    await this.fillOrderForm(orderInfo);

    // Setup alert listener BEFORE clicking to prevent race condition
    let alertMessage: string | null = null;
    const alertHandler = (dialog: import('playwright').Dialog) => {
      alertMessage = dialog.message();
      dialog.accept();
    };
    this.page.on('dialog', alertHandler);
    
    // Small delay to ensure listener is registered
    await this.page.waitForTimeout(50);

    await this.purchaseButton.click();

    // Wait for either success modal or alert with timeout
    const result = await Promise.race([
      this.successModal.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'success'),
      this.page.waitForTimeout(6000).then(() => 'timeout'),
    ]).catch(() => 'timeout');

    this.page.off('dialog', alertHandler);

    if (alertMessage) {
      return { success: false, message: alertMessage };
    }

    if (result === 'success') {
      const message = (await this.successMessage.textContent()) || 'Order placed successfully';
      return { success: true, message };
    }

    return { success: false, message: 'Order timeout - no response received' };
  }

  /**
   * Close success modal
   */
  async closeSuccessModal(): Promise<void> {
    await this.successOkButton.click();
    await this.successModal.waitFor({ state: 'hidden' });
  }

  /**
   * Complete full checkout flow
   */
  async checkout(orderInfo: OrderInfo): Promise<boolean> {
    const result = await this.placeOrder(orderInfo);
    if (result.success) {
      await this.closeSuccessModal();
      return true;
    }
    return false;
  }

  /**
   * Check if order modal is visible
   */
  async isOrderModalVisible(): Promise<boolean> {
    return await this.orderModal.isVisible();
  }

  /**
   * Check if success modal is visible
   */
  async isSuccessModalVisible(): Promise<boolean> {
    return await this.successModal.isVisible();
  }

  /**
   * Get success modal content
   */
  async getSuccessModalContent(): Promise<string> {
    return (await this.successMessage.textContent()) || '';
  }

  /**
   * Verify item exists in cart
   */
  async hasItem(itemTitle: string): Promise<boolean> {
    const items = await this.getCartItems();
    const normalizedTitle = itemTitle.toLowerCase().trim();
    return items.some((item) => item.title.toLowerCase().trim() === normalizedTitle);
  }

  /**
   * Get total calculated from items
   */
  async calculateExpectedTotal(): Promise<number> {
    const items = await this.getCartItems();
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  /**
   * Verify total matches sum of items
   */
  async verifyTotalAccuracy(): Promise<boolean> {
    const displayedTotal = await this.getTotalPrice();
    const calculatedTotal = await this.calculateExpectedTotal();
    return displayedTotal === calculatedTotal;
  }
}

