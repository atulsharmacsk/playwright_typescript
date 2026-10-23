import { test } from '../fixtures/shop.fixture';

test.describe('Test group', () => {
  test('seed', async ({ authenticatedShop }) => {
    await authenticatedShop.expectLoaded();
    // generate code here.
  });
});
