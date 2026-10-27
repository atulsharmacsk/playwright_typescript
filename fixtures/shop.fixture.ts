import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { OrdersPage } from '../pages/OrdersPage';
import { getCredentials } from '../utils/environment';

type ShopFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  confirmationPage: OrderConfirmationPage;
  ordersPage: OrdersPage;
  authenticatedShop: ProductsPage;
};

export const test = base.extend<ShopFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  productsPage: async ({ page }, use) => { await use(new ProductsPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  confirmationPage: async ({ page }, use) => { await use(new OrderConfirmationPage(page)); },
  ordersPage: async ({ page }, use) => { await use(new OrdersPage(page)); },
  authenticatedShop: async ({ context, request, baseURL, productsPage }, use) => {
    if (!baseURL) {
      throw new Error('Configure baseURL to use API authentication.');
    }
    const credentials = getCredentials();
    const loginResponse = await request.post(new URL('/api/ecom/auth/login', baseURL).href,
      { data: { userEmail: credentials.email, userPassword: credentials.password } }
    );
    expect(loginResponse.ok()).toBeTruthy();
    const { token } = await loginResponse.json();
    expect(token).toEqual(expect.any(String));
    expect(token.length).toBeGreaterThan(0);
    await context.setStorageState({
      cookies: [],
      origins: [{
        origin: new URL(baseURL).origin,
        localStorage: [{ name: 'token', value: token }],
      }],
    });
    await productsPage.goToProductPage();
    await productsPage.expectLoaded();
    await use(productsPage);
  },
});

export { expect };