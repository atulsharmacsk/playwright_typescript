import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('');
    await expect(this.page.locator('.login-section-wrapper')).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.page.getByRole('textbox', { name: 'email@example.com' }).fill(email);
    await this.page.getByRole('textbox', { name: 'enter your passsword' }).fill(password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }

  async expectLoginForm() {
    await expect(this.page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  }
}