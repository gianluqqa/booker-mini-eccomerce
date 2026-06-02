import { test } from '../../fixtures/user-registration-fixtures';
import { USER_REGISTRATION_TEST_DATA } from '../../test-data/user-registration-test-data';
import { generateUniqueEmail } from '../../utilities/unique-email-generator';

test.describe('Registro de Usuario - Smoke Suite @smoke', () => {

  test('Debería registrar un usuario exitosamente con datos válidos', async ({ registrationPage }) => {
    await registrationPage.navigateToRegistration();

    const newUser = {
      ...USER_REGISTRATION_TEST_DATA.validUserBase,
      email: generateUniqueEmail(),
    };

    await registrationPage.fillRegistrationForm(newUser);
    await registrationPage.submitRegistrationForm();

    // Flujo crítico: registro exitoso y el usuario puede continuar en login
    await registrationPage.expectRegistrationSmokeComplete();
  });

});
