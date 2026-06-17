import { test, expect } from '../../fixtures/admin-fixtures';
import { test as customerTest } from '../../fixtures/user-login-fixtures';

test.describe('Creación de Libros (Admin) - Regression Suite @regression @admin-book', () => {

  test('Debería rechazar valores inválidos (precio <= 0, stock < 0, descripción < 10, espacios)', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;

    // Rellenar con datos que activan las validaciones de JS
    await page.locator('input#title').fill('   '); // Solo espacios
    await page.locator('input#author').fill('   '); // Solo espacios
    await page.locator('input#price').fill('0'); // Precio <= 0
    await page.locator('input#stock').fill('-10'); // Stock < 0
    await page.locator('select#genre').selectOption('Fantasía');
    await page.locator('textarea#description').fill('Corta'); // Menos de 10 caracteres

    // Desactivar temporalmente la validación HTML5 para permitir que React maneje y muestre sus propios errores
    await page.locator('form').evaluate((form: HTMLFormElement) => form.noValidate = true);

    // Intentar enviar el formulario
    await page.getByRole('button', { name: 'Crear libro', exact: true }).click();

    // Validar que se muestren mensajes de error específicos por pantalla
    await expect(page.getByText('El título es requerido')).toBeVisible();
    await expect(page.getByText('El autor es requerido')).toBeVisible();
    await expect(page.getByText('El precio debe ser un número mayor a 0')).toBeVisible();
    await expect(page.getByText('El stock debe ser un número entero mayor o igual a 0')).toBeVisible();
    await expect(page.getByText('La descripción debe tener al menos 10 caracteres')).toBeVisible();
  });

  test('Debería activar validación nativa del navegador cuando el formulario esté vacío', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;

    // Asegurarse de que el formulario esté limpio y enviar
    await page.getByRole('button', { name: 'Crear libro', exact: true }).click();

    // Evaluar que el input de título sea inválido nativamente en el navegador (bloqueado por required)
    const isTitleInvalid = await page.locator('input#title').evaluate((el: HTMLInputElement) => {
      return !el.validity.valid && el.validationMessage.length > 0;
    });

    expect(isTitleInvalid).toBe(true);
  });

  test('Debería redirigir al login a un visitante anónimo que intente entrar al panel', async ({ page }) => {
    // Intentar entrar directamente a /admin sin sesión
    await page.goto('/admin');

    // Confirmar que redirige a login
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  });

});

// Suite separada usando el fixture de cliente normal registrado
customerTest.describe('Creación de Libros (Admin) - Restricción de Acceso @regression @admin-book', () => {

  customerTest('Debería redirigir al login a un cliente común que intente entrar al panel', async ({ loginPage, registeredCustomer, page }) => {
    // 1. Iniciar sesión como cliente normal
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm({
      email: registeredCustomer.email,
      password: registeredCustomer.password,
    });
    await loginPage.submitLoginForm();
    await loginPage.expectLoginSmokeComplete();

    // 2. Intentar navegar directamente a /admin
    await page.goto('/admin');

    // 3. Debería ser redirigido de regreso a /login (o a su perfil ya que no es admin)
    // El useEffect en AdminDashboard hace router.push('/login')
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  });

});
