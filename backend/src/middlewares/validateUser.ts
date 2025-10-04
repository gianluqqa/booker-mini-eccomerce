import { RegisterUserDTO } from "../dto/UserDto";

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
  } = user;

  // Email validation
  if (!email) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Email format is invalid");
    }
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Confirm password validation
  if (!confirmPassword) {
    errors.push("Confirm password is required");
  } else if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  // Name validation
  if (!name) {
    errors.push("Name is required");
  }

  // Surname validation
  if (!surname) {
    errors.push("Surname is required");
  }

  // Phone validation (optional but if provided must be valid)
  if (phone) {
    const phoneRegex = /^[0-9]{7,15}$/; // Only digits, 7 to 15 length
    if (!phoneRegex.test(phone)) {
      errors.push(
        "Phone number must contain only digits and be between 7 and 15 characters"
      );
    }
  }

  // Address, country, and city are optional but can be validated if provided
  if (address && address.length < 3) {
    errors.push("Address must be at least 3 characters long");
  }

  if (country && country.length < 2) {
    errors.push("Country must be at least 2 characters long");
  }

  if (city && city.length < 2) {
    errors.push("City must be at least 2 characters long");
  }

  return errors;
};
