import { LoginUserDTO, RegisterUserDTO } from "../dto/UserDto";
import { validateLoginUser, validateRegisterUser } from "../routes/middlewares/validateUser";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserRole } from "../enums/UserRole";
import bcrypt from "bcrypt";

export const registerUserService = async (user: RegisterUserDTO) => {
  // 1️⃣ Chequear campos obligatorios faltantes
  const requiredFields: (keyof RegisterUserDTO)[] = [
    "email",
    "password",
    "confirmPassword",
    "name",
    "surname",
  ];
  const missingFields = requiredFields.filter(
    (f) => !user[f] || (typeof user[f] === "string" && user[f].trim() === "")
  );

  if (missingFields.length > 0) {
    throw new Error(
      "Email, password, confirmPassword, name and surname are required"
    );
  }

  // 2️⃣ Validación de contenido (longitud de password, coincidencia de confirmPassword, formato de email, etc.)
  const errors = validateRegisterUser(user);
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // 3️⃣ Check duplicado
  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email: user.email } });
  if (existingUser) throw new Error("User with that email already exists");

  // 4️⃣ Crear usuario
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = userRepo.create({
    email: user.email,
    password: hashedPassword,
    name: user.name,
    surname: user.surname,
    address: user.address ?? null,
    country: user.country ?? null,
    city: user.city ?? null,
    phone: user.phone ?? null,
    role: (user.role as UserRole) ?? UserRole.CUSTOMER, // Usar el rol del request o CUSTOMER por defecto
  });

  await userRepo.save(newUser);

  const { password, ...safeUser } = newUser;
  return safeUser;
};

export const loginUserService = async (user: LoginUserDTO) => {
  // 1️⃣ Validación del request
  const errors = validateLoginUser(user);
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // 2️⃣ Verificar que el usuario exista
  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email: user.email } });
  if (!existingUser) throw new Error("Invalid credentials");

  // 3️⃣ Verificar password
  const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  // 4️⃣ Retornar usuario seguro
  const { password: _, ...safeUser } = existingUser;
  return safeUser;
};
