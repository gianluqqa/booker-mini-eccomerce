import { RegisterUserDTO } from "../dto/UserDto";
import { validateRegisterUser } from "../middlewares/validateUser";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

export const registerUserService = async (user: RegisterUserDTO) => {
  const errors = validateRegisterUser(user);
  if (errors.length > 0) {
    // Si faltan campos críticos, devolver mensaje generalizado
    const requiredFields = [
      "email",
      "password",
      "confirmPassword",
      "name",
      "surname",
    ];
    const missingFields = requiredFields.filter(
      (f) => !user[f as keyof RegisterUserDTO]
    );
    if (missingFields.length > 0) {
      throw new Error(
        "Email, password, confirmPassword, name and surname are required"
      );
    }
    throw new Error(errors.join(", "));
  }

  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email: user.email } });
  if (existingUser) throw new Error("User with that email already exists");

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
  });

  await userRepo.save(newUser);

  const { password, ...safeUser } = newUser;
  return safeUser;
};
