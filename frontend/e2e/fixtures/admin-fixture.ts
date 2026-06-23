/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest } from './base-fixture';
import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ADMIN_DATA } from '../data/admin-data';
import { ensureAdminHelper } from '../helpers/ensure-admin-helper';

/**
 * FIXTURE DE ADMINISTRACIÓN (ADMIN)
 * 
 * ¿Qué nos da este fixture?
 * - LoginPage para hacer login como admin
 * - Una página ya autenticada como admin (authenticatedAdminPage)
 * 
 * ¿Por qué es útil?
 * - No tenemos que hacer login manualmente en cada test de admin
 * - El usuario admin se crea automáticamente si no existe
 * - La página ya está en el panel de admin lista para usar
 * 
 * ¿Qué nos da?
 * 1. adminLoginPage: Page Object de login para usar con credenciales de admin
 * 2. authenticatedAdminPage: Página ya autenticada como admin, lista para usar
 */

// Definimos qué nos va a dar este fixture
interface AdminFixtures {
  adminLoginPage: LoginPage;        // Page Object de login
  authenticatedAdminPage: Page;     // Página ya autenticada como admin
}

/**
 * Extendemos el test base para agregar nuestros fixtures personalizados
 */
export const test = baseTest.extend<AdminFixtures>({
  
  /**
   * FIXTURE: adminLoginPage
   * 
   * ¿Qué hace?
   * - Crea una instancia de LoginPage
   * - La pone a disposición del test
   * 
   * ¿Cómo se usa en un test?
   * test('mi test', async ({ adminLoginPage }) => {
   *   await adminLoginPage.fillLoginForm(ADMIN_DATA.credentials);
   * });
   */
  adminLoginPage: async ({ page }, use) => {
    // Creamos el Page Object de login
    const loginPage = new LoginPage(page);
    
    // Lo ponemos a disposición del test
    await use(loginPage);
  },

  /**
   * FIXTURE: authenticatedAdminPage
   * 
   * ¿Qué hace?
   * - Asegura que exista el usuario admin en la base de datos
   * - Hace login automáticamente con las credenciales de admin
   * - Espera a que la página cargue el panel de admin
   * - Devuelve la página ya autenticada y lista para usar
   * 
   * ¿Por qué es útil?
   * - No tenemos que crear el admin manualmente
   * - No tenemos que hacer login en cada test
   - La página ya está en el panel de admin lista para usar
   * 
   * ¿Cómo funciona?
   * PASO 1: Asegura que exista el usuario admin (si no existe, lo crea)
   * PASO 2: Navega a la página de login
   * PASO 3: Llena el formulario con las credenciales de admin
   * PASO 4: Envía el formulario
   * PASO 5: Espera a que nos redirija al panel de admin
   * PASO 6: Verifica que realmente estamos en el panel de admin
   * PASO 7: Devuelve la página ya autenticada
   * 
   * ¿Cómo se usa en un test?
   * test('crear libro', async ({ authenticatedAdminPage }) => {
   *   const page = authenticatedAdminPage;
   *   await page.locator('input#title').fill('Mi Libro');
   *   // Ya estamos logueados como admin
   * });
   */
  authenticatedAdminPage: async ({ page }, use) => {
    // PASO 1: Aseguramos que exista el usuario admin
    // Si no existe, el helper lo crea automáticamente
    await ensureAdminHelper();

    // PASO 2: Preparamos el Page Object de login
    const loginPage = new LoginPage(page);
    
    // PASO 3: Navegamos a la página de login
    await loginPage.navigateToLogin();
    
    // PASO 4: Llenamos el formulario con las credenciales de admin
    await loginPage.fillLoginForm(ADMIN_DATA.credentials);
    
    // PASO 5: Enviamos el formulario
    await loginPage.submitLoginForm();
    
    // PASO 6: Esperamos a que nos redirija al panel de admin
    await page.waitForURL('**/admin', { timeout: 30000 });
    
    // PASO 7: Verificamos que realmente estamos en el panel de admin
    await expect(page).toHaveURL(/.*\/admin/);
    await expect(page.getByRole('heading', { name: /panel de administrador/i })).toBeVisible();

    // PASO 8: Devolvemos la página ya autenticada
    await use(page);
  },
});

// Exportamos expect para poder usarlo en los tests
export { expect };
