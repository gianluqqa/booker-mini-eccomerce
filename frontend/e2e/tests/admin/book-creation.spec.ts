import { test, expect } from '../../fixtures/admin-fixture';
import { test as customerTest } from '../../fixtures/auth-fixture';
import { generateUniqueTitle } from '../../helpers/unique-data-generator';

test.describe('Creación de Libros (Admin)', () => {

  test('Debería crear un libro exitosamente @smoke', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;
    const uniqueTitle = generateUniqueTitle('Booker Test Book');

    await page.locator('input#title').fill(uniqueTitle);
    await page.locator('input#author').fill('T. Booker');
    await page.locator('input#price').fill('25.99');
    await page.locator('input#stock').fill('50');
    await page.locator('select#genre').selectOption('Fantasía');
    await page.locator('input#image').fill('https://picsum.photos/200/300');
    await page.locator('textarea#intro').fill('Introducción del libro de prueba Booker.');
    await page.locator('textarea#description').fill('Esta es una descripción detallada de al menos diez caracteres para el libro de prueba.');

    await page.getByRole('button', { name: 'Crear libro', exact: true }).click();

    await expect(page.locator('input#title')).toHaveValue('', { timeout: 15000 });
    await expect(page.locator('input#author')).toHaveValue('');
    await expect(page.locator('input#price')).toHaveValue('');
    await expect(page.locator('input#stock')).toHaveValue('');
    await expect(page.locator('textarea#description')).toHaveValue('');
  });

  test('Debería rechazar valores inválidos @regression', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;

    await page.locator('input#title').fill('   ');
    await page.locator('input#author').fill('   ');
    await page.locator('input#price').fill('0');
    await page.locator('input#stock').fill('-10');
    await page.locator('select#genre').selectOption('Fantasía');
    await page.locator('textarea#description').fill('Corta');

    await page.locator('form').evaluate((form: HTMLFormElement) => form.noValidate = true);
    await page.getByRole('button', { name: 'Crear libro', exact: true }).click();

    await expect(page.getByText('El título es requerido')).toBeVisible();
    await expect(page.getByText('El autor es requerido')).toBeVisible();
    await expect(page.getByText('El precio debe ser un número mayor a 0')).toBeVisible();
    await expect(page.getByText('El stock debe ser un número entero mayor o igual a 0')).toBeVisible();
    await expect(page.getByText('La descripción debe tener al menos 10 caracteres')).toBeVisible();
  });

  test('Debería activar validación nativa del navegador cuando el formulario esté vacío @regression', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;

    await page.getByRole('button', { name: 'Crear libro', exact: true }).click();

    const isTitleInvalid = await page.locator('input#title').evaluate((el: HTMLInputElement) => {
      return !el.validity.valid && el.validationMessage.length > 0;
    });

    expect(isTitleInvalid).toBe(true);
  });

  test('Debería redirigir al login a un visitante anónimo que intente entrar al panel @regression', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  });
});

customerTest.describe('Creación de Libros (Admin) - Restricción de Acceso', () => {

  customerTest('Debería redirigir al login a un cliente común que intente entrar al panel @regression', async ({ loginPage, registeredCustomer, page }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillLoginForm({
      email: registeredCustomer.email,
      password: registeredCustomer.password,
    });
    await loginPage.submitLoginForm();
    await loginPage.expectLoginSmokeComplete();

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  });
});
