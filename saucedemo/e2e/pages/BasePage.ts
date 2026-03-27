import { Page, Locator } from '@playwright/test';

/**
 * Reusable base page methods across the application.
 * All page object classes inherit from this one and can call these methods.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Helper to produce a locator from selector string.
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Wait for locator to be visible and stable, then return it.
   */
  async waitForVisible(selector: string, timeout: number = 10000): Promise<Locator> {
    const locator = this.getLocator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    // ensure attached before interacting
    await locator.waitFor({ state: 'attached', timeout });
    return locator;
  }

  /**
   * Click with automatic waiting for readiness.
   */
  async clickWhenReady(selector: string, timeout: number = 10000): Promise<void> {
    const locator = await this.waitForVisible(selector, timeout);
    await locator.click({ timeout });
  }

  /**
   * Fill input with automatic waiting for readiness.
   */
  async fillWhenReady(selector: string, value: string, timeout: number = 10000): Promise<void> {
    const locator = await this.waitForVisible(selector, timeout);
    await locator.fill(value, { timeout });
  }

  /**
   * Get trimmed text from an element safely.
   */
  async getText(selector: string, timeout: number = 10000): Promise<string> {
    const locator = await this.waitForVisible(selector, timeout);
    return (await locator.textContent())?.trim() ?? '';
  }

  /**
   * Navigate to relative path (e.g. '/', '/inventory.html').
   */
  async navigate(path: string = '') {
    await this.page.goto(path || '/');
  }

  /**
   * Return the current title for assertions.
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Return the current URL for assertions or flow control.
   */
  async getPageURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Return full page HTML content.
   */
  async getPageContent(): Promise<string | null> {
    return await this.page.content();
  }

  /**
   * Wait until URL matches a string or regex.
   */
  async waitForURL(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  /**
   * Reload the current page.
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back in browser history.
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history.
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }
   
}
