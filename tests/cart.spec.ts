import { test, expect } from '../fixtures/shop.fixture';
import { shopData } from '../test-data/shop';

test.describe('Shopping cart', () => {
  test('new session starts with an empty cart', async ({ authenticatedShop, cartPage }) => {
    await authenticatedShop.openCart();
    await cartPage.expectEmpty();
  });

  test('add one product and verify its price @smoke', async ({ authenticatedShop, cartPage }) => {
    const product = await authenticatedShop.addToCart(shopData.productName);
    await authenticatedShop.expectCartCount(1);
    await authenticatedShop.openCart();
    await cartPage.expectItemCount(1);
    await cartPage.expectProduct(product);
  });

  test('add two different products', async ({ authenticatedShop, cartPage }) => {
    const names = await authenticatedShop.getProductNames();
    expect(names.length).toBeGreaterThanOrEqual(2);
    const firstProduct = await authenticatedShop.addToCart(names[0].trim());
    await authenticatedShop.expectCartCount(1);
    const secondProduct = await authenticatedShop.addToCart(names[1].trim());
    await authenticatedShop.expectCartCount(2);
    await authenticatedShop.openCart();
    await cartPage.expectItemCount(2);
    await cartPage.expectProduct(firstProduct);
    await cartPage.expectProduct(secondProduct);
  });

  test('remove a product and return to an empty cart', async ({ authenticatedShop, cartPage }) => {
    await authenticatedShop.addToCart(shopData.productName);
    await authenticatedShop.openCart();
    await cartPage.removeProduct(shopData.productName);
    await cartPage.expectEmpty();
  });
});