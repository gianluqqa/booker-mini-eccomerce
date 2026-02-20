import { Router } from "express";
import { getUserByIdController, getUsersController, loginUserController, registerUserController, updateUserController, getCurrentUserController, firebaseLoginController } from "../controllers/users-controllers";
import { deleteUserController, deleteAllUsersExceptAdminController } from "../controllers/users-controllers-delete";
import { authenticateJWT, requireAdmin } from "../middlewares/auth";

const userRoutes = Router();

userRoutes.post("/register", registerUserController); //? Registrar un nuevo usuario.
userRoutes.post("/login", loginUserController); //? Iniciar sesión.
userRoutes.post("/firebase-login", firebaseLoginController); //? Login/register con Firebase.
userRoutes.get("/me", authenticateJWT, getCurrentUserController); //? Obtener el usuario actual.
userRoutes.get("/", authenticateJWT, requireAdmin, getUsersController); //? Obtener todos los usuarios.
userRoutes.get("/:id", authenticateJWT, requireAdmin, getUserByIdController); //? Obtener un usuario por ID.
userRoutes.put("/:id", authenticateJWT, updateUserController); //? Actualizar un usuario.
userRoutes.delete("/:id", authenticateJWT, requireAdmin, deleteUserController); //? Eliminar un usuario específico.
userRoutes.delete("/", authenticateJWT, requireAdmin, deleteAllUsersExceptAdminController); //? Eliminar todos los usuarios excepto admin.

export default userRoutes;
