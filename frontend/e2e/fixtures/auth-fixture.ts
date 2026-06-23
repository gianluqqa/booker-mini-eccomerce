/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest } from './base-fixture';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';
import { AUTH_DATA } from '../data/auth-data';
import { generateUniqueEmail } from '../helpers/unique-data-generator';

/**
 * FIXTURE DE AUTENTICACIÓN (AUTH)
 * 
 * ¿Qué nos da este fixture?
 * - Page Objects para login y registro ya preparados
 * - Un usuario ya registrado automáticamente (registeredCustomer)
 * 
 * ¿Por qué es útil?
 * - No tenemos que crear usuarios manualmente en cada test
 * - Los Page Objects ya están inicializados y listos para usar
 * - Ahorra tiempo y reduce código duplicado
 * 
 * ¿Qué nos da?
 * 1. registerPage: Page Object para la página de registro
 * 2. loginPage: Page Object para la página de login
 * 3. registeredCustomer: Un usuario ya registrado con email y contraseña
 */

// Definimos qué nos va a dar este fixture
interface AuthFixtures {
  registerPage: RegisterPage;      // Page Object de registro
  loginPage: LoginPage;            // Page Object de login
  registeredCustomer: {            // Usuario ya registrado
    email: string;                 // Email del usuario
    password: string;              // Contraseña del usuario
  };
}

/**
 * Extendemos el test base para agregar nuestros fixtures personalizados
 * 
 * ¿Qué hace extend?
 * - Toma el test original de Playwright
 * - Le agrega nuestras herramientas personalizadas
 * - Devuelve un test mejorado con nuestras funcionalidades
 */
export const test = baseTest.extend<AuthFixtures>({
  
  /**
   * FIXTURE: registerPage
   * 
   * ¿Qué hace?
   * - Crea una instancia de RegisterPage
   * - La pone a disposición del test
   * 
   * ¿Cómo se usa en un test?
   * test('mi test', async ({ registerPage }) => {
   *   await registerPage.navigateToRegistration();
   * });
   */
  registerPage: async ({ page }, use) => {
    // Creamos el Page Object de registro
    const registerPage = new RegisterPage(page);
    
    // Lo ponemos a disposición del test
    await use(registerPage);
  },

  /**
   * FIXTURE: loginPage
   * 
   * ¿Qué hace?
   * - Crea una instancia de LoginPage
   * - La pone a disposición del test
   * 
   * ¿Cómo se usa en un test?
   * test('mi test', async ({ loginPage }) => {
   *   await loginPage.navigateToLogin();
   * });
   */
  loginPage: async ({ page }, use) => {
    // Creamos el Page Object de login
    const loginPage = new LoginPage(page);
    
    // Lo ponemos a disposición del test
    await use(loginPage);
  },

  /**
   * FIXTURE: registeredCustomer
   * 
   * ¿Qué hace?
   * - Registra automáticamente un usuario nuevo
   * - Nos da el email y contraseña para usar en tests de login
   * 
   * ¿Por qué es útil?
   * - No tenemos que registrar usuarios manualmente
   * - Cada test tiene un usuario único (evita duplicados)
   * - Ahorra tiempo en la ejecución de tests
   * 
   * ¿Cómo funciona?
   * PASO 1: Genera un email único con timestamp
   * PASO 2: Llena el formulario de registro
   * PASO 3: Envía el formulario
   * PASO 4: Espera a que el registro sea exitoso
   * PASO 5: Devuelve email y contraseña para usar en el test
   * 
   * ¿Cómo se usa en un test?
   * test('login test', async ({ loginPage, registeredCustomer }) => {
   *   await loginPage.fillLoginForm({
   *     email: registeredCustomer.email,
   *     password: registeredCustomer.password,
   *   });
   * });
   */
  registeredCustomer: async ({ page }, use) => {
    // PASO 1: Preparamos el Page Object de registro
    const registerPage = new RegisterPage(page);
    
    // PASO 2: Generamos un email único para este test
    const email = generateUniqueEmail('auth.test');
    const password = AUTH_DATA.validPassword;

    // PASO 3: Navegamos a la página de registro
    await registerPage.navigateToRegistration();
    
    // PASO 4: Llenamos el formulario con los datos
    await registerPage.fillRegistrationForm({
      ...AUTH_DATA.validUserBase,
      email,
    });
    
    // PASO 5: Enviamos el formulario
    await registerPage.submitRegistrationForm();
    
    // PASO 6: Esperamos a que el registro sea exitoso
    await registerPage.expectSuccessfulRegistration();
    
    // PASO 7: Esperamos a que nos redirija a login
    await page.waitForURL('**/login', { timeout: 10000 });

    // PASO 8: Devolvemos las credenciales para usar en el test
    await use({ email, password });
  },
});

// Exportamos expect para poder usarlo en los tests
export { expect } from '@playwright/test';
