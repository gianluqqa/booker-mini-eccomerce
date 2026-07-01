import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT: CheckoutPage
 * 
 * Centraliza la interacción con la página de checkout.
 * Mantiene la abstracción de los selectores.
 */
export class CheckoutPage {
  readonly page: Page;

  readonly cardNumberInput: Locator;
  readonly cardNameInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvcInput: Locator;
  readonly confirmPaymentButton: Locator;
  readonly cancelCheckoutButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Localizadores basados en accesibilidad y roles funcionales
    this.cardNumberInput = page.getByLabel(/Número de tarjeta/i);
    this.cardNameInput = page.getByLabel(/Nombre en la tarjeta/i);
    this.expiryDateInput = page.getByLabel(/Vencimiento/i);
    this.cvcInput = page.getByLabel(/CVC/i);
    
    this.confirmPaymentButton = page.getByRole('button', { name: /confirmar pago/i });
    this.successMessage = page.getByRole('heading', { name: /¡Orden Confirmada!/i });
    
    // Elementos de regresión
    this.cancelCheckoutButton = page.getByRole('button', { name: /cancelar checkout/i });
  }

  /**
   * Completa el formulario de pago con datos simulados
   */
  async fillPaymentForm(cardData = {
    cardNumber: '1234567890123456',
    cardName: 'JOHN DOE',
    expiryDate: '12/30',
    cvc: '123'
  }) {
    await this.cardNumberInput.fill(cardData.cardNumber);
    await this.cardNameInput.fill(cardData.cardName);
    await this.expiryDateInput.fill(cardData.expiryDate);
    await this.cvcInput.fill(cardData.cvc);
  }

  /**
   * Envía el formulario de pago
   */
  async submitPayment() {
    await this.confirmPaymentButton.click();
  }
  
  /**
   * Cancela el proceso de pago
   */
  async cancelCheckout() {
    await this.cancelCheckoutButton.click();
  }

  /**
   * Verifica que la orden haya sido confirmada exitosamente
   */
  async expectPaymentSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 15000 });
  }
  
  /**
   * Verifica la aparición de un mensaje de error de validación específico
   */
  async expectValidationError(message: string) {
    await expect(this.page.getByText(message, { exact: false }).first()).toBeVisible();
  }
}
