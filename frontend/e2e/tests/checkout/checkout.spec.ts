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
  test('Debería mostrar error de validación con tarjeta inválida @regression', async ({ cartPage, checkoutPage, authenticatedCustomer, page }) => {
    await cartPage.navigateToHome();
    await cartPage.addFirstBookToCart();
    await cartPage.navigateToCart();
    await cartPage.proceedToPaymentButton.click();
    await page.waitForURL('**/checkout', { timeout: 10000 });

    // Completamos con datos inválidos (tarjeta muy corta, CVC inválido)
    await checkoutPage.fillPaymentForm({
      cardNumber: '123',
      cardName: '',
      expiryDate: '12/20', // Fecha en el pasado
      cvc: '1'
    });
    
    // Al intentar enviar o al salir del foco de algunos campos (en este caso enviando porque es el trigger de la validación final en onCheckout)
    await checkoutPage.submitPayment();

    // Verificamos mensajes que son visibles para el usuario (siguiendo las directivas de pruebas)
    await checkoutPage.expectValidationError('El número de tarjeta debe tener 16 dígitos');
    await checkoutPage.expectValidationError('El nombre en la tarjeta es obligatorio');
    await checkoutPage.expectValidationError('vencida');
  });

  test('Debería cancelar el checkout y regresar al carrito exitosamente @regression', async ({ cartPage, checkoutPage, authenticatedCustomer, page }) => {
    await cartPage.navigateToHome();
    await cartPage.addFirstBookToCart();
    
    await cartPage.navigateToCart();
    await cartPage.proceedToPaymentButton.click();
    await page.waitForURL('**/checkout', { timeout: 10000 });

    // Cancelar el checkout
    await checkoutPage.cancelCheckout();

    // Debería redirigir de vuelta al carrito
    await page.waitForURL('**/cart', { timeout: 10000 });
    
    // Validar que el carrito está vacío después de cancelar
    await expect(page.getByText('Tu carrito está vacío')).toBeVisible();
  });

});
