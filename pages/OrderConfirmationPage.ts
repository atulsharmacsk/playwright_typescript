import { expect, type Page } from '@playwright/test';
import type { Product } from '../test-data/shop';
import { parseOrderId } from '../utils/order';

export class OrderConfirmationPage {
  constructor(private readonly page: Page) {}

  async expectProduct(product: Product) {
    await expect(this.page.getByRole('heading', { name: 'Thankyou for the order.' })).toBeVisible();
    const item = this.page.locator('tr.line-item').filter({ hasText: product.name });
    await expect(item.locator('.title').first()).toHaveText(product.name);
    await expect(item.locator('.title').nth(1)).toHaveText(product.price);
  }

  async getOrderId() {
    return parseOrderId(await this.page.locator('label.ng-star-inserted').innerText());
  }

  async openOrderHistory() {
    await this.page.getByText('Orders History Page', { exact: true }).click();
  }
}