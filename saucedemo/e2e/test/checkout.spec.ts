import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { getValidUsers, getCheckoutData } from '../utils/testData';

const validUsers = getValidUsers();
const checkoutData = getCheckoutData();

// Filter out known defective users for checkout: problem_user and error_user
const checkoutEnabledUsers = validUsers.filter((u) => !['problem_user', 'error_user'].includes(u));

for (const user of checkoutEnabledUsers) {
  test.describe(`Checkout and Order Tests for ${user}`, () => {
    let homePage: HomePage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.navigateToHome();
      inventoryPage = await homePage.loginSuccessfully(user, 'secret_sauce');
    });

    for (const customer of checkoutData.customerInfo) {
      test(`Complete order flow - ${customer.firstName} ${customer.lastName}`, async () => {
        // Add item to cart
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.goToCart();

        cartPage = new CartPage(inventoryPage.page);
        await cartPage.proceedToCheckout();

        checkoutPage = new CheckoutPage(cartPage.page);

        // Fill customer information from data-driven input
        await checkoutPage.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
        await checkoutPage.continueCheckout();

        // Verify order summary page
        await expect(checkoutPage.page).toHaveURL(/checkout-step-two\.html/);

        // Get order summary
        const summary = await checkoutPage.getOrderSummary();
        expect(summary.itemTotal).toContain('$29.99');
        expect(summary.tax).toBeTruthy();
        expect(summary.total).toBeTruthy();

        // Complete order
        await checkoutPage.finishOrder();

        // Verify order completion
        await expect(checkoutPage.page).toHaveURL(/checkout-complete\.html/);
        const completeMessage = await checkoutPage.getOrderCompleteMessage();
        expect(completeMessage).toBe('Thank you for your order!');
      });
    }

    test('Complete order flow - multiple items with specific quantities', async () => {
      // Add multiple items to cart (Sauce Demo uses 1 item per product in cart)
      for (const item of checkoutData.cartItems) {
        await inventoryPage.addItemToCart(item);
      }
      await inventoryPage.goToCart();

      cartPage = new CartPage(inventoryPage.page);
      expect(await cartPage.getItemQuantity('Sauce Labs Backpack')).toBe(1);
      expect(await cartPage.getItemQuantity('Sauce Labs Bike Light')).toBe(1);

      await cartPage.proceedToCheckout();

      checkoutPage = new CheckoutPage(cartPage.page);

      // Fill customer information
      await checkoutPage.fillCustomerInformation('Jane', 'Smith', '67890');
      await checkoutPage.continueCheckout();

      // Verify order summary
      const summary = await checkoutPage.getOrderSummary();
      expect(summary.itemTotal).toBeTruthy();
      expect(summary.tax).toBeTruthy();
      expect(summary.total).toBeTruthy();

      // Complete order
      await checkoutPage.finishOrder();

      // Verify order completion
      const completeMessage = await checkoutPage.getOrderCompleteMessage();
      expect(completeMessage).toBe('Thank you for your order!');
    });

    test('Cancel checkout from customer information page', async () => {
      // Add item and go to checkout
      await inventoryPage.addItemToCart('sauce-labs-backpack');
      await inventoryPage.goToCart();

      cartPage = new CartPage(inventoryPage.page);
      await cartPage.proceedToCheckout();

      checkoutPage = new CheckoutPage(cartPage.page);

      // Cancel checkout
      await checkoutPage.cancelCheckout();

      // Should be back on cart page
      await expect(checkoutPage.page).toHaveURL(/cart\.html/);
    });

    test('Cancel checkout from order summary page', async () => {
      // Add item and go to checkout
      await inventoryPage.addItemToCart('sauce-labs-backpack');
      await inventoryPage.goToCart();

      cartPage = new CartPage(inventoryPage.page);
      await cartPage.proceedToCheckout();

      checkoutPage = new CheckoutPage(cartPage.page);

      // Fill customer information
      await checkoutPage.fillCustomerInformation('John', 'Doe', '12345');
      await checkoutPage.continueCheckout();

      // Cancel from summary
      await checkoutPage.cancelCheckout();

      // Should be back on inventory page
      await expect(checkoutPage.page).toHaveURL(/inventory\.html/);
    });

    test('Attempt checkout with empty customer information', async () => {
      // Add item and go to checkout
      await inventoryPage.addItemToCart('sauce-labs-backpack');
      await inventoryPage.goToCart();

      cartPage = new CartPage(inventoryPage.page);
      await cartPage.proceedToCheckout();

      checkoutPage = new CheckoutPage(cartPage.page);

      // Try to continue without filling information
      await checkoutPage.continueCheckout();

      // Verify error message
      const error = await checkoutPage.getCheckoutError();
      expect(error).toContain('Error');
    });
  });
}