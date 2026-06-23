import { test, expect } from '../../fixtures/auth-fixture';
import { AUTH_DATA } from '../../data/auth-data';
import { generateUniqueEmail } from '../../helpers/unique-data-generator';

test.describe('Registro de Usuario', () => {

  test('Debería registrar un usuario exitosamente @smoke', async ({ registerPage }) => {
    await registerPage.navigateToRegistration();

    const newUser = {
      ...AUTH_DATA.validUserBase,
      email: generateUniqueEmail(),
    };

    await registerPage.fillRegistrationForm(newUser);
    await registerPage.submitRegistrationForm();
    await registerPage.expectRegistrationSmokeComplete();
  });

  test('Debería validar campos obligatorios vacíos @regression', async ({ registerPage }) => {
    await registerPage.navigateToRegistration();
    await registerPage.submitRegistrationForm();

    const errors = AUTH_DATA.blankFieldsValidationErrors;
    
    await expect(registerPage.getFieldErrorLocator('name')).toHaveText(errors.name);
    await expect(registerPage.getFieldErrorLocator('surname')).toHaveText(errors.surname);
    await expect(registerPage.getFieldErrorLocator('email')).toHaveText(errors.email);
    await expect(registerPage.getFieldErrorLocator('password')).toHaveText(errors.password);
    await expect(registerPage.getFieldErrorLocator('confirmPassword')).toHaveText(errors.confirmPassword);
  });

  test('Debería validar contraseñas que no coinciden @regression', async ({ registerPage }) => {
    await registerPage.navigateToRegistration();

    const userWithMismatchedPassword = {
      ...AUTH_DATA.validUserBase,
      email: generateUniqueEmail(),
      password: AUTH_DATA.mismatchedPasswords.password,
      confirmPassword: AUTH_DATA.mismatchedPasswords.confirmPassword,
    };

    await registerPage.fillRegistrationForm(userWithMismatchedPassword);
    await registerPage.submitRegistrationForm();

    const expectedError = AUTH_DATA.mismatchedPasswords.errorMessage;
    await expect(registerPage.getFieldErrorLocator('confirmPassword')).toHaveText(expectedError);
  });

  test('Debería validar contraseñas débiles @regression', async ({ registerPage }) => {
    await registerPage.navigateToRegistration();
    const baseUser = { ...AUTH_DATA.validUserBase, email: generateUniqueEmail() };

    await registerPage.fillRegistrationForm({
      ...baseUser,
      password: AUTH_DATA.weakPasswords.noUppercase.password,
      confirmPassword: AUTH_DATA.weakPasswords.noUppercase.confirmPassword,
    });
    await registerPage.submitRegistrationForm();
    await expect(registerPage.getFieldErrorLocator('password')).toHaveText(
      AUTH_DATA.weakPasswords.noUppercase.errorMessage
    );

    await registerPage.clearForm();
    await registerPage.fillRegistrationForm({
      ...baseUser,
      password: AUTH_DATA.weakPasswords.tooShort.password,
      confirmPassword: AUTH_DATA.weakPasswords.tooShort.confirmPassword,
    });
    await registerPage.submitRegistrationForm();
    await expect(registerPage.getFieldErrorLocator('password')).toHaveText(
      AUTH_DATA.weakPasswords.tooShort.errorMessage
    );
  });

  test('Debería rechazar un email con formato inválido @regression', async ({ registerPage }) => {
    await registerPage.navigateToRegistration();
    const baseUser = { ...AUTH_DATA.validUserBase, password: 'Password123!', confirmPassword: 'Password123!' };

    for (const invalidEmail of AUTH_DATA.invalidEmailFormats) {
      await registerPage.clearForm();
      await registerPage.fillRegistrationForm({ ...baseUser, email: invalidEmail });
      await registerPage.submitRegistrationForm();
      await registerPage.expectInvalidEmailRejected(AUTH_DATA.invalidEmail.errorMessage);
    }
  });

  test('Debería mostrar error al intentar registrar un correo electrónico ya existente @regression', async ({ registerPage }) => {
    const duplicateEmail = generateUniqueEmail('duplicate.test');
    const userToRegister = { ...AUTH_DATA.validUserBase, email: duplicateEmail };

    // Primer registro exitoso
    await registerPage.navigateToRegistration();
    await registerPage.fillRegistrationForm(userToRegister);
    await registerPage.submitRegistrationForm();
    await registerPage.expectSuccessfulRegistration();

    // Navegar nuevamente a registro para intentar duplicar
    await registerPage.navigateToRegistration();
    await registerPage.fillRegistrationForm(userToRegister);
    await registerPage.submitRegistrationForm();

    const emailError = registerPage.getFieldErrorLocator('email');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(AUTH_DATA.duplicateEmail.errorMessage);
  });

  test('Debería registrar un usuario exitosamente completando solo campos obligatorios @regression', async ({ registerPage }) => {
    await registerPage.navigateToRegistration();

    const onlyMandatoryUser = {
      name: 'MandatoryOnly',
      surname: 'QAUser',
      email: generateUniqueEmail('mandatory.only'),
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    await registerPage.fillRegistrationForm(onlyMandatoryUser);
    await registerPage.submitRegistrationForm();
    await registerPage.expectSuccessfulRegistration();
  });

  test('Debería navegar a la página de inicio de sesión al hacer clic en el enlace correspondiente @regression', async ({ registerPage, page }) => {
    await registerPage.navigateToRegistration();
    await page.getByRole('link', { name: 'Inicia sesión aquí' }).click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  });
});
