export interface IUser {
  id: string;
  name: string;
  surname: string;
  address?: string;
  country?: string;
  city?: string;
  phone?: string;
  email: string;
  password: string;
  role?: string;
  cart?: string[];
  orders?: string[];
  token?: string;
}

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

export interface ILoginUser {
  email: string;
  password: string;
}
