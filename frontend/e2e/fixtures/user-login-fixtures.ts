import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { RegisterPage } from '../pages/register-page';
import { USER_REGISTRATION_TEST_DATA } from '../test-data/user-registration-test-data';
import { generateUniqueEmail } from '../utilities/unique-email-generator';

export interface RegisteredCustomerCredentials {
  email: string;
  password: string;
}

interface CustomFixtures {
  loginPage: LoginPage;
  registeredCustomer: RegisteredCustomerCredentials;
}

export const test = baseTest.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  registeredCustomer: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    const email = generateUniqueEmail('login.test');
    const password = USER_REGISTRATION_TEST_DATA.validUserBase.password;

    await registerPage.navigateToRegistration();
    await registerPage.fillRegistrationForm({
      ...USER_REGISTRATION_TEST_DATA.validUserBase,
      email,
    });
    await registerPage.submitRegistrationForm();
    await registerPage.expectSuccessfulRegistration();
    await page.waitForURL('**/login', { timeout: 10000 });
    await page.getByRole('heading', { name: 'Iniciar Sesión' }).waitFor({ state: 'visible' });

    await use({ email, password });
  },
});

export { expect } from '@playwright/test';
