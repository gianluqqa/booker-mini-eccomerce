/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '../../fixtures/cart-fixture';

test.describe('Carrito de Compras', () => {

  test('Debería agregar un libro al carrito exitosamente @smoke', async ({ cartPage, authenticatedCustomer }) => {
    await cartPage.navigateToHome();
    const previousCount = await cartPage.getCartItemCount();
    await cartPage.addFirstBookToCart();
    const newCount = await cartPage.getCartItemCount();
    expect(newCount).toBeGreaterThan(previousCount);
  });

  test('Debería mostrar el carrito vacío inicialmente @regression', async ({ cartPage, authenticatedCustomer }) => {
    await cartPage.navigateToCart();
    await cartPage.expectCartEmpty();
  });

  test('Debería incrementar el contador del carrito al agregar un libro @regression', async ({ cartPage, authenticatedCustomer }) => {
    await cartPage.navigateToHome();
    
    const previousCount = await cartPage.getCartItemCount();
    await cartPage.addFirstBookToCart();
    const newCount = await cartPage.getCartItemCount();
    expect(newCount).toBeGreaterThan(previousCount);
  });

  test('Debería mostrar el carrito con items después de agregar un libro @regression', async ({ cartPage, authenticatedCustomer }) => {
    await cartPage.navigateToHome();
    await cartPage.addFirstBookToCart();
    await cartPage.navigateToCart();
    await cartPage.expectCartNotEmpty();
  });

  test('Debería redirigir al login si un usuario no autenticado intenta ver el carrito @regression', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  });
});
