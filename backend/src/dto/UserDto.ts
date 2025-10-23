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
  role?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
