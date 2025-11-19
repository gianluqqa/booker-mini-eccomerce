// Estructura de datos para User (respuesta del backend)
export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  address?: string | null;
  country?: string | null;
  city?: string | null;
  phone?: string | null;
  role?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Estructura de datos para registro (POST /users/register)
export interface IRegisterUser {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  address?: string;
  country?: string;
  city?: string;
  phone?: string;
  role?: string;
}

// Estructura de datos para login (POST /users/login)
export interface ILoginUser {
  email: string;
  password: string;
}

// Estructura de datos para actualizar usuario (PUT /users/:id)
export interface IUpdateUser {
  name?: string;
  surname?: string;
  password?: string;
  address?: string;
  country?: string;
  city?: string;
  phone?: string;
  role?: string;
}
