import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { getUsers, getLockedOutUsers, getCheckoutData } from '../utils/testData';

const users = getUsers();
const lockedUsers = getLockedOutUsers();
const checkoutData = getCheckoutData();

// Data-driven login checks for expected statuses
for (const user of users) {
  test(`Data driven login: ${user.username}`, async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateToHome();

    if (user.expectSuccess) {
      const inventoryPage = await homePage.loginSuccessfully(user.username, user.password);
      await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
      const items = await inventoryPage.getInventoryItems();
      expect(items.length).toBeGreaterThan(0);
    } else {
      await homePage.login(user.username, user.password);
      expect(await homePage.isErrorMessageVisible()).toBe(true);
      expect(await homePage.getErrorMessage()).toContain('Epic sadface');
    }
  });
}

// Negative regression for locked out users in one shot
test.describe('Locked-out users regression', () => {
  for (const user of lockedUsers) {
    test(`should show lockout message for ${user.username}`, async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigateToHome();
      await homePage.login(user.username, user.password);
      expect(await homePage.isErrorMessageVisible()).toBe(true);
      expect(await homePage.getErrorMessage()).toContain('locked out');
    });
  }
});

// Checkout data coverage using customer payload
test('Data driven checkout user flow with first checkout profile', async ({ page }) => {
  const user = users.find((u) => u.expectSuccess);
  test.skip(!user, 'No successful user configured');

  const homePage = new HomePage(page);
  await homePage.navigateToHome();
  const inventoryPage = await homePage.loginSuccessfully(user!.username, user!.password);
  await inventoryPage.addItemToCart(checkoutData.cartItems[0]);
  await inventoryPage.goToCart();

  const cartPage = new CartPage(inventoryPage.page);
  await cartPage.proceedToCheckout();

  const checkoutPage = new CheckoutPage(cartPage.page);
  const customer = checkoutData.customerInfo[0];
  await checkoutPage.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
  await checkoutPage.continueCheckout();

  const summary = await checkoutPage.getOrderSummary();
  expect(summary.total).toBeTruthy();
});
