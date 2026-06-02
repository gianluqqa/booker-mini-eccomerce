/**
 * Interfaz que define la estructura del formulario de inicio de sesión.
 */
export interface UserLoginData {
  email?: string;
  password?: string;
}

/**
 * Catálogo de datos estáticos para escenarios de login.
 * Mensajes alineados con frontend/src/app/login/page.tsx y
 * backend/tests/integration/authentication/login.test.ts.
 */
export const USER_LOGIN_TEST_DATA = {
  validPassword: 'Password123!',

  blankFieldsValidationErrors: {
    email: 'Los campos email y contraseña son obligatorios',
    password: 'Los campos email y contraseña son obligatorios',
  },

  invalidEmailFormats: [
    'correo-sin-arroba',
    'email@sin-punto',
    'email con espacios@test.com',
    '@sin-usuario.com',
    'usuario@.com',
  ],

  invalidEmail: {
    errorMessage: 'El formato del email es inválido',
  },

  invalidCredentials: {
    errorMessage: 'Credenciales inválidas',
  },
};
