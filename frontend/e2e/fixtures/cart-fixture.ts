/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest } from './base-fixture';
import { CartPage } from '../pages/cart-page';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';
import { AUTH_DATA } from '../data/auth-data';
import { generateUniqueEmail } from '../helpers/unique-data-generator';

/**
 * FIXTURE DE CARRITO (CART)
 * 
 * ¿Qué nos da este fixture?
 * - Page Object para el carrito ya preparado
 * - Un usuario ya registrado y autenticado
 * - Acceso directo a la página de inicio para agregar libros
 * 
 * ¿Por qué es útil?
 * - No tenemos que crear usuarios ni autenticarnos manualmente
 * - El Page Object ya está inicializado y listo para usar
 * - Ahorra tiempo y reduce código duplicado
 * 
 * ¿Qué nos da?
 * 1. cartPage: Page Object para el carrito
 * 2. authenticatedCustomer: Un usuario ya registrado y autenticado
 */

// Definimos qué nos va a dar este fixture
interface CartFixtures {
  cartPage: CartPage;              // Page Object del carrito
  authenticatedCustomer: {         // Usuario autenticado
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
export const test = baseTest.extend<CartFixtures>({
  
  /**
   * FIXTURE: cartPage
   * 
   * ¿Qué hace?
   * - Crea una instancia de CartPage
   * - La pone a disposición del test
   * 
   * ¿Cómo se usa en un test?
   * test('mi test', async ({ cartPage }) => {
   *   await cartPage.navigateToHome();
   * });
   */
  cartPage: async ({ page }, use) => {
    // Creamos el Page Object del carrito
    const cartPage = new CartPage(page);
    
    // Lo ponemos a disposición del test
    await use(cartPage);
  },

  /**
   * FIXTURE: authenticatedCustomer
   * 
   * ¿Qué hace?
   * - Registra automáticamente un usuario nuevo
   * - Lo autentica automáticamente
   * - Nos da el email y contraseña para usar en tests
   * 
   * ¿Por qué es útil?
   * - No tenemos que registrar ni autenticar usuarios manualmente
   * - Cada test tiene un usuario único (evita duplicados)
   * - Ahorra tiempo en la ejecución de tests
   * 
   * ¿Cómo funciona?
   * PASO 1: Genera un email único con timestamp
   * PASO 2: Llena el formulario de registro
   * PASO 3: Envía el formulario
   * PASO 4: Espera a que el registro sea exitoso
   * PASO 5: Navega a login
   * PASO 6: Llena el formulario de login
   * PASO 7: Envía el formulario de login
   * PASO 8: Espera a que el login sea exitoso
   * PASO 9: Devuelve email y contraseña para usar en el test
   * 
   * ¿Cómo se usa en un test?
   * test('cart test', async ({ cartPage, authenticatedCustomer }) => {
   *   await cartPage.addFirstBookToCart();
   * });
   */
  authenticatedCustomer: async ({ page }, use) => {
    // PASO 1: Preparamos los Page Objects
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    
    // PASO 2: Generamos un email único para este test
    const email = generateUniqueEmail('cart.test');
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

    // PASO 8: Autenticamos al usuario
    await loginPage.fillLoginForm({
      email,
      password,
    });
    await loginPage.submitLoginForm();
    await loginPage.expectLoginSmokeComplete();

    // PASO 9: Devolvemos las credenciales para usar en el test
    await use({ email, password });
  },
});

// Exportamos expect para poder usarlo en los tests
export { expect } from '@playwright/test';
