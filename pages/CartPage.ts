import { expect, type Page } from '@playwright/test';
import type { Product } from '../test-data/shop';

export class CartPage {
  constructor(private readonly page: Page) {}

  private item(name: string) {
    return this.page.locator('.cart .infoWrap').filter({
      has: this.page.getByRole('heading', { name, exact: true }),
    });
  }

  async expectProduct(product: Product) {
    const item = this.item(product.name);
    await expect(item).toBeVisible();
    await expect(item.locator('.prodTotal p')).toHaveText(product.price);
  }

  async expectItemCount(count: number) {
    await expect(this.page.locator('.cart .infoWrap')).toHaveCount(count);
  }

  async removeProduct(name: string) {
    await this.item(name).locator('.removeWrap button').filter({ hasNotText: 'Buy Now' }).click();
    await expect(this.item(name)).toHaveCount(0);
  }

  async expectEmpty() {
    await expect(this.page.getByRole('heading', { name: 'No Products in Your Cart !' })).toBeVisible();
    await this.expectItemCount(0);
  }

  async buyProduct(name: string) {
    await this.item(name).getByRole('button', { name: 'Buy Now' }).click();
    await expect(this.page.getByText('Payment Method', { exact: true })).toBeVisible();
  }
}