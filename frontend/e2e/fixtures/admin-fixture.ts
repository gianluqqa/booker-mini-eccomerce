/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest } from './base-fixture';
import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ADMIN_DATA } from '../data/admin-data';
import { ensureAdminHelper } from '../helpers/ensure-admin-helper';

interface AdminFixtures {
  adminLoginPage: LoginPage;
  authenticatedAdminPage: Page;
}

/**
 * Fixture de administración que proporciona:
 * - adminLoginPage: Page Object de login para usar con credenciales de admin
 * - authenticatedAdminPage: Página ya autenticada como admin, lista para usar
 */
export const test = baseTest.extend<AdminFixtures>({
  adminLoginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedAdminPage: async ({ page }, use) => {
    await ensureAdminHelper();

    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm(ADMIN_DATA.credentials);
    await loginPage.submitLoginForm();
    await page.waitForURL('**/admin', { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/admin/);
    await expect(page.getByRole('heading', { name: /panel de administrador/i })).toBeVisible();

    await use(page);
  },
});

export { expect };
