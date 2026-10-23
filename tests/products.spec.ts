import { test, expect } from '../fixtures/shop.fixture';
import { shopData } from '../test-data/shop';

test('catalog displays available products @smoke', async ({ authenticatedShop }) => {
  const names = await authenticatedShop.getProductNames();
  expect(names.length).toBeGreaterThan(0);
  expect(names).toContain(shopData.productName);
  expect(names.every(name => name.trim().length > 0)).toBe(true);
});