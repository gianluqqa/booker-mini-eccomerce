export interface UserDto {
  id: number;
  name: string;
  email: string;
  password: string;
  token?: string;
}

export interface RegisterUserDTO {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  address?: string;
  country?: string;
  city?: string;
  phone?: string;
  bio?: string;
  gender?: string;
  role?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

// Login/registro vía Firebase (email ya verificado por Firebase en el cliente)
export interface FirebaseLoginDTO {
  email: string;
  name?: string;
  surname?: string;
}

export interface UpdateUserDTO {
  name?: string;
  surname?: string;
  password?: string;
  address?: string;
  country?: string;
  city?: string;
  phone?: string;
  bio?: string | null;
  gender?: string;
  role?: string;
}