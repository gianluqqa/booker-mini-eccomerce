import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/userServices";
import { LoginUserDTO, RegisterUserDTO } from "../dto/UserDto";

//? Crear un nuevo usuario (POST).
export const registerUserController = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Email, password, confirmPassword, name and surname are required"
      });
    }

    const user = req.body as RegisterUserDTO;
    const newUser = await registerUserService(user);
    res.status(201).json(newUser);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("already exists")) {
      res.status(409).json({ message: errorMessage });
    } else {
      res.status(400).json({ message: errorMessage });
    }
  }
};

//? Iniciar sesión (POST).
export const loginUserController = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Validar que el body exista
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = req.body as LoginUserDTO;

    // 2️⃣ Llamar al service (incluye validación de formato y campos vacíos)
    const loggedUser = await loginUserService(user);

    // 3️⃣ Retornar usuario seguro
    return res.status(200).json(loggedUser);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // 4️⃣ Mapear errores a status codes
    if (errorMessage.includes("required") || errorMessage.includes("format is invalid")) {
      return res.status(400).json({ message: errorMessage });
    } else if (errorMessage.includes("Invalid credentials")) {
      return res.status(401).json({ message: errorMessage });
    } else {
      return res.status(400).json({ message: errorMessage });
    }
  }
};