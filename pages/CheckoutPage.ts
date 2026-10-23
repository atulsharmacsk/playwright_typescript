import { expect, type Page } from '@playwright/test';
import type { PaymentDetails } from '../test-data/shop';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async expectEmail(email: string) {
    await expect(this.page.locator('.user__name input.ng-valid')).toHaveValue(email);
  }

  async fillPayment(details: PaymentDetails) {
    await expect(this.page.locator('.payment__types .active')).toHaveText('Credit Card');
    const expiry = this.page.locator('.field').filter({ hasText: 'Expiry Date' });
    await expiry.getByRole('combobox').first().selectOption(details.expiryMonth);
    await expiry.getByRole('combobox').nth(1).selectOption(details.expiryYear);
    await this.page.locator('.field').filter({ hasText: 'CVV Code' }).locator('input').fill(details.cvv);
    await this.page.locator('.field').filter({ hasText: 'Name on Card' }).locator('input').fill(details.cardholder);
    const country = this.page.getByPlaceholder('Select Country');
    await country.clear();
    await country.pressSequentially(details.country, { delay: 100 });
    const countryName = details.country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await this.page.locator('.ta-results button').filter({ hasText: new RegExp(`^\\s*${countryName}\\s*$`) }).click();
    await expect(country).toHaveValue(details.country);
  }

  async applyCoupon(coupon: string) {
    await this.page.locator('.field').filter({ hasText: 'Apply Coupon' }).locator('input').fill(coupon);
    await this.page.getByRole('button', { name: 'Apply Coupon' }).click();
    await expect(this.page.getByText('* Coupon Applied')).toBeVisible();
  }

  async placeOrder() {
    await this.page.getByText('Place Order', { exact: true }).click();
  }
}