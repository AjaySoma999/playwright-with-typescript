import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Sauce Demo Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('Verify page title is "saucedemo"', async () => {
    const pageTitle = await homePage.getPageTitle();
    expect(pageTitle).toBe('Swag Labs');
  });

  test('Verify login button is visible', async () => {
    const isVisible = await homePage.isLoginButtonVisible();
    expect(isVisible).toBe(true);
  });

  test('Verify page URL contains saucedemo', async () => {
    const url = await homePage.getPageURL();
    expect(url).toContain('saucedemo.com');
  });

  test('Verify username and password fields are visible', async () => {    
    expect(await homePage.usernameInput).toBeVisible();
    expect(await homePage.passwordInput).toBeVisible();
    
  });
});


test('Verify error message is displayed for invalid login', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToHome();
  await homePage.login("invalid_user", "invalid_password"); 
    const isErrorVisible = await homePage.isErrorMessageVisible();  
    const errorMessage = await homePage.getErrorMessage();
    expect(isErrorVisible).toBe(true);
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
}); 