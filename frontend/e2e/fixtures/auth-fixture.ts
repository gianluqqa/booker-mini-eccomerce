/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest } from './base-fixture';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';
import { AUTH_DATA } from '../data/auth-data';
import { generateUniqueEmail } from '../helpers/unique-data-generator';

interface AuthFixtures {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  registeredCustomer: { email: string; password: string };
}

/**
 * Fixture de autenticación que unifica login y registration.
 * Proporciona Page Objects para ambas páginas y un fixture
 * que crea un usuario registrado automáticamente.
 */
export const test = baseTest.extend<AuthFixtures>({
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  registeredCustomer: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    const email = generateUniqueEmail('auth.test');
    const password = AUTH_DATA.validPassword;

    await registerPage.navigateToRegistration();
    await registerPage.fillRegistrationForm({
      ...AUTH_DATA.validUserBase,
      email,
    });
    await registerPage.submitRegistrationForm();
    await registerPage.expectSuccessfulRegistration();
    await page.waitForURL('**/login', { timeout: 10000 });

    await use({ email, password });
  },
});

export { expect } from '@playwright/test';
