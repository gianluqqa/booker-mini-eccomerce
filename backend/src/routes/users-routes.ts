import { Router } from "express";
import { getUserByIdController, getUsersController, loginUserController, registerUserController, updateUserController, getCurrentUserController } from "../controllers/users-controllers";
import { authenticateJWT, requireAdmin } from "../middlewares/auth";

const userRoutes = Router();

userRoutes.post("/register", registerUserController); //? Registrar un nuevo usuario.
userRoutes.post("/login", loginUserController); //? Iniciar sesión.
userRoutes.get("/me", authenticateJWT, getCurrentUserController); //? Obtener el usuario actual.
userRoutes.get("/", authenticateJWT, requireAdmin, getUsersController); //? Obtener todos los usuarios.
userRoutes.get("/:id", authenticateJWT, requireAdmin, getUserByIdController); //? Obtener un usuario por ID.
userRoutes.put("/:id", authenticateJWT, updateUserController); //? Actualizar un usuario.

export default userRoutes;
