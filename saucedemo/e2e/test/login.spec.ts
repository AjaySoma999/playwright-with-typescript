import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { getUsers, getLockedOutUsers } from '../utils/testData';

const users = getUsers();
const lockedUsers = getLockedOutUsers();

// Reuse structured JSON user data for login test permutations

for (const user of users) {
  test.describe(`Login Tests for ${user.username}`, () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.navigateToHome();
    });

    test(`Login with ${user.username}`, async () => {
      if (user.expectSuccess) {
        const inventoryPage = await homePage.loginSuccessfully(user.username, user.password);

        // Verify we're on the inventory page
        await expect(inventoryPage.page).toHaveURL(/inventory\.html/);

        // Verify page title
        const pageTitle = await inventoryPage.getPageTitle();
        expect(pageTitle).toBe('Swag Labs');

        // Verify shopping cart is visible
        await expect(inventoryPage.shoppingCartLink).toBeVisible();

        // Verify inventory items are displayed
        const items = await inventoryPage.getInventoryItems();
        expect(items.length).toBeGreaterThan(0);
      } else {
        await homePage.login(user.username, user.password);

        const isErrorVisible = await homePage.isErrorMessageVisible();
        expect(isErrorVisible).toBe(true);

        const errorMessage = await homePage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out');
      }
    });
  });
}