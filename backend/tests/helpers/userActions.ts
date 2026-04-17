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
    role: "customer" as any
  });
  
  return await userRepository.save(user);
};
