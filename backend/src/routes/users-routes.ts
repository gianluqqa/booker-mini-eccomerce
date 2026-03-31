import { Router } from "express";
import { getUserByIdController, getUsersController, loginUserController, registerUserController, updateUserController, getCurrentUserController, firebaseLoginController, toggleFavoriteController, getUserFavoritesController } from "../controllers/users-controllers";

import { deleteUserController, deleteAllUsersExceptAdminController } from "../controllers/users-controllers-delete";

import { authenticateJWT, requireAdmin } from "../middlewares/auth";

const userRoutes = Router();

// Registrar un nuevo usuario
userRoutes.post("/register", registerUserController);

// Iniciar sesión
userRoutes.post("/login", loginUserController);

// Login/register con Firebase
userRoutes.post("/firebase-login", firebaseLoginController);

// Obtener el usuario actual
userRoutes.get("/me", authenticateJWT, getCurrentUserController);

// Obtener todos los usuarios (solo administradores)
userRoutes.get("/", authenticateJWT, requireAdmin, getUsersController);

// Obtener un usuario por ID (solo administradores)
userRoutes.get("/:id", authenticateJWT, requireAdmin, getUserByIdController);

// Actualizar un usuario
userRoutes.put("/:id", authenticateJWT, updateUserController);

// Favoritos
userRoutes.post("/:userId/favorites/:bookId", authenticateJWT, toggleFavoriteController);
userRoutes.get("/:userId/favorites", authenticateJWT, getUserFavoritesController);

// Eliminar un usuario específico (solo administradores)

userRoutes.delete("/:id", authenticateJWT, requireAdmin, deleteUserController);

// Eliminar todos los usuarios excepto admin (solo administradores)
userRoutes.delete("/", authenticateJWT, requireAdmin, deleteAllUsersExceptAdminController);

export default userRoutes;
