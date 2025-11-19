import { LoginUserDTO, RegisterUserDTO, UpdateUserDTO } from "../dto/UserDto";
import { validateLoginUser, validateRegisterUser } from "../middlewares/validateUser";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserRole } from "../enums/UserRole";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { excludeSensitiveData } from "../helpers/user-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

//? Crear un nuevo usuario (POST).
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
      "Email, contraseña, confirmación de contraseña, nombre y apellido son requeridos"
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
    if (existingUser) throw new Error("Ya existe un usuario con ese email");

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

//? Iniciar sesión (POST).
export const loginUserService = async (user: LoginUserDTO) => {
  // 1️⃣ Validación del request
  const errors = validateLoginUser(user);
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // 2️⃣ Verificar que el usuario exista
  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email: user.email } });
    if (!existingUser) throw new Error("Credenciales inválidas");

  // 3️⃣ Verificar password
  const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  // 4️⃣ Emitir access token (15m)
  const accessToken = jwt.sign(
    { sub: existingUser.id, role: existingUser.role },
    JWT_SECRET,
    { algorithm: "HS256", expiresIn: "15m" }
  );

  // 5️⃣ Retornar usuario seguro + token
  const { password: _, ...safeUser } = existingUser;
  return { user: safeUser, accessToken };
};

//? Obtener todos los usuarios (GET).
export const getUsersService = async () => {
  const userRepo = AppDataSource.getRepository(User);
  const allUsers = await userRepo.find();
  return allUsers.map(excludeSensitiveData);
};

//? Obtener el usuario actual (GET /users/me).
export const getCurrentUserService = async (id: string) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id } });
  
  if (!user) {
    throw { status: 404, message: "Usuario no encontrado" };
  }
  
  return excludeSensitiveData(user);
};

//? Obtener un usuario por ID (GET).
export const getUserByIdService = async (id: string) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id } });
  
  if (!user) {
    throw { status: 404, message: "Usuario no encontrado" };
  }
  
  return excludeSensitiveData(user);
};

//? Actualizar un usuario (PUT).
export const updateUserService = async (id: string, user: UpdateUserDTO) => {
  const userRepo = AppDataSource.getRepository(User);
  
  try {
    const existingUser = await userRepo.findOne({ where: { id } });
    if (!existingUser) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    // Si se actualiza el password, hashearlo
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Actualizar solo los campos definidos
    Object.assign(existingUser, user);
    await userRepo.save(existingUser);
    
    return excludeSensitiveData(existingUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo actualizar el usuario" };
  }
};