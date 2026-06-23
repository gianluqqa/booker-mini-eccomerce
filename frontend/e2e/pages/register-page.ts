import { Page, Locator, expect } from '@playwright/test';
import { UserRegistrationData } from '../test-data/user-registration-test-data';

/**
 * Page Object para la página de Registro (/register).
 * Asociado al componente: src/app/register/page.tsx
 *
 * Sigue el patrón de diseño Page Object Model (POM).
 */
export class RegisterPage {
  private readonly page: Page;

  // Form Locators (Inputs)
  private readonly nameInput: Locator;
  private readonly surnameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly addressInput: Locator;
  private readonly countryInput: Locator;
  private readonly cityInput: Locator;
  private readonly phoneInput: Locator;
  private readonly genderSelect: Locator;

  // Submit Button Locator
  private readonly submitButton: Locator;

  // Global Error Selector
  private readonly globalErrorAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    // Inicialización de selectores usando IDs y elementos semánticos
    this.nameInput = page.locator('input#name');
    this.surnameInput = page.locator('input#surname');
    this.emailInput = page.locator('input#email');
    this.passwordInput = page.locator('input#password');
    this.confirmPasswordInput = page.locator('input#confirmPassword');
    this.addressInput = page.locator('input#address');
    this.countryInput = page.locator('input#country');
    this.cityInput = page.locator('input#city');
    this.phoneInput = page.locator('input#phone');
    this.genderSelect = page.locator('select#gender');

    this.submitButton = page.locator('button[type="submit"]');
    this.globalErrorAlert = page.locator('div.bg-red-50 p.text-red-600');
  }

  /**
   * Navega a la ruta de registro.
   */
  async navigateToRegistration(): Promise<void> {
    await this.page.goto('/register');
    // Asegurarse de que el título esté visible para confirmar carga de la página
    await this.page.getByRole('heading', { name: 'Crear Cuenta' }).waitFor({ state: 'visible' });
  }

  /**
   * Rellena el formulario de registro con la información provista.
   * Utiliza condicionales para rellenar opcionalmente solo los campos indicados.
   *
   * @param data Datos del usuario a registrar
   */
  async fillRegistrationForm(data: UserRegistrationData): Promise<void> {
    if (data.name !== undefined) {
      await this.nameInput.fill(data.name);
    }
    if (data.surname !== undefined) {
      await this.surnameInput.fill(data.surname);
    }
    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }
    if (data.password !== undefined) {
      await this.passwordInput.fill(data.password);
    }
    if (data.confirmPassword !== undefined) {
      await this.confirmPasswordInput.fill(data.confirmPassword);
    }
    if (data.address !== undefined) {
      await this.addressInput.fill(data.address);
    }
    if (data.country !== undefined) {
      await this.countryInput.fill(data.country);
    }
    if (data.city !== undefined) {
      await this.cityInput.fill(data.city);
    }
    if (data.phone !== undefined) {
      await this.phoneInput.fill(data.phone);
    }
    if (data.gender !== undefined) {
      await this.genderSelect.selectOption(data.gender);
    }
  }

  /**
   * Limpia los campos principales del formulario.
   */
  async clearForm(): Promise<void> {
    await this.nameInput.fill('');
    await this.surnameInput.fill('');
    await this.emailInput.fill('');
    await this.passwordInput.fill('');
    await this.confirmPasswordInput.fill('');
    await this.addressInput.fill('');
    await this.countryInput.fill('');
    await this.cityInput.fill('');
    await this.phoneInput.fill('');
  }

  /**
   * Envía el formulario haciendo clic en el botón de registrarse.
   */
  async submitRegistrationForm(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  /**
   * Retorna el localizador del mensaje de validación de un campo específico.
   * Emplea un selector de hermano adyacente ('input#id ~ p') para máxima fiabilidad.
   *
   * @param fieldId ID del input del formulario ('name' | 'surname' | 'email' | 'password' | 'confirmPassword')
   */
  getFieldErrorLocator(fieldId: 'name' | 'surname' | 'email' | 'password' | 'confirmPassword'): Locator {
    return this.page.locator(`input#${fieldId} ~ p.text-red-600`);
  }

  /**
   * Retorna el localizador de la alerta de error global visible en pantalla.
   */
  getGlobalErrorLocator(): Locator {
    return this.globalErrorAlert;
  }

  /**
   * Retorna el localizador de la alerta de éxito.
   */
  getSuccessAlertLocator(): Locator {
    return this.page.getByRole('heading', { name: 'Cuenta creada con éxito' });
  }

  /**
   * Espera el resultado exitoso visible tras enviar el formulario de registro.
   */
  async expectSuccessfulRegistration(): Promise<void> {
    const successAlert = this.getSuccessAlertLocator();
    const globalError = this.getGlobalErrorLocator();
    const registrationOutcome = successAlert.or(globalError);

    try {
      await expect(registrationOutcome).toBeVisible({ timeout: 25000 });
    } catch {
      throw new Error(
        'No apareció la alerta de éxito. Compruebe que el backend esté en http://localhost:5000 y que la base de datos esté activa.'
      );
    }

    if (await globalError.isVisible()) {
      const errorText = await globalError.textContent();
      throw new Error(`El registro falló en pantalla: ${errorText?.trim() ?? 'error desconocido'}`);
    }

    await expect(successAlert).toBeVisible();
  }

  /**
   * Smoke: confirma que el registro completó el flujo crítico (éxito → pantalla de login).
   * No valida textos de carga, tiempos ni detalles de implementación.
   */
  async expectRegistrationSmokeComplete(): Promise<void> {
    const loginReady = this.page.getByRole('heading', { name: 'Iniciar Sesión' });
    const registrationSucceeded = this.page.getByText('Cuenta creada con éxito');
    const globalError = this.getGlobalErrorLocator();

    try {
      await expect(registrationSucceeded.or(loginReady).or(globalError)).toBeVisible({ timeout: 30000 });
    } catch {
      throw new Error(
        'El registro no mostró un resultado visible. Compruebe que el backend y la base de datos estén activos.'
      );
    }

    if (await globalError.isVisible()) {
      const errorText = await globalError.textContent();
      throw new Error(`El registro falló en pantalla: ${errorText?.trim() ?? 'error desconocido'}`);
    }

    if (!(await loginReady.isVisible())) {
      await this.page.waitForURL('**/login', { timeout: 20000 });
    }

    await loginReady.waitFor({ state: 'visible' });
  }

  /**
   * Verifica que un email con formato inválido sea rechazado de forma visible para el usuario.
   * Cubre mensaje en campo, alerta global o bloqueo nativo del input type="email".
   */
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

  /**
   * Retorna la URL actual en el navegador.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}
