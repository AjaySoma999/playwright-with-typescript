import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly orderCompleteMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.orderCompleteMessage = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout(): Promise<void> {
    await this.continueButton.click();
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async getOrderCompleteMessage(): Promise<string> {
    return await this.orderCompleteMessage.textContent() || '';
  }

  async goBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  async getOrderSummary(): Promise<{itemTotal: string, tax: string, total: string}> {
    const itemTotal = await this.page.locator('.summary_subtotal_label').textContent() || '';
    const tax = await this.page.locator('.summary_tax_label').textContent() || '';
    const total = await this.page.locator('.summary_total_label').textContent() || '';
    return { itemTotal, tax, total };
  }

  async getCheckoutError(): Promise<string> {
    return await this.page.locator('h3[data-test="error"]').textContent() || '';
  }
}