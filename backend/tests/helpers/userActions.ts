import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entities/User";
import bcrypt from "bcrypt";

/**
 * ACCIONES: Usuarios
 * -----------------
 */

export const createTestUser = async (userData: {
  email: string;
  name?: string;
  surname?: string;
  role?: string;
}) => {
  const userRepository = AppDataSource.getRepository(User);
  
  // Hashear contraseña para que el login del backend funcione (bcrypt.compare)
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const user = userRepository.create({
    name: userData.name || "Test",
    surname: userData.surname || "User",
    ...userData,
    email: userData.email.toLowerCase().trim(), // Sanitización igual que el backend
    password: hashedPassword,
    role: (userData.role || "customer") as any
  });
  
  const savedUser = await userRepository.save(user);
  
  // No exponer la contraseña en el resultado del helper
  delete (savedUser as any).password;
  
  return savedUser;
};
