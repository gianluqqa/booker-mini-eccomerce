import { Router } from "express";
import { getUserByIdController, getUsersController, loginUserController, registerUserController, updateUserController } from "../controllers/users-controllers";
import { authenticateJWT, requireAdmin } from "../middlewares/auth";

const userRoutes = Router();

userRoutes.post("/register", registerUserController);
userRoutes.post("/login", loginUserController);
userRoutes.get("/", authenticateJWT, requireAdmin, getUsersController);
userRoutes.get("/:id", authenticateJWT, requireAdmin, getUserByIdController);
userRoutes.put("/:id", authenticateJWT, updateUserController);

export default userRoutes;
