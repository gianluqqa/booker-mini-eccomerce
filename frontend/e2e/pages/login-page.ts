import { Page, Locator, expect } from '@playwright/test';
import { UserLoginData } from '../data/auth-data';

/**
 * Page Object para la página de Login (/login).
 * Asociado al componente: src/app/login/page.tsx
 */
export class LoginPage {
  private readonly page: Page;

  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly globalErrorAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('input#email');
    this.passwordInput = page.locator('input#password');
    this.submitButton = page.locator('form button[type="submit"]');
    this.globalErrorAlert = page.locator('div.bg-red-50 p.text-red-600');
  }

  async navigateToLogin(): Promise<void> {
    const heading = this.page.getByRole('heading', { name: 'Iniciar Sesión' });
    const alreadyOnLogin = () => {
      try {
        return new URL(this.page.url()).pathname === '/login';
      } catch {
        return false;
      }
    };

    // Evita un segundo goto si ya estamos en /login (p. ej. tras el registro en registeredCustomer).
    // En Firefox/WebKit un goto duplicado provoca NS_BINDING_ABORTED o navegación interrumpida.
    if (!alreadyOnLogin()) {
      await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
    }

    await heading.waitFor({ state: 'visible' });
  }

  async fillLoginForm(data: UserLoginData): Promise<void> {
    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }
    if (data.password !== undefined) {
      await this.passwordInput.fill(data.password);
    }
  }

  async clearForm(): Promise<void> {
    await this.emailInput.fill('');
    await this.passwordInput.fill('');
  }

  async submitLoginForm(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  getFieldErrorLocator(fieldId: 'email' | 'password'): Locator {
    if (fieldId === 'email') {
      return this.page.locator('input#email ~ p.text-red-600');
    }
    return this.page.locator('div.relative:has(input#password) + p.text-red-600');
  }

  getGlobalErrorLocator(): Locator {
    return this.globalErrorAlert;
  }

  async expectSuccessfulLogin(): Promise<void> {
    const globalError = this.getGlobalErrorLocator();
    const profileReady = this.page.getByRole('button', { name: 'Editar Perfil' });
    const loadingButton = this.submitButton.filter({ hasText: 'Iniciando sesión...' });

    // WebKit puede completar el login antes de pintar "Iniciando sesión..." (estado muy breve).
    // Validamos cualquier señal observable de envío: carga, perfil o error.
    try {
      await expect(loadingButton.or(profileReady).or(globalError)).toBeVisible({ timeout: 25000 });
    } catch {
      throw new Error(
        'No se completó el inicio de sesión. Compruebe que el backend esté en http://localhost:5000 y que la base de datos esté activa.'
      );
    }

    if (await globalError.isVisible()) {
      const errorText = await globalError.textContent();
      throw new Error(`El login falló en pantalla: ${errorText?.trim() ?? 'error desconocido'}`);
    }

    await expect(profileReady).toBeVisible({ timeout: 15000 });
  }

  /**
   * Smoke: confirma que el usuario autenticado llegó al perfil y puede continuar.
   * No valida textos de carga, tiempos ni detalles de implementación.
   */
  async expectLoginSmokeComplete(): Promise<void> {
    const globalError = this.getGlobalErrorLocator();
    const profileReady = this.page.getByRole('button', { name: 'Editar Perfil' });

    try {
      await expect(profileReady.or(globalError)).toBeVisible({ timeout: 25000 });
    } catch {
      throw new Error(
        'El inicio de sesión no mostró un resultado visible. Compruebe que el backend y la base de datos estén activos.'
      );
    }

    if (await globalError.isVisible()) {
      const errorText = await globalError.textContent();
      throw new Error(`El login falló en pantalla: ${errorText?.trim() ?? 'error desconocido'}`);
    }

    await this.page.waitForURL('**/profile', { timeout: 15000 });
    await expect(profileReady).toBeVisible();
  }

  async expectInvalidEmailRejected(
    expectedMessage: string = 'El formato del email es inválido'
  ): Promise<void> {
    const messageLocator = this.page.getByText(expectedMessage, { exact: true });
    const fieldError = this.getFieldErrorLocator('email');
    const globalError = this.getGlobalErrorLocator();

    try {
      await expect(messageLocator.or(fieldError).or(globalError)).toBeVisible({ timeout: 15000 });
      return;
    } catch {
      const blockedByBrowser = await this.emailInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid && el.validationMessage.length > 0;
      });

      if (blockedByBrowser) {
        return;
      }

      throw new Error(
        `No se mostró ningún rechazo visible para el email inválido. Mensaje esperado: "${expectedMessage}".`
      );
    }
  }

  async expectProfilePageLoaded(): Promise<void> {
    await this.page.waitForURL('**/profile', { timeout: 15000 });
    await expect(this.page.getByRole('button', { name: 'Editar Perfil' })).toBeVisible();
  }
}
