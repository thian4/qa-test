/**
 * E2E Purchase Flow Tests
 *
 * Complete end-to-end scenarios covering:
 * - Full purchase journey as authenticated user
 * - Guest purchase flow
 * - Multi-product purchase
 */

import { test, expect } from "../../src/fixtures";
import { OrderInfo } from "../../src/types";

const testOrderInfo: OrderInfo = {
  name: "E2E Test User",
  country: "United States",
  city: "San Francisco",
  creditCard: "4111111111111111",
  month: "06",
  year: "2026",
};

test.describe("E2E Purchase Flow", () => {
  test("complete purchase flow as authenticated user", async ({
    authenticatedPage,
    cartPage,
  }) => {
    const { page, user } = authenticatedPage;

    // Step 1: Verify logged in
    const isLoggedIn = await page.isLoggedIn();
    expect(isLoggedIn).toBe(true);
    console.log(`Logged in as: ${JSON.stringify(user.username)}`);

    // Step 2: Browse products by category
    await page.goHome();

    // Select phones category
    await page.page.click('a#itemc:has-text("Phones")');
    await page.page.waitForTimeout(1000);

    // Step 3: Select a product
    const productLink = page.page.locator("#tbodyid .card-title a").first();
    const productName = await productLink.textContent();
    console.log(`Selecting product: ${JSON.stringify(productName)}`);
    await productLink.click();
    await page.page.waitForURL("**/prod.html**");

    // Step 4: Add to cart
    const alertPromise = page.setupAlertListener();
    await page.page.click('a.btn-success:has-text("Add to cart")');
    const alertMessage = await alertPromise;
    expect(alertMessage.toLowerCase()).toContain("product added");

    // Step 5: Navigate to cart
    await page.goToCart();

    // Step 6: Verify product in cart
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBeGreaterThan(0);
    console.log(`Cart items: ${JSON.stringify(cartItems.map((i) => i.title))}`);

    // Step 7: Place order
    const result = await cartPage.placeOrder(testOrderInfo);
    expect(result.success).toBe(true);
    console.log(`Order result: ${JSON.stringify(result)}`);

    // Step 8: Close confirmation and verify return to homepage
    await cartPage.closeSuccessModal();

    // Verify we're back on main page
    const currentUrl = cartPage.getCurrentUrl();
    expect(currentUrl).toContain("demoblaze.com");
  });

  test("complete multi-product purchase from different categories", async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.gotoHomepage();

    // Add products from each category
    const productsAdded: string[] = [];

    // Add a phone
    await homePage.selectCategory("phone");
    let products = await homePage.getProductCards();
    await homePage.clickProduct(products[0].name);
    await productPage.addToCart();
    productsAdded.push(products[0].name);
    console.log(`Added phone: ${JSON.stringify(products[0].name)}`);

    // Add a laptop
    await productPage.goHome();
    await homePage.selectCategory("notebook");
    products = await homePage.getProductCards();
    await homePage.clickProduct(products[0].name);
    await productPage.addToCart();
    productsAdded.push(products[0].name);
    console.log(`Added laptop: ${JSON.stringify(products[0].name)}`);

    // Add a monitor
    await productPage.goHome();
    await homePage.selectCategory("monitor");
    products = await homePage.getProductCards();
    await homePage.clickProduct(products[0].name);
    await productPage.addToCart();
    productsAdded.push(products[0].name);
    console.log(`Added monitor: ${JSON.stringify(products[0].name)}`);

    // Navigate to cart
    await cartPage.gotoCart();

    // Verify all products are in cart
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(3);
    console.log(`Cart total items: ${JSON.stringify(cartItems.length)}`);

    // Verify total calculation
    const isAccurate = await cartPage.verifyTotalAccuracy();
    expect(isAccurate).toBe(true);

    const total = await cartPage.getTotalPrice();
    console.log(`Cart total: ${JSON.stringify(total)}`);

    // Complete purchase
    const result = await cartPage.placeOrder(testOrderInfo);
    expect(result.success).toBe(true);

    // Close confirmation
    await cartPage.closeSuccessModal();
  });

  test("browse, add, remove, and purchase flow", async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.gotoHomepage();

    // Add multiple products
    const products = await homePage.getProductCards();

    // Add first two products
    await homePage.clickProduct(products[0].name);
    await productPage.addToCart();
    await productPage.goHome();

    await homePage.clickProduct(products[1].name);
    await productPage.addToCart();
    await productPage.goHome();

    await homePage.clickProduct(products[2].name);
    await productPage.addToCart();

    // Navigate to cart
    await cartPage.gotoCart();

    // Verify 3 items in cart
    let itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(3);

    // Remove one item
    await cartPage.removeItem(products[1].name);
    await cartPage.waitForCartLoad();

    // Verify 2 items remain
    itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);

    // Complete purchase with remaining items
    const result = await cartPage.placeOrder(testOrderInfo);
    expect(result.success).toBe(true);

    await cartPage.closeSuccessModal();
  });
});
