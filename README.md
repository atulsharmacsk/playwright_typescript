# Playwright TypeScript Test Framework

UI tests for the [Rahul Shetty Academy demo shop](https://rahulshettyacademy.com/client/), organized around page objects, typed data, and test-scoped fixtures.

## Prerequisites

- Node.js 22 or later and npm.
- A registered account on the demo shop for authenticated tests.
- Access to the public demo site and your configured npm registry.

## Quick Start

```powershell
npm ci
npx playwright install chromium
Copy-Item .env.example .env
```

Edit `.env` with your registered demo-account email and password, then run:

```powershell
npm run typecheck
npm test
```

The default suite runs utility tests and Chromium UI tests. Unit tests and negative-login tests do not require account credentials. To run only utility tests without installing browsers:

```powershell
npm run test:unit
```

If npm returns a corporate registry sign-in page instead of package metadata, authenticate with your organization's registry before retrying installation.

## Structure

```text
fixtures/
	shop.fixture.ts             Page objects and authenticated-session fixture
pages/
	LoginPage.ts               Login interactions
	ProductsPage.ts            Catalog, navigation, and add-to-cart actions
	CartPage.ts                Cart verification and removal
	CheckoutPage.ts            Payment, country, coupon, and order submission
	OrderConfirmationPage.ts   Confirmation and order ID extraction
	OrdersPage.ts              History and order detail navigation
test-data/
	shop.ts                    Typed product and demo-payment data
utils/
	environment.ts             Required credential validation
	order.ts                   Order ID normalization and validation
tests/
	auth.spec.ts               Login, required fields, rejection, and logout
	products.spec.ts           Catalog checks
	cart.spec.ts               Empty, single-item, multi-item, and removal flows
	checkout.spec.ts           Purchase without coupon and order details
	endtoend.spec.ts           Purchase with coupon and order history
	orders.spec.ts             Order-history navigation
	unit/order.unit.spec.ts    Order ID utility tests
playwright.config.ts         Environments, browsers, retries, and reporting
tsconfig.json                Strict TypeScript checks
.env.example                 Environment template without real credentials
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `BASE_URL` | Full login URL; defaults to the public demo shop login page. Keep it quoted in `.env` because the URL contains `#`. |
| `TEST_EMAIL` | Registered demo-account email; required by authenticated tests. |
| `TEST_PASSWORD` | Demo-account password; required by authenticated tests. |
| `CI` | Enables two retries and rejects accidentally committed `test.only` calls. |

The configuration loads the root `.env` using Node's native environment loader. Existing shell variables take precedence. Local environment files are gitignored; never commit real credentials or authentication state. In CI, inject credentials as environment variables from your secret store.

Tests use a fresh browser context and log in separately for each authenticated test. There is no shared saved session or dependency on test execution order. A single worker is the default to limit traffic and contention on the shared demo account. Only increase workers when the target environment and test accounts support concurrent execution.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Unit tests and Chromium UI suite |
| `npm run test:unit` | Utility tests, without a browser or credentials |
| `npm run test:smoke` | Login, logout, catalog, and single-product cart checks |
| `npm run test:checkout` | Purchase flows with and without a coupon |
| `npm run test:headed` | Chromium UI tests in a visible browser |
| `npm run test:ui` | Interactive Playwright test runner |
| `npm run test:debug` | Chromium tests with the Playwright inspector |
| `npm run test:list` | Discover tests across all configured projects |
| `npm run typecheck` | Strict TypeScript validation |
| `npm run report` | Open the latest HTML report |
| `npm run browsers:install` | Install Chromium, Firefox, and WebKit |
| `npm run test:all-browsers` | Unit tests plus all three browser projects |

Run one spec or browser explicitly:

```powershell
npx playwright test tests/cart.spec.ts --project=chromium
npx playwright test tests/auth.spec.ts --project=firefox
```

Install the corresponding browser before selecting Firefox or WebKit. On Linux agents, use `npx playwright install --with-deps` to install browser system dependencies as well.

## Coverage

The default suite contains 12 UI scenarios and 6 order-ID utility checks:

- Successful login, invalid credentials, required fields, and logout.
- Available product names and expected catalog product.
- Empty cart, single-product price, two products, and item removal.
- Checkout with a valid coupon and verification of the new order in history.
- Checkout without a coupon and opening the newly created order details.
- Navigation to order history from the catalog.
- Valid, empty, and ambiguous confirmation order IDs.

Purchase tests submit orders to the demo backend using its mock payment screen. Use only a dedicated demo account and fake payment data. Created orders remain in account history; tests verify their own returned order ID rather than relying on existing history or deleting unrelated orders. Repeated runs and CI retries can create additional demo orders. The suite assumes a fresh session has an empty cart and the configured catalog product exists. Do not point it at a production store.

## Reports And Debugging

- HTML report: `playwright-report/index.html`.
- JUnit results: `test-results/junit.xml`.
- Failed-test traces, screenshots, and videos: `test-results/artifacts/`.

Use `npm run report` and select a failed test to inspect its attachments, or open a specific trace:

```powershell
npx playwright show-trace "path/to/trace.zip"
```

Reports and traces may contain account details and application data. Treat them as sensitive artifacts and restrict access when publishing them. Playwright transpiles TypeScript but does not typecheck it, so run `npm run typecheck` separately as a validation gate.

## Adding Tests

1. Put selectors and reusable page actions in the owning class under `pages/`.
2. Register a new page object in `fixtures/shop.fixture.ts` when needed.
3. Import `test` and `expect` from the shop fixture in UI specs. Request `authenticatedShop` only when the test needs a logged-in session.
4. Keep assertions specific to the scenario in the test; reuse page assertions for common page states.
5. Put non-secret reusable inputs in `test-data/` and pure helpers in `utils/`.
6. Add utility tests as `*.unit.spec.ts` under `tests/unit/`; they run only in the unit project.
7. Use Playwright locator assertions and application readiness signals rather than fixed sleeps. Add `@smoke` or `@checkout` to test titles where appropriate.

```typescript
import { test } from '../fixtures/shop.fixture';
import { shopData } from '../test-data/shop';

test('selected product appears in the cart', async ({ authenticatedShop, cartPage }) => {
	const product = await authenticatedShop.addToCart(shopData.productName);
	await authenticatedShop.openCart();
	await cartPage.expectProduct(product);
});
```
