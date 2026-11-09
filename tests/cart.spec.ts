import { test, expect } from '../fixtures/shop.fixture';
import { shopData } from '../test-data/shop';
import { getAllProducts } from '../utils/shopApi';

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

  test('user can not add same product twice in cart', async ({ authenticatedShop, cartPage, authenticatedRequest, authSession }) => {
    // await authenticatedShop.addToCart(shopData.productName);

    const products = await getAllProducts(authenticatedRequest);
    const product = products.find((item) => item.productName === shopData.productName);
    if (!product) {
      throw new Error(`Product not found: ${shopData.productName}`);
    }
    for (let i = 0; i < 2; i++) {
      const addToCartResponse = await authenticatedRequest.post('/api/ecom/user/add-to-cart', {
        data: { _id: authSession.userId, product: product }
      });

      expect(addToCartResponse.status()).toBe(200);
      const addToCartResponseBody = await addToCartResponse.json();
      expect(addToCartResponseBody.message).toBe('Product Added To Cart')
    }

    await authenticatedShop.openCart();
    await cartPage.removeProduct(shopData.productName);
    await cartPage.expectEmpty();
  });
});