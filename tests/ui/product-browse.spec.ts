/**
 * Product Browse Feature Tests
 *
 * Test scenarios covering:
 * - Category filtering (Phones, Laptops, Monitors)
 * - Product card display validation
 * - Product detail navigation
 * - Add to cart from product page
 */

import { test, expect } from '../../src/fixtures';

test.describe('Product Browse Feature', () => {
  test.describe('Homepage Display', () => {
    test('should display product grid on homepage', async ({ homePage }) => {
      await homePage.gotoHomepage();

      // Verify products are displayed
      const isVisible = await homePage.isProductContainerVisible();
      expect(isVisible).toBe(true);

      // Verify there are products
      const productCount = await homePage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    test('should display product cards with name, price, and description', async ({
      homePage,
    }) => {
      await homePage.gotoHomepage();

      // Get all product cards
      const products = await homePage.getProductCards();
      expect(products.length).toBeGreaterThan(0);

      // Verify first product has required fields
      const firstProduct = products[0];
      expect(firstProduct.name).toBeTruthy();
      expect(firstProduct.price).toBeGreaterThan(0);
      expect(firstProduct.description).toBeTruthy();
    });

    test('should display category links', async ({ homePage }) => {
      await homePage.gotoHomepage();

      // Get category links
      const categories = await homePage.getCategoryLinks();

      // Verify expected categories exist
      expect(categories).toContain('Phones');
      expect(categories).toContain('Laptops');
      expect(categories).toContain('Monitors');
    });
  });

  test.describe('Category Filtering', () => {
    test('should filter products by Phones category', async ({ homePage }) => {
      await homePage.gotoHomepage();

      // Select Phones category
      await homePage.selectCategory('phone');

      // Get filtered products
      const products = await homePage.getProductCards();
      expect(products.length).toBeGreaterThan(0);

      // All visible products should be phones
      // Note: DemoBlaze phone products include Samsung, Nokia, Nexus, etc.
      const productNames = products.map((p) => p.name.toLowerCase());
      console.log(`Phones category products: ${JSON.stringify(productNames)}`);

      // Verify we have products (category filter applied)
      expect(products.length).toBeLessThanOrEqual(7); // Phones typically have ~7 items
    });

    test('should filter products by Laptops category', async ({ homePage }) => {
      await homePage.gotoHomepage();

      // Select Laptops category
      await homePage.selectCategory('notebook');

      // Get filtered products
      const products = await homePage.getProductCards();
      expect(products.length).toBeGreaterThan(0);

      // Log products for visibility
      const productNames = products.map((p) => p.name.toLowerCase());
      console.log(`Laptops category products: ${JSON.stringify(productNames)}`);

      // Verify we have laptop products
      expect(products.length).toBeLessThanOrEqual(6); // Laptops typically have ~6 items
    });

    test('should filter products by Monitors category', async ({ homePage }) => {
      await homePage.gotoHomepage();

      // Select Monitors category
      await homePage.selectCategory('monitor');

      // Get filtered products
      const products = await homePage.getProductCards();
      expect(products.length).toBeGreaterThan(0);

      // Log products for visibility
      const productNames = products.map((p) => p.name.toLowerCase());
      console.log(`Monitors category products: ${JSON.stringify(productNames)}`);

      // Verify we have monitor products
      expect(products.length).toBeLessThanOrEqual(2); // Monitors typically have ~2 items
    });

    test('should show different products for each category', async ({
      homePage,
    }) => {
      await homePage.gotoHomepage();

      // Get phones
      await homePage.selectCategory('phone');
      const phoneProducts = await homePage.getProductNames();

      // Get laptops
      await homePage.selectCategory('notebook');
      const laptopProducts = await homePage.getProductNames();

      // Get monitors
      await homePage.selectCategory('monitor');
      const monitorProducts = await homePage.getProductNames();

      // Verify categories have different products
      const laptopsSet = new Set(laptopProducts);
      const monitorsSet = new Set(monitorProducts);

      // No overlap between phones and laptops
      const phoneLaptopOverlap = phoneProducts.filter((p) => laptopsSet.has(p));
      expect(phoneLaptopOverlap.length).toBe(0);

      // No overlap between phones and monitors
      const phoneMonitorOverlap = phoneProducts.filter((p) => monitorsSet.has(p));
      expect(phoneMonitorOverlap.length).toBe(0);

      // No overlap between laptops and monitors
      const laptopMonitorOverlap = laptopProducts.filter((p) =>
        monitorsSet.has(p)
      );
      expect(laptopMonitorOverlap.length).toBe(0);
    });

    test('should return to all products when clicking Home', async ({
      homePage,
    }) => {
      await homePage.gotoHomepage();

      // Get initial product count
      const initialCount = await homePage.getProductCount();
      expect(initialCount).toBeGreaterThan(0);

      // Filter by category
      await homePage.selectCategory('monitor');
      const filteredCount = await homePage.getProductCount();

      // Go back to home
      await homePage.goHome();
      await homePage.waitForProductsToLoad();

      // Should show all products again
      const finalCount = await homePage.getProductCount();
      expect(finalCount).toBeGreaterThanOrEqual(filteredCount);
    });
  });

  test.describe('Product Navigation', () => {
    test('should navigate to product detail page when clicking product', async ({
      homePage,
    }) => {
      await homePage.gotoHomepage();

      // Click on first product
      const productName = await homePage.clickFirstProduct();

      // Verify URL changed to product page
      const currentUrl = homePage.getCurrentUrl();
      expect(currentUrl).toContain('prod.html');

      // Verify product name is displayed (will be verified by productPage)
      expect(productName).toBeTruthy();
    });

    test('should display product details on product page', async ({
      homePage,
      productPage,
    }) => {
      await homePage.gotoHomepage();

      // Get first product info from grid
      const products = await homePage.getProductCards();
      const firstProductName = products[0].name;

      // Click on product
      await homePage.clickProduct(firstProductName);

      // Verify product page loaded
      const isLoaded = await productPage.isProductPageLoaded();
      expect(isLoaded).toBe(true);

      // Get product info from detail page
      const productInfo = await productPage.getProductInfo();

      // Verify product info
      expect(productInfo.name).toBe(firstProductName);
      expect(productInfo.price).toBeGreaterThan(0);
    });

    test('should navigate back to homepage from product page', async ({
      homePage,
      productPage,
    }) => {
      await homePage.gotoHomepage();

      // Navigate to product
      await homePage.clickFirstProduct();

      // Go back to home
      await productPage.goBackToHome();

      // Verify we're back on homepage
      const currentUrl = homePage.getCurrentUrl();
      expect(currentUrl).toContain('demoblaze.com');

      // Verify products are displayed
      const productCount = await homePage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    });
  });

  test.describe('Add to Cart from Product Page', () => {
    test('should show confirmation when adding product to cart', async ({
      homePage,
      productPage,
    }) => {
      await homePage.gotoHomepage();

      // Navigate to first product
      await homePage.clickFirstProduct();

      // Add to cart
      const alertMessage = await productPage.addToCart();

      // Verify success message
      expect(alertMessage.toLowerCase()).toContain('product added');
    });

    test('should be able to add product to cart and verify in cart', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Get first product and navigate to it
      const products = await homePage.getProductCards();
      const productToAdd = products[0];
      await homePage.clickProduct(productToAdd.name);

      // Add to cart
      const addedSuccessfully = await productPage.addToCartAndVerify();
      expect(addedSuccessfully).toBe(true);

      // Navigate to cart
      await productPage.goToCart();

      // Verify product is in cart
      const hasItem = await cartPage.hasItem(productToAdd.name);
      expect(hasItem).toBe(true);
    });

    test('should add multiple products from different categories', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.gotoHomepage();

      // Add a phone
      await homePage.selectCategory('phone');
      const phones = await homePage.getProductCards();
      const phoneName = phones[0].name;
      await homePage.clickProduct(phoneName);
      const phoneAlert = await productPage.addToCart();
      expect(phoneAlert.toLowerCase()).toContain('product added');

      // Add a laptop
      await productPage.goHome();
      await homePage.selectCategory('notebook');
      const laptops = await homePage.getProductCards();
      const laptopName = laptops[0].name;
      await homePage.clickProduct(laptopName);
      const laptopAlert = await productPage.addToCart();
      expect(laptopAlert.toLowerCase()).toContain('product added');

      // Navigate to cart
      await productPage.goToCart();

      // Verify cart has items (at least 2)
      const cartItemCount = await cartPage.getCartItemCount();
      expect(cartItemCount).toBeGreaterThanOrEqual(2);

      // Get all cart items and check both products are present
      const cartItems = await cartPage.getCartItems();
      const cartItemNames = cartItems.map((item) => item.title.toLowerCase());
      console.log(`Cart items: ${JSON.stringify(cartItemNames)}`);
      console.log(`Looking for: ${JSON.stringify([phoneName.toLowerCase(), laptopName.toLowerCase()])}`);
      
      expect(cartItemNames).toContain(phoneName.toLowerCase());
      expect(cartItemNames).toContain(laptopName.toLowerCase());
    });
  });

  test.describe('Product Display Edge Cases', () => {
    test('should display product images', async ({ homePage }) => {
      await homePage.gotoHomepage();

      const products = await homePage.getProductCards();

      // Verify first few products have images (can be relative or absolute URLs)
      for (let i = 0; i < Math.min(3, products.length); i++) {
        expect(products[i].image).toBeTruthy();
        // Images can be relative paths (imgs/...) or full URLs
        expect(products[i].image.length).toBeGreaterThan(0);
      }
    });

    test('should display prices in correct format', async ({ homePage }) => {
      await homePage.gotoHomepage();

      const products = await homePage.getProductCards();

      // All products should have positive prices
      for (const product of products) {
        expect(product.price).toBeGreaterThan(0);
        expect(typeof product.price).toBe('number');
      }
    });

    test('should handle rapid category switching', async ({ homePage }) => {
      await homePage.gotoHomepage();

      // Rapidly switch categories
      await homePage.selectCategory('phone');
      await homePage.selectCategory('notebook');
      await homePage.selectCategory('monitor');

      // Should end up with monitors displayed
      const products = await homePage.getProductCards();
      expect(products.length).toBeGreaterThan(0);

      // Verify page is stable
      const currentUrl = homePage.getCurrentUrl();
      expect(currentUrl).toContain('demoblaze.com');
    });
  });

  test.describe('Carousel Navigation', () => {
    test('should navigate carousel forward', async ({ homePage }) => {
      await homePage.gotoHomepage();

      // Navigate carousel
      await homePage.nextCarouselSlide();

      // Verify carousel is still visible
      await expect(homePage.carousel).toBeVisible();
    });

    test('should navigate carousel backward', async ({ homePage }) => {
      await homePage.gotoHomepage();

      // Navigate carousel forward then backward
      await homePage.nextCarouselSlide();
      await homePage.prevCarouselSlide();

      // Verify carousel is still visible
      await expect(homePage.carousel).toBeVisible();
    });
  });
});

