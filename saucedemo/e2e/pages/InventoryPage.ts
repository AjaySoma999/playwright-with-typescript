import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
  }

  /**
   * Click add-to-cart for the given item; itemName should be key like 'sauce-labs-backpack'.
   */
  async addItemToCart(itemName: string): Promise<void> {
    const selector = `[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    await this.clickWhenReady(selector);
  }

  /**
   * Click remove button for the item in inventory list.
   */
  async removeItemFromCart(itemName: string): Promise<void> {
    const selector = `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    await this.clickWhenReady(selector);
  }

  /**
   * Get the badge value shown in the cart icon (string), '0' when absent.
   */
  async getCartBadgeCount(): Promise<string> {
    return (await this.getText('.shopping_cart_badge')) || '0';
  }

  /**
   * Go to cart page from inventory header.
   */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Return displayed inventory item names in the list.
   */
  async getInventoryItems(): Promise<string[]> {
    const itemNames = await this.page.locator('.inventory_item_name').allTextContents();
    return itemNames.map(name => name.trim());
  }

  /**
   * Set sort option on inventory page.
   */
  async sortItems(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Open the product details page by item name.
   */
  async viewItemDetails(itemName: string): Promise<void> {
    const itemLink = this.page.locator('.inventory_item_name').filter({ hasText: itemName });
    await itemLink.click();
  }

  /**
   * Get the price text for a product by displayed name.
   */
  async getItemPrice(itemName: string): Promise<string> {
    const itemContainer = this.page.locator('.inventory_item').filter({ hasText: itemName });
    return await itemContainer.locator('.inventory_item_price').textContent() || '';
  }

  /**
   * Get product description by displayed name.
   */
  async getItemDescription(itemName: string): Promise<string> {
    const itemContainer = this.page.locator('.inventory_item').filter({ hasText: itemName });
    return await itemContainer.locator('.inventory_item_desc').textContent() || '';
  }

  /**
   * Get all inventory item prices as numbers for assertions.
   */
  async getInventoryItemPrices(): Promise<number[]> {
    const pricesRaw = await this.page.locator('.inventory_item_price').allTextContents();
    return pricesRaw.map(text => parseFloat(text.replace(/[^0-9.]/g, ''))).filter(x => !Number.isNaN(x));
  }

  /**
   * Open left navigation menu.
   */
  async openMenu(): Promise<void> {
    const menuButton = this.page.locator('#react-burger-menu-btn');
    await menuButton.click();
  }

  /**
   * Logout from app from side menu.
   */
  async logout(): Promise<void> {
    await this.openMenu();
    const logoutLink = this.page.locator('#logout_sidebar_link');
    await logoutLink.click();
  }
}