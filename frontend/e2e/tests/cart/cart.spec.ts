/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '../../fixtures/cart-fixture';

test.describe('Cart - Module - Shopping Cart', () => {

  test('Should add a book to the cart successfully @smoke', async ({ cartPage, authenticatedCustomer }) => {
    await cartPage.navigateToHome();
    const previousCount = await cartPage.getCartItemCount();
    await cartPage.addFirstBookToCart();
    const newCount = await cartPage.getCartItemCount();
    expect(newCount).toBeGreaterThan(previousCount);
  });

  test('Should display an empty cart initially @regression', async ({ cartPage, authenticatedCustomer }) => {
    await cartPage.navigateToCart();
    await cartPage.expectCartEmpty();
  });

  test('Should increment the cart counter when adding a book @regression', async ({ cartPage, authenticatedCustomer }) => {
    await cartPage.navigateToHome();
    
    const previousCount = await cartPage.getCartItemCount();
    await cartPage.addFirstBookToCart();
    const newCount = await cartPage.getCartItemCount();
    expect(newCount).toBeGreaterThan(previousCount);
  });

  test('Should display cart with items after adding a book @regression', async ({ cartPage, authenticatedCustomer }) => {
    await cartPage.navigateToHome();
    await cartPage.addFirstBookToCart();
    await cartPage.navigateToCart();
    await cartPage.expectCartNotEmpty();
  });

  test('Should redirect to login if an unauthenticated user tries to view the cart @regression', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  });
});
