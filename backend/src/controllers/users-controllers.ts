import { Request, Response } from "express";
import { registerUserService, loginUserService, getUsersService, getUserByIdService, updateUserService, getCurrentUserService, firebaseLoginService, deleteUserService, deleteAllUsersExceptAdminService, toggleFavoriteService, getUserFavoritesService } from "../services/users-services";

import { FirebaseLoginDTO, LoginUserDTO, RegisterUserDTO, UpdateUserDTO } from "../dto/UserDto";
import { validateUpdateUser } from "../middlewares/validateUser";
import { UserRole } from "../enums/UserRole";

//? Crear un nuevo usuario (POST).
export const registerUserController = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: ["Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios"]
      });
    }

    const user = req.body as RegisterUserDTO;
    const newUser = await registerUserService(user);
    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: newUser
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";

    if (errorMessage.includes("Ya existe")) {
      res.status(409).json({
        success: false,
        message: errorMessage
      });
    } else {
      res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
  }
};

//? Iniciar sesión (POST).
export const loginUserController = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Validar que el body exista
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: ["Los campos email y contraseña son obligatorios"]
      });
    }

    const user = req.body as LoginUserDTO;

    // 2️⃣ Llamar al service (incluye validación de formato y campos vacíos)
    const loginResult = await loginUserService(user);

    // 3️⃣ Retornar estructura consistente con el resto de la API
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        user: loginResult.user,
        accessToken: loginResult.accessToken
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";

    // 4️⃣ Mapear errores a status codes según contrato
    if (errorMessage.includes("obligatorios")) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    } else if (errorMessage.includes("formato") && errorMessage.includes("inválido")) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    } else if (errorMessage.includes("Credenciales inválidas")) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
  }
};

//? Login/registro vía Firebase (POST).
export const firebaseLoginController = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: ["Email es requerido para el login con Firebase"]
      });
    }

    const payload = req.body as FirebaseLoginDTO;
    
    // Validar formato de email
    if (!payload.email || payload.email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Email es requerido para el login con Firebase"
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return res.status(400).json({
        success: false,
        message: "El formato del email es inválido"
      });
    }

    const result = await firebaseLoginService(payload);

    // Devolver estructura consistente
    return res.status(200).json({
      success: true,
      message: "Autenticación con Firebase exitosa",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        isNewUser: result.isNewUser
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";

    return res.status(400).json({
      success: false,
      message: errorMessage
    });
  }
};

//? Obtener todos los usuarios (GET).
export const getUsersController = async (req: Request, res: Response) => {
  try {
    const allUsers = await getUsersService();
    res.status(200).json({
      success: true,
      data: allUsers,
    });
  } catch (error: any) {
    if (error.status && error.message) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

//? Obtener el usuario actual (GET /users/me).
export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as { id: string; role: string } | undefined;

    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const user = await getCurrentUserService(authUser.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (error.status && error.message) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

//? Obtener un usuario por ID (GET).
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (error.status && error.message) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

//? Actualizar un usuario (PUT).
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = req.body as UpdateUserDTO;
    const authUser = (req as any).authUser as { id: string; role: string } | undefined;

    // 🔹 Verificar que el usuario esté autenticado
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // 🔹 Validar permisos: customers solo pueden actualizar su propia información
    // Los admins pueden actualizar cualquier usuario
    if (authUser.role !== UserRole.ADMIN && authUser.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Prohibido: Solo puedes actualizar tu propia información",
      });
    }

    // 🔹 Los customers no pueden cambiar su rol
    if (authUser.role !== UserRole.ADMIN && user.role) {
      return res.status(403).json({
        success: false,
        message: "Prohibido: No puedes cambiar tu rol",
      });
    }

    // 🔹 Validar los campos del usuario
    const errors = validateUpdateUser(user);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors,
      });
    }

    const updatedUser = await updateUserService(userId, user);
    res.status(200).json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: updatedUser,
    });
  } catch (error: any) {
    if (error.status && error.message) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

//? Agregar/quitar un libro de favoritos (POST /users/:userId/favorites/:bookId).
export const toggleFavoriteController = async (req: Request, res: Response) => {
  try {
    const { userId, bookId } = req.params;
    const authUser = (req as any).authUser as { id: string; role: string } | undefined;

    // 🔹 Verificar que el usuario esté autenticado
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // 🔹 Validar permisos: customers solo pueden modificar sus propios favoritos
    if (authUser.role !== UserRole.ADMIN && authUser.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Prohibido: Solo puedes modificar tus propios favoritos",
      });
    }

    const { message, isFavorite } = await toggleFavoriteService(userId, bookId);

    return res.status(200).json({
      success: true,
      message,
      data: { isFavorite }
    });
  } catch (error: any) {
    console.error("Error toggling favorite:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Error al procesar favoritos"
    });
  }
};

//? Obtener los libros favoritos de un usuario (GET /users/:userId/favorites).
export const getUserFavoritesController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authUser = (req as any).authUser as { id: string; role: string } | undefined;

    // 🔹 Verificar que el usuario esté autenticado
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // 🔹 Validar permisos: customers solo pueden ver sus propios favoritos
    if (authUser.role !== UserRole.ADMIN && authUser.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Prohibido: Solo puedes ver tus propios favoritos",
      });
    }

    const favorites = await getUserFavoritesService(userId);

    return res.status(200).json({
      success: true,
      data: favorites
    });
  } catch (error: any) {
    console.error("Error getting user favorites:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Error al obtener favoritos"
    });
  }
};