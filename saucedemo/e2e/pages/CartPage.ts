import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Returns number of items in the cart list.
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Returns all item names shown in cart for assertion.
   */
  async getCartItemNames(): Promise<string[]> {
    const itemList = await this.page.locator('.inventory_item_name').allTextContents();
    return itemList.map((n) => n.trim());
  }

  /**
   * Remove an item from cart by data-test remove button.
   */
  async removeItem(itemName: string): Promise<void> {
    const selector = `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    await this.clickWhenReady(selector);
  }

  /**
   * Attempt to set quantity for cart item; throws if not possible.
   */
  async setItemQuantity(itemName: string, quantity: number): Promise<void> {
    const cartItem = this.page.locator('.cart_item').filter({ hasText: itemName });
    const qtyInput = cartItem.locator('.cart_quantity input');

    if (await qtyInput.count() > 0) {
      await qtyInput.fill(quantity.toString());
      return;
    }

    // Sauce Demo does not expose quantity input in cart view; quantity is always managed by Add/Remove buttons.
    // For test purposes, assert requested quantity is already present.
    const qtyLabel = await cartItem.locator('.cart_quantity').textContent();
    const currentQuantity = parseInt((qtyLabel || '1').trim(), 10);
    if (currentQuantity !== quantity) {
      throw new Error(`Cannot set quantity for ${itemName}. Current quantity is ${currentQuantity}, requested ${quantity}.`);
    }
  }

  /**
   * Get current quantity value displayed for a cart item.
   */
  async getItemQuantity(itemName: string): Promise<number> {
    const cartItem = this.page.locator('.cart_item').filter({ hasText: itemName });
    const qtyLabel = await cartItem.locator('.cart_quantity').textContent();
    return parseInt((qtyLabel || '0').trim(), 10) || 0;
  }

  /**
   * Click checkout button to proceed to checkout page.
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Continue shopping from cart back to inventory.
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}