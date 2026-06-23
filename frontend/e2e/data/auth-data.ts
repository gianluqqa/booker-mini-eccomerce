/**
 * Interfaz que define la estructura del formulario de registro.
 */
export interface UserRegistrationData {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  country?: string;
  city?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'not_specific';
}

/**
 * Interfaz que define la estructura del formulario de login.
 */
export interface UserLoginData {
  email?: string;
  password?: string;
}

/**
 * Datos de prueba para autenticación (registro + login).
 * Unifica los datos de registro y login en un solo archivo para evitar duplicación.
 */
export const AUTH_DATA = {
  validPassword: 'Password123!',

  validUserBase: {
    name: 'Automation',
    surname: 'QA',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    address: 'Av. Siempreviva 742',
    country: 'Argentina',
    city: 'Buenos Aires',
    phone: '1122334455',
    gender: 'not_specific' as const,
  },

  blankFieldsValidationErrors: {
    name: 'El nombre solo puede contener letras y espacios',
    surname: 'El apellido solo puede contener letras y espacios',
    email: 'El email es obligatorio',
    password: 'La contraseña es obligatoria',
    confirmPassword: 'La confirmación es obligatoria',
  },

  loginBlankFieldsValidationErrors: {
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

  weakPasswords: {
    noUppercase: {
      password: 'password123',
      confirmPassword: 'password123',
      errorMessage: 'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número',
    },
    noNumber: {
      password: 'Password',
      confirmPassword: 'Password',
      errorMessage: 'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número',
    },
    tooShort: {
      password: 'Pw123',
      confirmPassword: 'Pw123',
      errorMessage: 'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número',
    },
  },

  mismatchedPasswords: {
    password: 'Password123!',
    confirmPassword: 'Different123!',
    errorMessage: 'Las contraseñas no coinciden',
  },

  duplicateEmail: {
    errorMessage: 'Ya existe un usuario con ese email',
  },

  invalidCredentials: {
    errorMessage: 'Credenciales inválidas',
  },
};
