import { Request, Response } from "express";
import { registerUserService } from "../services/userServices";
import { RegisterUserDTO } from "../dto/UserDto";

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

