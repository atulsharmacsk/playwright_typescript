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
  authenticatedShop: async ({ loginPage, productsPage }, use) => {
    const credentials = getCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await productsPage.expectLoaded();
    await use(productsPage);
  },
});

export { expect };