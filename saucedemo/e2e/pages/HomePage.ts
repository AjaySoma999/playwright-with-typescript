import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { InventoryPage } from './InventoryPage';

export class HomePage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('h3[data-test="error"]');
  }

  /**
   * Open the homepage URL and wait for it to stabilize.
   */
  async navigateToHome(): Promise<void> {
    await this.navigate('/');
    await this.page.waitForTimeout(5000); // Wait for 5 seconds to ensure the page is fully loaded
  }

  /**
   * Fill credentials and click login.
   */
  async login(username: string, password: string): Promise<void> {
   await this.fillWhenReady('#user-name', username);
   await this.fillWhenReady('#password', password);
   await this.clickWhenReady('#login-button');
  }

  /**
   * Login and return an InventoryPage object after successful navigation.
   */
  async loginSuccessfully(username: string = 'standard_user', password: string = 'secret_sauce'): Promise<InventoryPage> {
    await this.login(username, password);
    await this.waitForVisible('h3[data-test="error"]', 2000).catch(() => {}); // keep in case login fails but ignore
    await this.page.waitForURL('**/inventory.html');
    return new InventoryPage(this.page);
  }

  /**
   * Check if error message is visible after failed login.
   */
  async isErrorMessageVisible(): Promise<boolean> {
    const locator = this.page.locator('h3[data-test="error"]');
    return await locator.isVisible();
  }

  /**
   * Get the login page error text.
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText('h3[data-test="error"]');
  }

  /**
   * Check if login button is visible on the page.
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }
}
