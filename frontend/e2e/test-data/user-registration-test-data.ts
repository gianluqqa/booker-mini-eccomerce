/**
 * Interfaz que define la estructura del formulario de registro de usuario.
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
 * Catálogo de datos estáticos e insumos de prueba para los escenarios de registro.
 */
export const USER_REGISTRATION_TEST_DATA = {
  // Datos base válidos que se usarán junto con el generador de correo único
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

  // Mismos casos que backend/tests/integration/authentication/register.test.ts (ítem 11)
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

  // Escenarios con contraseñas débiles (Next.js valida complejidad: min 8 carac, 1 mayús, 1 minús, 1 número)
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

  // Contraseñas válidas pero no coincidentes
  mismatchedPasswords: {
    password: 'Password123!',
    confirmPassword: 'Different123!',
    errorMessage: 'Las contraseñas no coinciden',
  },

  // Mensaje mostrado al usuario cuando el email ya está registrado
  duplicateEmail: {
    errorMessage: 'Ya existe un usuario con ese email',
  },

  // Mensajes de error esperados ante campos en blanco
  blankFieldsValidationErrors: {
    name: 'El nombre solo puede contener letras y espacios',
    surname: 'El apellido solo puede contener letras y espacios',
    email: 'El email es obligatorio',
    password: 'La contraseña es obligatoria',
    confirmPassword: 'La confirmación es obligatoria',
  },
};
