import { LoginUserDTO, RegisterUserDTO } from "../dto/UserDto";
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
  } = user;

  // Email validation
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Email format is invalid");
    }
  }

  // Password validation
  if (password && password.length < 8) {
    errors.push(
      "Password must contain at least 8 characters, uppercase, lowercase and number"
    );
  }

  // Confirm password validation
  if (password && confirmPassword && password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  // Name & Surname length validation (si se envían)
  if (name && name.trim().length === 0) errors.push("Name is required");
  if (surname && surname.trim().length === 0)
    errors.push("Surname is required");

  // Optional fields validations
  if (phone) {
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      errors.push(
        "Phone number must contain only digits and be between 7 and 15 characters"
      );
    }
  }

  if (address && address.length < 3)
    errors.push("Address must be at least 3 characters long");
  if (country && country.length < 2)
    errors.push("Country must be at least 2 characters long");
  if (city && city.length < 2)
    errors.push("City must be at least 2 characters long");

  // Role validation
  if (role && !Object.values(UserRole).includes(role as UserRole)) {
    errors.push("Role must be either 'customer' or 'admin'");
  }

  return errors;
};

export const validateLoginUser = (user: LoginUserDTO) => {
  const errors: string[] = [];

  const { email, password } = user;

  // Email validation
  if (!email || email.trim() === "") {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Email format is invalid");
    }
  }

  // Password validation
  if (!password || password.trim() === "") {
    errors.push("Password is required");
  }

  return errors;
};
