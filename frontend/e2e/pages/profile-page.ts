import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT: ProfilePage
 * 
 * Centraliza la interacción con el perfil del usuario.
 * Maneja los locators de órdenes confirmadas, configuraciones de usuario, etc.
 */
export class ProfilePage {
  readonly page: Page;
  readonly confirmOrdersHeader: Locator;
  readonly noOrdersMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // El componente ConfirmOrders tiene un título que contiene "Pedidos Confirmados"
    this.confirmOrdersHeader = page.getByRole('heading', { name: /pedidos confirmados/i });
    this.noOrdersMessage = page.getByText('No tienes pedidos confirmados aún');
  }

  /**
   * Navega a la página de perfil del usuario
   */
  async navigateToProfile() {
    await this.page.goto('/profile');
    // Asegurarse de que el perfil ha cargado esperando que el título sea visible
    await this.confirmOrdersHeader.waitFor({ state: 'visible' });
  }

  /**
   * Verifica que exista al menos una orden completada
   */
  async expectCompletedOrderVisible() {
    // Buscamos que aparezca el badge de estado "Pagado" de una orden completada
    await expect(this.page.getByText('Pagado', { exact: true }).first()).toBeVisible();
  }
}
