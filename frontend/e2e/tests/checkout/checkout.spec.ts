import { test, expect } from '../../fixtures/checkout-fixture';

test.describe('Proceso de Compra (Checkout)', () => {

  test('Debería completar el flujo de compra exitosamente @smoke', async ({ cartPage, checkoutPage, authenticatedCustomer, page }) => {
    // 1. Navegar al inicio y agregar un libro al carrito
    await cartPage.navigateToHome();
    await cartPage.addFirstBookToCart();
    
    // 2. Ir al carrito y proceder al pago
    await cartPage.navigateToCart();
    await cartPage.proceedToPaymentButton.click();
    
    // 3. Esperar que redirija a la página de checkout
    await page.waitForURL('**/checkout', { timeout: 10000 });

    // 4. Completar el formulario de pago
    await checkoutPage.fillPaymentForm();

    // 5. Enviar el pago
    await checkoutPage.submitPayment();

    // 6. Verificar que la compra fue exitosa (validación observable por el usuario)
    await checkoutPage.expectPaymentSuccess();
  });

});
