import { expect, type Page } from '@playwright/test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  private product(name: string) {
    return this.page.locator('div.card').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/#\/dashboard\/dash/);
    await expect(this.page.locator('div.card').first()).toBeVisible();
  }

  async getProductNames() {
    await this.expectLoaded();
    return this.page.locator('div.card b').allTextContents();
  }

  async addToCart(name: string) {
    const product = this.product(name);
    await expect(product).toBeVisible();
    const price = (await product.locator('.text-muted').innerText()).trim();
    await product.getByRole('button', { name: 'Add To Cart' }).click();
    await expect(this.page.locator('#toast-container')).toContainText('Product Added To Cart');
    return { name, price };
  }

  async expectCartCount(count: number) {
    await expect(this.page.locator('button[routerlink="/dashboard/cart"] label')).toHaveText(String(count));
  }

  async openCart() {
    await this.page.locator('button[routerlink="/dashboard/cart"]').click();
  }

  async openOrders() {
    await this.page.getByRole('button', { name: /ORDERS/i }).click();
  }

  async logout() {
    await this.page.getByRole('button', { name: /Sign Out/i }).click();
  }
}