import { Router } from "express";
import { registerUserController } from "../controllers/userControllers";

const userRoutes = Router();

userRoutes.post("/register", registerUserController);

export default userRoutes;
