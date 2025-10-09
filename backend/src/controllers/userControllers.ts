import { Request, Response } from "express";
import { registerUserService } from "../services/userServices";
import { RegisterUserDTO } from "../dto/UserDto";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const user = req.body as RegisterUserDTO;
    const newUser = await registerUserService(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ message: "User with that email already exists" });
  }
};
