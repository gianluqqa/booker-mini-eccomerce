import { test, expect } from '../../fixtures/user-registration-fixtures';
import { USER_REGISTRATION_TEST_DATA } from '../../test-data/user-registration-test-data';
import { generateUniqueEmail } from '../../utilities/unique-email-generator';

test.describe('Registro de Usuario - Regression Suite @regression', () => {

  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.navigateToRegistration();
  });

  test('Debería validar campos obligatorios vacíos', async ({ registrationPage }) => {
    // Intentar enviar el formulario en blanco
    await registrationPage.submitRegistrationForm();

    // Validar mensajes de error específicos por campo (valida lógica de frontend)
    const errors = USER_REGISTRATION_TEST_DATA.blankFieldsValidationErrors;
    
    await expect(registrationPage.getFieldErrorLocator('name')).toHaveText(errors.name);
    await expect(registrationPage.getFieldErrorLocator('surname')).toHaveText(errors.surname);
    await expect(registrationPage.getFieldErrorLocator('email')).toHaveText(errors.email);
    await expect(registrationPage.getFieldErrorLocator('password')).toHaveText(errors.password);
    await expect(registrationPage.getFieldErrorLocator('confirmPassword')).toHaveText(errors.confirmPassword);
  });

  test('Debería validar contraseñas que no coinciden', async ({ registrationPage }) => {
    const userWithMismatchedPassword = {
      ...USER_REGISTRATION_TEST_DATA.validUserBase,
      email: generateUniqueEmail(),
      password: USER_REGISTRATION_TEST_DATA.mismatchedPasswords.password,
      confirmPassword: USER_REGISTRATION_TEST_DATA.mismatchedPasswords.confirmPassword,
    };

    await registrationPage.fillRegistrationForm(userWithMismatchedPassword);
    await registrationPage.submitRegistrationForm();

    // Aserción del mensaje de error de confirmación
    const expectedError = USER_REGISTRATION_TEST_DATA.mismatchedPasswords.errorMessage;
    await expect(registrationPage.getFieldErrorLocator('confirmPassword')).toHaveText(expectedError);
  });

  test('Debería validar contraseñas débiles (sin mayúsculas, cortas, etc.)', async ({ registrationPage }) => {
    const baseUser = {
      ...USER_REGISTRATION_TEST_DATA.validUserBase,
      email: generateUniqueEmail(),
    };

    // Caso 1: Sin mayúscula
    await registrationPage.fillRegistrationForm({
      ...baseUser,
      password: USER_REGISTRATION_TEST_DATA.weakPasswords.noUppercase.password,
      confirmPassword: USER_REGISTRATION_TEST_DATA.weakPasswords.noUppercase.confirmPassword,
    });
    await registrationPage.submitRegistrationForm();
    await expect(registrationPage.getFieldErrorLocator('password')).toHaveText(
      USER_REGISTRATION_TEST_DATA.weakPasswords.noUppercase.errorMessage
    );

    // Limpiar formulario y rellenar Caso 2: Muy corta
    await registrationPage.clearForm();
    await registrationPage.fillRegistrationForm({
      ...baseUser,
      password: USER_REGISTRATION_TEST_DATA.weakPasswords.tooShort.password,
      confirmPassword: USER_REGISTRATION_TEST_DATA.weakPasswords.tooShort.confirmPassword,
    });
    await registrationPage.submitRegistrationForm();
    await expect(registrationPage.getFieldErrorLocator('password')).toHaveText(
      USER_REGISTRATION_TEST_DATA.weakPasswords.tooShort.errorMessage
    );
  });

  test('Debería rechazar un email con formato inválido', async ({ registrationPage }) => {
    const baseUser = {
      ...USER_REGISTRATION_TEST_DATA.validUserBase,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    for (const invalidEmail of USER_REGISTRATION_TEST_DATA.invalidEmailFormats) {
      await registrationPage.clearForm();
      await registrationPage.fillRegistrationForm({
        ...baseUser,
        email: invalidEmail,
      });
      await registrationPage.submitRegistrationForm();

      await registrationPage.expectInvalidEmailRejected(
        USER_REGISTRATION_TEST_DATA.invalidEmail.errorMessage
      );
    }
  });

  test('Debería mostrar error al intentar registrar un correo electrónico ya existente', async ({ registrationPage }) => {
    const duplicateEmail = generateUniqueEmail('duplicate.test');
    
    const userToRegister = {
      ...USER_REGISTRATION_TEST_DATA.validUserBase,
      email: duplicateEmail,
    };

    // 1. Registrar primer usuario exitosamente
    await registrationPage.fillRegistrationForm(userToRegister);
    await registrationPage.submitRegistrationForm();
    await registrationPage.expectSuccessfulRegistration();

    // Esperar a que pase el flujo o simplemente navegar de regreso
    await registrationPage.navigateToRegistration();

    // 2. Intentar registrar el mismo usuario de nuevo
    await registrationPage.fillRegistrationForm(userToRegister);
    await registrationPage.submitRegistrationForm();

    // Validar mensaje de error visible en el campo de email
    const emailError = registrationPage.getFieldErrorLocator('email');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(USER_REGISTRATION_TEST_DATA.duplicateEmail.errorMessage);
  });

});
