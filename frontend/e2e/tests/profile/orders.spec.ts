import { test, expect } from '../../fixtures/profile-fixture';

test.describe('Profile - Module - Order History', () => {

  test('Should reflect a completed order in the profile history @smoke', async ({ cartPage, checkoutPage, profilePage, authenticatedCustomer, page }) => {
    // 1. Completar el proceso de compra
    await cartPage.navigateToHome();
    await cartPage.addFirstBookToCart();
    await cartPage.navigateToCart();
    await cartPage.proceedToPaymentButton.click();
    await page.waitForURL('**/checkout', { timeout: 10000 });
    
    // Usar datos de tarjeta válidos del fixture
    await checkoutPage.fillPaymentForm();
    await checkoutPage.submitPayment();
    await checkoutPage.expectPaymentSuccess();

    // 2. Navegar al perfil
    await profilePage.navigateToProfile();

    // 3. Verificar que la orden aparece en el historial bajo "Pedidos Confirmados"
    // Buscamos directamente el label de estado "Pagado" que nos asegura que se renderizó correctamente la orden
    await profilePage.expectCompletedOrderVisible();
  });
});
