import { test } from '../fixtures/shop.fixture';
import { shopData } from '../test-data/shop';
import { getCredentials } from '../utils/environment';

test('purchase a product with a coupon and verify order history @checkout', async ({
    authenticatedShop, cartPage, checkoutPage, confirmationPage, ordersPage,
}) => {
    const product = await test.step('Add a product and verify the cart', async () => {
        const selected = await authenticatedShop.addToCart(shopData.productName);
        await authenticatedShop.expectCartCount(1);
        await authenticatedShop.openCart();
        await cartPage.expectProduct(selected);
        return selected;
    });

    await test.step('Complete checkout with a coupon', async () => {
        await cartPage.buyProduct(product.name);
        await checkoutPage.expectEmail(getCredentials().email);
        await checkoutPage.fillPayment(shopData.payment);
        await checkoutPage.applyCoupon(shopData.coupon);
        await checkoutPage.placeOrder();
        await confirmationPage.expectProduct(product);
    });

    await test.step('Verify the new order in history', async () => {
        const orderId = await confirmationPage.getOrderId();
        await confirmationPage.openOrderHistory();
        await ordersPage.expectOrder(orderId, product);
    });
});