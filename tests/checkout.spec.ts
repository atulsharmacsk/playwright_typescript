import { test } from '../fixtures/shop.fixture';
import { shopData } from '../test-data/shop';
import { getCredentials } from '../utils/environment';

test('purchase without a coupon and view order details @checkout', async ({
  authenticatedShop, cartPage, checkoutPage, confirmationPage, ordersPage,
}) => {
  const product = await authenticatedShop.addToCart(shopData.productName);
  await authenticatedShop.openCart();
  await cartPage.expectProduct(product);
  await cartPage.buyProduct(product.name);
  await checkoutPage.expectEmail(getCredentials().email);
  await checkoutPage.fillPayment(shopData.payment);
  await checkoutPage.placeOrder();
  await confirmationPage.expectProduct(product);
  const orderId = await confirmationPage.getOrderId();
  await confirmationPage.openOrderHistory();
  await ordersPage.expectOrder(orderId, product);
  await ordersPage.viewOrder(orderId);
});