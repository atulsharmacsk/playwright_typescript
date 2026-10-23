import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

const environmentFile = resolve(__dirname, '.env');
if (existsSync(environmentFile)) {
  loadEnvFile(environmentFile);
}

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results/artifacts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'https://rahulshettyacademy.com/client/#/auth/login',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'unit',
      testMatch: '**/*.unit.spec.ts',
    },
    {
      name: 'chromium',
      testIgnore: '**/*.unit.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/*.unit.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: '**/*.unit.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
