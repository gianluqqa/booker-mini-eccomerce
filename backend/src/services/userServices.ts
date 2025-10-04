import { RegisterUserDTO } from "../dto/UserDto";
import { validateRegisterUser } from "../middlewares/validateUser";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

export const registerUserService = async (user: RegisterUserDTO) => {
  const errors = validateRegisterUser(user);
  if (errors.length > 0) throw new Error(errors.join(", "));

  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email: user.email } });
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(user.password, 10);

  // Campos opcionales con ?? null → prolijo y sin mañas
  const newUser = userRepo.create({
    email: user.email,
    password: hashedPassword,
    name: user.name,
    surname: user.surname,
    address: user.address ?? null,
    country: user.country ?? null,
    city: user.city ?? null,
    phone: user.phone ?? null,
  });

  await userRepo.save(newUser);

  const { password, ...safeUser } = newUser;
  return safeUser;
};
