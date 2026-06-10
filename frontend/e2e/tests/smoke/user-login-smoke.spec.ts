import { test, expect } from '../../fixtures/user-login-fixtures';

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

  test('Debería cerrar sesión exitosamente', async ({
    loginPage,
    registeredCustomer,
    page,
  }) => {
    await loginPage.navigateToLogin();

    await loginPage.fillLoginForm({
      email: registeredCustomer.email,
      password: registeredCustomer.password,
    });
    await loginPage.submitLoginForm();
    await loginPage.expectLoginSmokeComplete();

    // El botón de logout en Navbar (Desktop)
    const logoutButton = page.getByRole('button', { name: /cerrar sesión/i });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // Confirmar que se redirige a login tras cerrar sesión en una página protegida
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('link', { name: /acceder/i })).toBeVisible();
  });

});
