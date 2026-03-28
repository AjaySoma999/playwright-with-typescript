import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { getValidUsers } from '../utils/testData';

const validUsers = getValidUsers();

for (const user of validUsers) {
  test.describe(`Cart Tests for ${user}`, () => {
    let homePage: HomePage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.navigateToHome();
      inventoryPage = await homePage.loginSuccessfully(user, 'secret_sauce');
    });

    test('Add single item to cart', async () => {
      // Add Sauce Labs Backpack to cart
      await inventoryPage.addItemToCart('sauce-labs-backpack');

      // Verify cart badge shows 1
      const badgeCount = await inventoryPage.getCartBadgeCount();
      expect(badgeCount).toBe('1');

      // Go to cart
      await inventoryPage.goToCart();
      cartPage = new CartPage(inventoryPage.page);

      // Verify item is in cart
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);

      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames).toContain('Sauce Labs Backpack');
    });

    test('Add multiple items to cart with specific quantities', async () => {
      // Add multiple distinct items
      await inventoryPage.addItemToCart('sauce-labs-backpack');
      await inventoryPage.addItemToCart('sauce-labs-bike-light');

      // Verify cart badge shows 2
      const badgeCount = await inventoryPage.getCartBadgeCount();
      expect(badgeCount).toBe('2');

      // Go to cart
      await inventoryPage.goToCart();
      cartPage = new CartPage(inventoryPage.page);

      // Verify all items are in cart with default quantity 1
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);

      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames).toContain('Sauce Labs Backpack');
      expect(itemNames).toContain('Sauce Labs Bike Light');

      expect(await cartPage.getItemQuantity('Sauce Labs Backpack')).toBe(1);
      expect(await cartPage.getItemQuantity('Sauce Labs Bike Light')).toBe(1);
    });

    test('Remove item from cart', async () => {
      // Add item to cart
      await inventoryPage.addItemToCart('sauce-labs-backpack');
      expect(await inventoryPage.getCartBadgeCount()).toBe('1');

      // Go to cart
      await inventoryPage.goToCart();
      cartPage = new CartPage(inventoryPage.page);

      // Remove item from cart
      await cartPage.removeItem('sauce-labs-backpack');

      // Verify cart is empty
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });

    test('Continue shopping from cart', async () => {
      // Add item to cart
      await inventoryPage.addItemToCart('sauce-labs-backpack');

      // Go to cart
      await inventoryPage.goToCart();
      cartPage = new CartPage(inventoryPage.page);

      // Continue shopping
      await cartPage.continueShopping();

      // Verify we're back on inventory page
      await expect(cartPage.page).toHaveURL(/inventory\.html/);
    });

    test('View item details', async () => {
      // Click on item name to view details
      await inventoryPage.viewItemDetails('Sauce Labs Backpack');

      // Verify on item page
      await expect(inventoryPage.page).toHaveURL(/inventory-item\.html/);

      // Verify item details are displayed
      const title = (await inventoryPage.page.locator('.inventory_details_name').textContent())?.trim();
      const expectedTitle = user === 'problem_user' ? 'Sauce Labs Fleece Jacket' : 'Sauce Labs Backpack';
      expect(title).toBe(expectedTitle);
    });

    test('Sort products by name A to Z', async () => {
      // Skip known problem/error users where app sort is intentionally broken in Sauce Demo
      test.skip(['problem_user', 'error_user'].includes(user), 'Known sorting issue for this user');

      await inventoryPage.sortItems('az');
      const items = await inventoryPage.getInventoryItems();
      const sortedItems = [...items].sort();
      expect(items).toEqual(sortedItems);
    });

    test('Sort products by name Z to A', async () => {
      test.skip(['problem_user', 'error_user'].includes(user), 'Known sorting issue for this user');

      await inventoryPage.sortItems('za');
      const items = await inventoryPage.getInventoryItems();
      const sortedItems = [...items].sort().reverse();
      expect(items).toEqual(sortedItems);
    });

    test('Sort products by price low to high', async () => {
      test.skip(['problem_user', 'error_user', 'visual_user'].includes(user), 'Known sorting issue for this user (intentional app defect)');

      await inventoryPage.sortItems('lohi');
      const prices = await inventoryPage.getInventoryItemPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    });

    test('Sort products by price high to low', async () => {
      test.skip(['problem_user', 'error_user', 'visual_user'].includes(user), 'Known sorting issue for this user (intentional app defect)');

      await inventoryPage.sortItems('hilo');
      const prices = await inventoryPage.getInventoryItemPrices();
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sortedPrices);
    });

  });
}
