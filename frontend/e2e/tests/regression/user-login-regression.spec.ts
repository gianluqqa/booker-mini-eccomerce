import { test, expect } from '../../fixtures/user-login-fixtures';
import { USER_LOGIN_TEST_DATA } from '../../test-data/user-login-test-data';
import { generateUniqueEmail } from '../../utilities/unique-email-generator';

test.describe('Inicio de Sesión - Regression Suite @regression', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('Debería validar campos obligatorios vacíos', async ({ loginPage }) => {
    await loginPage.submitLoginForm();

    const errors = USER_LOGIN_TEST_DATA.blankFieldsValidationErrors;
    await expect(loginPage.getFieldErrorLocator('email')).toHaveText(errors.email);
    await expect(loginPage.getFieldErrorLocator('password')).toHaveText(errors.password);
  });

  test('Debería validar email vacío con contraseña completada', async ({ loginPage }) => {
    await loginPage.fillLoginForm({
      password: USER_LOGIN_TEST_DATA.validPassword,
    });
    await loginPage.submitLoginForm();

    await expect(loginPage.getFieldErrorLocator('email')).toHaveText(
      USER_LOGIN_TEST_DATA.blankFieldsValidationErrors.email
    );
    await expect(loginPage.getFieldErrorLocator('password')).not.toBeVisible();
  });

  test('Debería validar contraseña vacía con email completado', async ({ loginPage }) => {
    await loginPage.fillLoginForm({
      email: generateUniqueEmail('login.empty-password'),
    });
    await loginPage.submitLoginForm();

    await expect(loginPage.getFieldErrorLocator('password')).toHaveText(
      USER_LOGIN_TEST_DATA.blankFieldsValidationErrors.password
    );
    await expect(loginPage.getFieldErrorLocator('email')).not.toBeVisible();
  });

  test('Debería rechazar un email con formato inválido', async ({ loginPage }) => {
    for (const invalidEmail of USER_LOGIN_TEST_DATA.invalidEmailFormats) {
      await loginPage.clearForm();
      await loginPage.fillLoginForm({
        email: invalidEmail,
        password: USER_LOGIN_TEST_DATA.validPassword,
      });
      await loginPage.submitLoginForm();

      await loginPage.expectInvalidEmailRejected(USER_LOGIN_TEST_DATA.invalidEmail.errorMessage);
    }
  });

  test('Debería rechazar credenciales con email inexistente', async ({ loginPage }) => {
    await loginPage.fillLoginForm({
      email: generateUniqueEmail('login.nonexistent'),
      password: USER_LOGIN_TEST_DATA.validPassword,
    });
    await loginPage.submitLoginForm();

    await expect(loginPage.getFieldErrorLocator('password')).toHaveText(
      USER_LOGIN_TEST_DATA.invalidCredentials.errorMessage
    );
  });

  test('Debería rechazar contraseña incorrecta para un usuario existente', async ({
    loginPage,
    registeredCustomer,
  }) => {
    await loginPage.fillLoginForm({
      email: registeredCustomer.email,
      password: 'WrongPassword123!',
    });
    await loginPage.submitLoginForm();

    await expect(loginPage.getFieldErrorLocator('password')).toHaveText(
      USER_LOGIN_TEST_DATA.invalidCredentials.errorMessage
    );
  });

});
