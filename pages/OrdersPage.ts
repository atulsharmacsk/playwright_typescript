import { expect, type Page } from '@playwright/test';
import type { Product } from '../test-data/shop';

export class OrdersPage {
  constructor(private readonly page: Page) {}

  private order(orderId: string) {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('rowheader', { name: orderId, exact: true }),
    });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/#\/dashboard\/myorders/);
    await expect(this.page.getByRole('heading', { name: 'Your Orders' })).toBeVisible();
  }

  async expectOrder(orderId: string, product: Product) {
    const cells = this.order(orderId).getByRole('cell');
    await expect(cells.nth(1)).toHaveText(product.name);
    await expect(cells.nth(2)).toHaveText(product.price);
  }

  async viewOrder(orderId: string) {
    await this.order(orderId).getByRole('button', { name: 'View', exact: true }).click();
    await expect(this.page.getByText(orderId, { exact: true })).toBeVisible();
  }
}