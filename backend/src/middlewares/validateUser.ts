import { LoginUserDTO, RegisterUserDTO, UpdateUserDTO } from "../dto/UserDto";
import { UserRole } from "../enums/UserRole";

export const validateRegisterUser = (user: RegisterUserDTO) => {
  const errors: string[] = [];

  const {
    email,
    password,
    confirmPassword,
    name,
    surname,
    address,
    country,
    city,
    phone,
    role,
    bio,
  } = user;

  // Email validation
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("El formato del email es inválido");
    }
  }

  // Password validation
  if (password && password.length < 8) {
    errors.push(
      "La contraseña debe contener al menos 8 caracteres, mayúsculas, minúsculas y números"
    );
  }

  // Confirm password validation
  if (password && confirmPassword && password !== confirmPassword) {
    errors.push("Las contraseñas no coinciden");
  }

  // Name & Surname length validation (si se envían)
    if (name && name.trim().length === 0) errors.push("El nombre es requerido");
    if (surname && surname.trim().length === 0)
    errors.push("El apellido es requerido");

  // Optional fields validations
  if (phone) {
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      errors.push(
        "El número de teléfono debe contener solo dígitos y tener entre 7 y 15 caracteres"
      );
    }
  }

  if (address && address.length < 3)
    errors.push("La dirección debe tener al menos 3 caracteres");
  if (country && country.length < 2)
    errors.push("El país debe tener al menos 2 caracteres");
  if (city && city.length < 2)
    errors.push("La ciudad debe tener al menos 2 caracteres");

  if (bio && bio.length > 500) {
    errors.push("La biografía no puede superar los 500 caracteres");
  }

  // Role validation
  if (role && !Object.values(UserRole).includes(role as UserRole)) {
    errors.push("El rol debe ser 'customer' o 'admin'");
  }

  return errors;
};

export const validateLoginUser = (user: LoginUserDTO) => {
  const errors: string[] = [];

  const { email, password } = user;

  // Email validation
  if (!email || email.trim() === "") {
    errors.push("El email es requerido");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("El formato del email es inválido");
    }
  }

  // Password validation
  if (!password || password.trim() === "") {
    errors.push("La contraseña es requerida");
  }

  return errors;
};

export const validateUpdateUser = (user: UpdateUserDTO) => {
  const errors: string[] = [];

  const { name, surname, password, phone, address, country, city, role, bio } = user;

  // Name validation
  if (name !== undefined && name.trim().length === 0) {
    errors.push("El nombre no puede estar vacío");
  }

  // Surname validation
  if (surname !== undefined && surname.trim().length === 0) {
    errors.push("El apellido no puede estar vacío");
  }

  // Password validation
  if (password && password.length < 8) {
    errors.push("La contraseña debe contener al menos 8 caracteres");
  }

  // Phone validation
  if (phone) {
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      errors.push("Phone number must contain only digits and be between 7 and 15 characters");
    }
  }

  // Address validation
  if (address !== undefined && address.length < 3) {
    errors.push("La dirección debe tener al menos 3 caracteres");
  }

  // Country validation
  if (country !== undefined && country.length < 2) {
    errors.push("El país debe tener al menos 2 caracteres");
  }

  // City validation
  if (city !== undefined && city.length < 2) {
    errors.push("La ciudad debe tener al menos 2 caracteres");
  }

  if (bio !== undefined && bio !== null && bio.length > 500) {
    errors.push("La biografía no puede superar los 500 caracteres");
  }

  // Role validation
  if (role && !Object.values(UserRole).includes(role as UserRole)) {
    errors.push("El rol debe ser 'customer' o 'admin'");
  }

  return errors;
};
