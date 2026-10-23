import { test } from '../fixtures/shop.fixture';

test('navigate to order history from the catalog', async ({ authenticatedShop, ordersPage }) => {
  await authenticatedShop.openOrders();
  await ordersPage.expectLoaded();
});