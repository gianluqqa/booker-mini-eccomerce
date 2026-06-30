import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT: CartPage
 * 
 * ¿Qué nos da este Page Object?
 * - Métodos para interactuar con el carrito de compras
 * - Métodos para agregar libros al carrito
 * - Métodos para verificar el estado del carrito
 * 
 * ¿Por qué es útil?
 * - Centraliza la lógica de interacción con el carrito
 * - Facilita el mantenimiento de las pruebas
 * - Reutiliza código en múltiples tests
 */
export class CartPage {
  readonly page: Page;

  // Locators de elementos del carrito
  readonly addToCartButton: Locator;
  readonly cartIcon: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartItemCount: Locator;
  readonly proceedToPaymentButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators principales
    // En BookStrip el botón de agregar tiene title="Añadir al carrito"
    this.addToCartButton = page.getByRole('button', { name: /añadir al carrito/i }).or(
      page.getByRole('button').filter({ has: page.locator('svg') })
    ).first();
    this.cartIcon = page.getByRole('button').filter({ hasText: '' }).locator('svg').first();
    this.emptyCartMessage = page.getByText('Tu carrito está vacío');
    this.proceedToPaymentButton = page.getByRole('button', { name: /proceder al pago/i });
    
    // Locator para el contador de items en el carrito (navbar)
    // El contador está en un span dentro del link del carrito
    this.cartItemCount = page.locator('a[href="/cart"] span').filter({ hasText: /^\d+$/ }).or(
      page.locator('a[href="/cart"] span').filter({ hasText: '9+' })
    );
  }

  /**
   * Navega a la página principal donde se muestran los libros
   */
  async navigateToHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navega a la página del carrito
   */
  async navigateToCart() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Agrega el primer libro disponible al carrito
   * Asume que hay al menos un libro con stock disponible
   */
  async addFirstBookToCart() {
    // Esperar a que carguen los libros
    await this.page.waitForSelector('button[title="Añadir al carrito"]', { timeout: 10000 });
    
    // Usar JavaScript directo para hacer click en el primer botón
    await this.page.evaluate(() => {
      const button = document.querySelector('button[title="Añadir al carrito"]');
      if (button) {
        (button as HTMLElement).click();
      }
    });
    
    // Esperar a que se complete la acción
    await this.page.waitForTimeout(2000);
  }

  /**
   * Agrega un libro específico al carrito por su título
   */
  async addBookToCartByTitle(bookTitle: string) {
    // Encontrar el libro por título
    const bookCard = this.page.getByText(bookTitle).first();
    await bookCard.scrollIntoViewIfNeeded();
    
    // Encontrar el botón "Añadir" dentro de esa tarjeta
    const addButton = bookCard.locator('ancestor:has(button)').getByRole('button', { name: /añadir/i });
    await addButton.click({ force: true });
    
    // Esperar a que aparezca el mensaje de éxito
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verifica que el libro se agregó al carrito
   * Verifica que el contador del carrito aumentó
   */
  async expectBookAddedSuccess() {
    const currentCount = await this.getCartItemCount();
    expect(currentCount).toBeGreaterThan(0);
  }

  /**
   * Verifica que el carrito esté vacío
   */
  async expectCartEmpty() {
    await this.navigateToCart();
    await expect(this.emptyCartMessage).toBeVisible();
  }

  /**
   * Verifica que el carrito tenga items
   */
  async expectCartNotEmpty() {
    await this.navigateToCart();
    await expect(this.emptyCartMessage).not.toBeVisible();
  }

  /**
   * Obtiene el número de items en el carrito desde el navbar
   */
  async getCartItemCount(): Promise<number> {
    const countElement = this.cartItemCount.first();
    const isVisible = await countElement.isVisible().catch(() => false);
    
    if (!isVisible) {
      return 0;
    }
    
    const countText = await countElement.textContent();
    if (countText === '9+') {
      return 9;
    }
    return countText ? parseInt(countText, 10) : 0;
  }

  /**
   * Verifica que el contador del carrito haya aumentado
   */
  async expectCartItemCountIncreased(previousCount: number) {
    const newCount = await this.getCartItemCount();
    expect(newCount).toBeGreaterThan(previousCount);
  }

  /**
   * Smoke test completo: agregar un libro al carrito y verificar
   */
  async expectAddToCartSmokeComplete() {
    const previousCount = await this.getCartItemCount();
    await this.addFirstBookToCart();
    await this.expectBookAddedSuccess();
    await this.expectCartItemCountIncreased(previousCount);
  }
}
