/**
 * Interfaz que define las credenciales del administrador para pruebas E2E.
 */
export interface AdminCredentials {
  email: string;
  password: string;
}

/**
 * Credenciales del admin usadas en fixtures y utilidades de setup.
 * Deben coincidir con el usuario creado por el seed del backend.
 */
export const ADMIN_TEST_DATA = {
  credentials: {
    email: 'admin@booker.com',
    password: 'TuPasswordSegura123!',
  } satisfies AdminCredentials,
} as const;
