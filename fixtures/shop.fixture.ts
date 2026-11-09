import { test as base, expect, request as apiRequest, type APIRequestContext } from '@playwright/test';
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
  authSession: { token: string; userId: string };
  authToken: string;
  authenticatedRequest: APIRequestContext;
  authenticatedShop: ProductsPage;
};

export const test = base.extend<ShopFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  productsPage: async ({ page }, use) => { await use(new ProductsPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  confirmationPage: async ({ page }, use) => { await use(new OrderConfirmationPage(page)); },
  ordersPage: async ({ page }, use) => { await use(new OrdersPage(page)); },
  authSession: async ({ request, baseURL }, use) => {
    if (!baseURL) {
      throw new Error('Configure baseURL to use API authentication.');
    }
    const credentials = getCredentials();
    const loginResponse = await request.post(new URL('/api/ecom/auth/login', baseURL).href,
      { data: { userEmail: credentials.email, userPassword: credentials.password } }
    );
    expect(loginResponse.ok()).toBeTruthy();
    const { token, userId } = await loginResponse.json();
    expect(token).toEqual(expect.any(String));
    expect(token.length).toBeGreaterThan(0);
    expect(userId).toEqual(expect.any(String));
    expect(userId.length).toBeGreaterThan(0);
    await use({ token, userId });
  },
  authToken: async ({ authSession }, use) => {
    await use(authSession.token);
  },
  authenticatedRequest: async ({ authToken, baseURL }, use) => {
    const requestContext = await apiRequest.newContext({
      baseURL,
      extraHTTPHeaders: { authorization: authToken },
    });
    try {
      await use(requestContext);
    } finally {
      await requestContext.dispose();
    }
  },
  authenticatedShop: async ({ context, authToken, baseURL, productsPage }, use) => {
    if (!baseURL) {
      throw new Error('Configure baseURL to use API authentication.');
    }
    await context.setStorageState({
      cookies: [],
      origins: [{
        origin: new URL(baseURL).origin,
        localStorage: [{ name: 'token', value: authToken }],
      }],
    });
    await productsPage.goToProductPage();
    await productsPage.expectLoaded();
    await use(productsPage);
  },
});

export { expect };