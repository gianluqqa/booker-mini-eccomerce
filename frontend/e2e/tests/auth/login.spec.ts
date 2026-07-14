import { test, expect } from '../../fixtures/auth-fixture';
import { AUTH_DATA } from '../../data/auth-data';
import { generateUniqueEmail } from '../../helpers/unique-data-generator';

test.describe('Authentication - Module - Login', () => {

  test('Should login successfully with valid credentials @smoke', async ({ loginPage, registeredCustomer }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm({
      email: registeredCustomer.email,
      password: registeredCustomer.password,
    });
    await loginPage.submitLoginForm();
    await loginPage.expectLoginSmokeComplete();
  });

  test('Should logout successfully @smoke', async ({ loginPage, registeredCustomer, page }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm({
      email: registeredCustomer.email,
      password: registeredCustomer.password,
    });
    await loginPage.submitLoginForm();
    await loginPage.expectLoginSmokeComplete();

    const logoutButton = page.getByRole('button', { name: /cerrar sesión/i });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('link', { name: /acceder/i })).toBeVisible();
  });

  test('Should validate empty required fields @regression', async ({ loginPage }) => {
    await loginPage.navigateToLogin();
    await loginPage.submitLoginForm();

    const errors = AUTH_DATA.loginBlankFieldsValidationErrors;
    await expect(loginPage.getFieldErrorLocator('email')).toHaveText(errors.email);
    await expect(loginPage.getFieldErrorLocator('password')).toHaveText(errors.password);
  });

  test('Should validate empty email with password filled in @regression', async ({ loginPage }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm({ password: AUTH_DATA.validPassword });
    await loginPage.submitLoginForm();

    // Validar que aparece el error de email
    await expect(loginPage.getFieldErrorLocator('email')).toHaveText(
      AUTH_DATA.loginBlankFieldsValidationErrors.email
    );
  });

  test('Should validate empty password with email filled in @regression', async ({ loginPage }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm({ email: generateUniqueEmail('login.empty-password') });
    await loginPage.submitLoginForm();

    // Validar que aparece el error de contraseña
    await expect(loginPage.getFieldErrorLocator('password')).toHaveText(
      AUTH_DATA.loginBlankFieldsValidationErrors.password
    );
  });

  test('Should reject an email with invalid format @regression', async ({ loginPage }) => {
    await loginPage.navigateToLogin();

    for (const invalidEmail of AUTH_DATA.invalidEmailFormats) {
      await loginPage.clearForm();
      await loginPage.fillLoginForm({
        email: invalidEmail,
        password: AUTH_DATA.validPassword,
      });
      await loginPage.submitLoginForm();
      await loginPage.expectInvalidEmailRejected(AUTH_DATA.invalidEmail.errorMessage);
    }
  });

  test('Should reject credentials with a non-existent email @regression', async ({ loginPage }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm({
      email: generateUniqueEmail('login.nonexistent'),
      password: AUTH_DATA.validPassword,
    });
    await loginPage.submitLoginForm();

    await expect(loginPage.getFieldErrorLocator('password')).toHaveText(
      AUTH_DATA.invalidCredentials.errorMessage
    );
  });

  test('Should reject wrong password for an existing user @regression', async ({ loginPage, registeredCustomer }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm({
      email: registeredCustomer.email,
      password: 'WrongPassword123!',
    });
    await loginPage.submitLoginForm();

    await expect(loginPage.getFieldErrorLocator('password')).toHaveText(
      AUTH_DATA.invalidCredentials.errorMessage
    );
  });

  test('Should navigate to registration page when clicking the corresponding link @regression', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Regístrate aquí' }).click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole('heading', { name: 'Crear Cuenta' })).toBeVisible();
  });

  test('Should toggle password visibility with the Show/Hide button @regression', async ({ loginPage, page }) => {
    await loginPage.navigateToLogin();
    const passwordInput = page.locator('input#password');
    const toggleButton = page.getByRole('button', { name: /mostrar|ocultar/i });

    await loginPage.fillLoginForm({ password: 'MySecretPassword123!' });
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(toggleButton).toHaveText(/ocultar/i);

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleButton).toHaveText(/mostrar/i);
  });
});
