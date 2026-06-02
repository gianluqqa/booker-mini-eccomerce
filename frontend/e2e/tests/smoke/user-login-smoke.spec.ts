import { test } from '../../fixtures/user-login-fixtures';

test.describe('Inicio de Sesión - Smoke Suite @smoke', () => {

  test('Debería iniciar sesión exitosamente con credenciales válidas', async ({
    loginPage,
    registeredCustomer,
  }) => {
    await loginPage.navigateToLogin();

    await loginPage.fillLoginForm({
      email: registeredCustomer.email,
      password: registeredCustomer.password,
    });
    await loginPage.submitLoginForm();

    // Flujo crítico: sesión iniciada y el usuario puede continuar en su perfil
    await loginPage.expectLoginSmokeComplete();
  });

});
