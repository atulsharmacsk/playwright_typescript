import { test, expect } from '@playwright/test';

test('end to end flow', async ({ page }) => {

    const email = 'atulsharma@gmail.com';
    //login
    await page.goto('');
    await page.locator('.login-section-wrapper').waitFor();
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(email);
    await page.getByRole('textbox', { name: 'enter your passsword' }).fill('Test@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveTitle("Let's Shop");

    //add to cart
    const itemName = 'ZARA COAT 3';
    const itemBlock = page.locator(`div.card:has(b:has-text("${itemName}"))`);
    const price = (await itemBlock.locator('.text-muted').textContent())!.trim();
    await itemBlock.locator(`button:has-text("Add To Cart")`).click();
    const cartBlock = page.getByRole('listitem').getByRole('button', { name: 'Cart' });
    await expect(cartBlock.locator('label')).toHaveText('1');

    //verify item added in cart
    await cartBlock.click();
    const cartInfoBlock = page.locator('.cart .infoWrap');
    const cartInfoLeft = cartInfoBlock.locator('xpath=//*[@class="cartSection"]');
    await expect(cartInfoLeft.getByRole('heading'))
        .toContainText([itemName], { timeout: 10000 })

    const cartInfoBlockUsingName = page.locator(`.cart .infoWrap:has(h3:has-text("${itemName}"))`);
    const cartInfoLeftUsingName = cartInfoBlockUsingName.locator('.cartSection');
    const cartInfoMiddleUsingName = cartInfoBlockUsingName.locator('.prodTotal');
    const cartInfoRightUsingName = cartInfoBlockUsingName.locator('.removeWrap');
    const cartItemId = await cartInfoLeftUsingName.locator('.itemNumber').textContent();
    const priceForItem = await cartInfoMiddleUsingName.locator('p');
    await expect(priceForItem).toHaveText(price);
    await cartInfoRightUsingName.locator(`button:has-text('Buy Now')`).click();
    await page.locator('.payment__title:has-text("Payment Method")').waitFor();

    //payment page
    const cardNumber = '4542 9931 9292 2293';
    await expect(page.locator('.payment__types .active')).toHaveText('Credit Card');
    expect(await page.locator('.field:has(.title:has-text("Credit Card Number")) .input').inputValue()).toBe(cardNumber);
    const expirySection = page.locator('.field:has-text("Expiry Date")');
    await expirySection.getByRole('combobox').first().selectOption('05');
    await expirySection.getByRole('combobox').nth(1).selectOption('30');
    await page.locator('div.field:has-text("CVV Code") .input').fill('321');
    await page.locator('div.field:has-text("Name on Card") .input').fill('Atul Sharma');
    await page.locator('div.field:has-text("Apply Coupon") .input').fill('rahulshettyacademy');
    await page.locator('button:has-text("Apply Coupon")').click();
    await expect(page.locator('p:has-text("* Coupon Applied")')).toBeVisible();
    expect(await page.locator('.user__name input.ng-valid').inputValue()).toBe(email);
    // dropdown is driven by key events, so fill() doesn't reliably open it
    await page.getByPlaceholder('Select Country').pressSequentially('Ind', { delay: 150 });
    const countryResults = page.locator('.ta-results');
    await countryResults.waitFor();
    // exact match so "British Indian Ocean Territory" is skipped
    await countryResults.locator('button', { hasText: /^\s*India$/ }).click();
    expect(await page.getByPlaceholder('Select Country').inputValue()).toBe('India');
    await page.locator('a:has-text("Place Order")').click();

    //Order page
    await expect(page.locator('h1:has-text("Thankyou for the order.")')).toBeVisible();
    await expect(page.locator('table.order-summary .title').first()).toContainText([itemName]);
    await expect(page.locator(`tr.line-item:has-text("${itemName}") .title`).nth(1)).toHaveText(price);
    const orderId = (await page.locator('label.ng-star-inserted').textContent())!.replace(/\|/g, '').trim();
    await page.locator('label:has-text("Orders History Page")').click();

    //OrderHistory
    const orderRow = page.locator(`table tr.ng-star-inserted:has-text("${orderId}") td`);
    await expect(page.locator("table th[scope*='row']")).toContainText([orderId]);
    await expect(orderRow.nth(1)).toHaveText(itemName);
    await expect(orderRow.nth(2)).toHaveText(price);
    await page.pause();

})