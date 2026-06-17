/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest, Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

interface AdminFixtures {
  adminLoginPage: LoginPage;
  authenticatedAdminPage: Page;
}

export const test = baseTest.extend<AdminFixtures>({
  adminLoginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedAdminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();

    await loginPage.fillLoginForm({
      email: 'admin@booker.com',
      password: 'TuPasswordSegura123!',
    });

    await loginPage.submitLoginForm();

    // Esperar redirección al panel admin (el login funciona correctamente según debug)
    await page.waitForURL('**/admin', {
      timeout: 30000,
    });

    // Validar que realmente estamos en el panel
    await expect(page).toHaveURL(/.*\/admin/);

    await expect(
      page.getByRole('heading', {
        name: /panel de administrador/i,
      })
    ).toBeVisible({
      timeout: 15000,
    });

    await use(page);
  },
});

export { expect };