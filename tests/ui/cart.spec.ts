/**
 * Cart Feature Tests
 *
 * Test scenarios covering:
 * - Add single/multiple items
 * - Remove items from cart
 * - Cart persistence
 * - Total price calculation
 * - Place order flow
 */

import { test, expect } from "../../src/fixtures";
import { OrderInfo } from "../../src/types";

// Default order info for checkout tests
const validOrderInfo: OrderInfo = {
  name: "Test User",
  country: "United States",
  city: "New York",
  creditCard: "4111111111111111",
  month: "12",
  year: "2025",
};

test.describe("Cart Feature", () => {
  test.describe("Add to Cart", () => {
    test("should add single product to cart", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Get first product details
      const products = await homePage.getProductCards();
      const productToAdd = products[0];

      // Navigate to product and add to cart
      await homePage.clickProduct(productToAdd.name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify product is in cart
      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].title).toBe(productToAdd.name);
      expect(cartItems[0].price).toBe(productToAdd.price);
    });

    test("should add multiple different products to cart", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Get two different products
      const products = await homePage.getProductCards();
      const product1 = products[0];
      const product2 = products[1];

      // Add first product
      await homePage.clickProduct(product1.name);
      await productPage.addToCart();

      // Go back and add second product
      await productPage.goHome();
      await homePage.waitForProductsToLoad();
      await homePage.clickProduct(product2.name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify both products are in cart
      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(2);

      const cartItemNames = cartItems.map((item) => item.title);
      expect(cartItemNames).toContain(product1.name);
      expect(cartItemNames).toContain(product2.name);
    });

    test("should add same product multiple times", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Get first product
      const products = await homePage.getProductCards();
      const productToAdd = products[0];

      // Navigate to product
      await homePage.clickProduct(productToAdd.name);

      // Add to cart twice
      await productPage.addToCart();
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify product appears twice (or quantity is 2)
      const cartItems = await cartPage.getCartItems();
      const matchingItems = cartItems.filter(
        (item) => item.title === productToAdd.name
      );
      expect(matchingItems.length).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("Remove from Cart", () => {
    test("should remove item from cart", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      const products = await homePage.getProductCards();
      await homePage.clickProduct(products[0].name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify item is in cart
      let itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);

      // Remove item
      await cartPage.removeItem(products[0].name);

      // Verify cart is empty
      await cartPage.waitForCartLoad();
      itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });

    test("should remove all items from cart", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add multiple products
      const products = await homePage.getProductCards();

      await homePage.clickProduct(products[0].name);
      await productPage.addToCart();
      await productPage.goHome();

      await homePage.clickProduct(products[1].name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify items are in cart
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);

      // Clear cart
      await cartPage.clearCart();

      // Verify cart is empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(true);
    });

    test("should update total after removing item", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add two products
      const products = await homePage.getProductCards();
      const product1 = products[0];
      const product2 = products[1];

      await homePage.clickProduct(product1.name);
      await productPage.addToCart();
      await productPage.goHome();

      await homePage.clickProduct(product2.name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Get initial total
      const initialTotal = await cartPage.getTotalPrice();
      expect(initialTotal).toBe(product1.price + product2.price);

      // Remove first item
      await cartPage.removeItem(product1.name);
      await cartPage.waitForCartLoad();

      // Verify total updated
      const newTotal = await cartPage.getTotalPrice();
      expect(newTotal).toBe(product2.price);
    });
  });

  test.describe("Cart Total Calculation", () => {
    test("should display correct total for single item", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product with known price
      const products = await homePage.getProductCards();
      const productToAdd = products[0];

      await homePage.clickProduct(productToAdd.name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify total matches product price
      const total = await cartPage.getTotalPrice();
      expect(total).toBe(productToAdd.price);
    });

    test("should calculate correct total for multiple items", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add multiple products
      const products = await homePage.getProductCards();
      const product1 = products[0];
      const product2 = products[1];

      await homePage.clickProduct(product1.name);
      await productPage.addToCart();
      await productPage.goHome();

      await homePage.clickProduct(product2.name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify total is sum of prices
      const total = await cartPage.getTotalPrice();
      const expectedTotal = product1.price + product2.price;
      expect(total).toBe(expectedTotal);
    });

    test("should verify total accuracy matches item sum", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add a few products
      const products = await homePage.getProductCards();

      for (let i = 0; i < Math.min(3, products.length); i++) {
        await homePage.clickProduct(products[i].name);
        await productPage.addToCart();
        await productPage.goHome();
        await homePage.waitForProductsToLoad();
      }

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify total accuracy
      const isAccurate = await cartPage.verifyTotalAccuracy();
      expect(isAccurate).toBe(true);
    });
  });

  test.describe("Cart Persistence", () => {
    test("should persist cart after page refresh", async ({
      homePage,
      productPage,
      cartPage,
      page,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      const products = await homePage.getProductCards();
      const productToAdd = products[0];

      await homePage.clickProduct(productToAdd.name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify item is in cart
      let hasItem = await cartPage.hasItem(productToAdd.name);
      expect(hasItem).toBe(true);

      // Refresh page
      await page.reload();
      await cartPage.waitForCartLoad();

      // Verify item is still in cart
      hasItem = await cartPage.hasItem(productToAdd.name);
      expect(hasItem).toBe(true);
    });

    test("should maintain cart when navigating away and back", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      const products = await homePage.getProductCards();
      const productToAdd = products[0];

      await homePage.clickProduct(productToAdd.name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Navigate away
      await cartPage.goHome();
      await homePage.waitForProductsToLoad();

      // Navigate back to cart
      await homePage.goToCart();
      await cartPage.waitForCartLoad();

      // Verify item is still there
      const hasItem = await cartPage.hasItem(productToAdd.name);
      expect(hasItem).toBe(true);
    });
  });

  test.describe("Place Order", () => {
    test("should complete order with valid information", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      await homePage.clickFirstProduct();
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Place order
      const result = await cartPage.placeOrder(validOrderInfo);

      // Verify order was successful
      expect(result.success).toBe(true);
      expect(result.message).toBeTruthy();
    });

    test("should show confirmation with order details", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      const products = await homePage.getProductCards();
      await homePage.clickProduct(products[0].name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify cart has items before ordering
      const total = await cartPage.getTotalPrice();
      expect(total).toBeGreaterThan(0);

      // Place order
      const result = await cartPage.placeOrder(validOrderInfo);

      // Verify success modal content
      expect(result.success).toBe(true);

      // Close modal
      await cartPage.closeSuccessModal();

      // Verify returned to homepage
      const currentUrl = cartPage.getCurrentUrl();
      expect(currentUrl).toContain("demoblaze.com");
    });

    test("should reject order with missing name", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      await homePage.clickFirstProduct();
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Try to place order without name
      const invalidOrder: OrderInfo = {
        ...validOrderInfo,
        name: "",
      };

      const result = await cartPage.placeOrder(invalidOrder);

      // Should fail with validation message
      expect(result.success).toBe(false);
      expect(result.message).toContain("fill out Name and Creditcard");
    });

    test("should reject order with missing credit card", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      await homePage.clickFirstProduct();
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Try to place order without credit card
      const invalidOrder: OrderInfo = {
        ...validOrderInfo,
        creditCard: "",
      };

      const result = await cartPage.placeOrder(invalidOrder);

      // Should fail with validation message
      expect(result.success).toBe(false);
      expect(result.message).toContain("fill out Name and Creditcard");
    });

    test("should close order modal without purchasing", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      await homePage.clickFirstProduct();
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Get initial cart count
      const initialCount = await cartPage.getCartItemCount();

      // Open order modal
      await cartPage.openOrderModal();

      // Close without purchasing
      await cartPage.closeOrderModal();

      // Verify cart is unchanged
      const finalCount = await cartPage.getCartItemCount();
      expect(finalCount).toBe(initialCount);
    });
  });

  test.describe("Empty Cart Scenarios", () => {
    test("should handle empty cart state correctly", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Add one item to cart first
      await homePage.gotoHomepage();
      await homePage.clickFirstProduct();
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Clear the cart
      await cartPage.clearCart();

      // Verify cart is now empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(true);

      // Verify total is 0
      const total = await cartPage.getTotalPrice();
      expect(total).toBe(0);
    });

    test("should show Place Order button on cart page", async ({
      cartPage,
    }) => {
      await cartPage.gotoCart();

      // Place Order button should be visible regardless of cart state
      await expect(cartPage.placeOrderButton).toBeVisible();
    });
  });

  test.describe("Cart Navigation", () => {
    test("should navigate to cart from navigation bar", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product first
      await homePage.clickFirstProduct();
      await productPage.addToCart();

      // Navigate to cart using nav bar
      await productPage.goToCart();

      // Verify we're on cart page
      const currentUrl = cartPage.getCurrentUrl();
      expect(currentUrl).toContain("cart.html");
    });

    test("should be able to access cart from any page", async ({
      homePage,
      productPage,
    }) => {
      await homePage.gotoHomepage();

      // Navigate to product page
      await homePage.clickFirstProduct();

      // Click cart from product page
      await productPage.goToCart();

      // Verify cart page loaded
      const currentUrl = productPage.getCurrentUrl();
      expect(currentUrl).toContain("cart.html");
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle special characters in order form", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add product to cart
      await homePage.clickFirstProduct();
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Place order with special characters
      const orderWithSpecialChars: OrderInfo = {
        name: "José O'Brien",
        country: "México",
        city: "São Paulo",
        creditCard: "4111111111111111",
        month: "12",
        year: "2025",
      };

      const result = await cartPage.placeOrder(orderWithSpecialChars);

      // Should handle gracefully
      expect(result.success).toBe(true);
    });

    test("should handle adding products from different categories to cart", async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add phone
      await homePage.selectCategory("phone");
      const phones = await homePage.getProductCards();
      await homePage.clickProduct(phones[0].name);
      await productPage.addToCart();
      await productPage.goHome();

      // Add laptop
      await homePage.selectCategory("notebook");
      const laptops = await homePage.getProductCards();
      await homePage.clickProduct(laptops[0].name);
      await productPage.addToCart();
      await productPage.goHome();

      // Add monitor
      await homePage.selectCategory("monitor");
      const monitors = await homePage.getProductCards();
      await homePage.clickProduct(monitors[0].name);
      await productPage.addToCart();

      // Navigate to cart
      await cartPage.gotoCart();

      // Verify all three items are in cart
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(3);

      // Verify total is sum of all three
      const isAccurate = await cartPage.verifyTotalAccuracy();
      expect(isAccurate).toBe(true);
    });
  });
});
