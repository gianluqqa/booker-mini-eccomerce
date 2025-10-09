import { Request, Response } from "express";
import { registerUserService } from "../services/userServices";
import { RegisterUserDTO } from "../dto/UserDto";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const user = req.body as RegisterUserDTO;
    const newUser = await registerUserService(user);
    res.status(201).json(newUser);
  } catch (error) {
    // Devolver el mensaje de error específico
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // 400 para errores de validación, 409 solo para recursos duplicados
    if (errorMessage.includes("already exists")) {
      res.status(409).json({ message: errorMessage });
    } else {
      res.status(400).json({ message: errorMessage });
    }
  }
};
