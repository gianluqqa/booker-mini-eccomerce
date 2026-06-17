import { test, expect } from '../../fixtures/admin-fixtures';

test.describe('Creación de Libros (Admin) - Smoke Suite @smoke @admin-book', () => {

  test('Debería crear un libro exitosamente', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;

    // Generar un título único para evitar colisiones en la DB
    const uniqueTitle = `Booker Test Book ${Date.now()}`;
    const author = 'T. Booker';
    const price = '25.99';
    const stock = '50';
    const genre = 'Fantasía';
    const image = 'https://picsum.photos/200/300';
    const intro = 'Introducción del libro de prueba Booker.';
    const description = 'Esta es una descripción detallada de al menos diez caracteres para el libro de prueba.';

    // Rellenar formulario de creación de libro
    await page.locator('input#title').fill(uniqueTitle);
    await page.locator('input#author').fill(author);
    await page.locator('input#price').fill(price);
    await page.locator('input#stock').fill(stock);
    await page.locator('select#genre').selectOption(genre);
    await page.locator('input#image').fill(image);
    await page.locator('textarea#intro').fill(intro);
    await page.locator('textarea#description').fill(description);

    // Enviar formulario
    await page.getByRole('button', { name: 'Crear libro', exact: true }).click();

    // Validar que el formulario se limpia (evidencia observable de éxito)
    await expect(page.locator('input#title')).toHaveValue('', { timeout: 15000 });
    await expect(page.locator('input#author')).toHaveValue('');
    await expect(page.locator('input#price')).toHaveValue('');
    await expect(page.locator('input#stock')).toHaveValue('');
    await expect(page.locator('textarea#description')).toHaveValue('');
  });

});
