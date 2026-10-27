import { test, expect } from '../fixtures/shop.fixture';
import { getCredentials } from '../utils/environment';

test.describe('Authentication', () => {
  test('registered user can log in @smoke', async ({ loginPage, productsPage }) => {
    const credentials = getCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await productsPage.expectLoaded();
  });

  test('incorrect credentials are rejected', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login('unregistered-shopper@example.invalid', 'NotAValidPassword123!');
    await expect(page.locator('#toast-container')).toContainText(/Incorrect email or password/i);
    await loginPage.expectLoginForm();
    await expect(page).toHaveURL(/#\/auth\/login/);
  });

  test('email and password are required', async ({ loginPage, page }) => {
    await loginPage.goto();
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page.getByText('Email is required', { exact: false })).toBeVisible();
    await expect(page.getByText('Password is required', { exact: false })).toBeVisible();
    await loginPage.expectLoginForm();
  });

  test('user can sign out @smoke', async ({ authenticatedShop, loginPage, page }) => {
    await authenticatedShop.logout();
    await expect(page).toHaveURL(/#\/auth\/login/);
    await loginPage.expectLoginForm();
    await page.reload();
    await expect(page).toHaveURL(/#\/auth\/login/);
    await loginPage.expectLoginForm();
    expect(await page.evaluate(() => window.localStorage.getItem('token'))).toBeNull();
  });
});