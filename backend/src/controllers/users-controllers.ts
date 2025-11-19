import { Request, Response } from "express";
import { registerUserService, loginUserService, getUsersService, getUserByIdService, updateUserService, getCurrentUserService } from "../services/users-services";
import { LoginUserDTO, RegisterUserDTO, UpdateUserDTO } from "../dto/UserDto";
import { validateUpdateUser } from "../middlewares/validateUser";
import { UserRole } from "../enums/UserRole";

//? Crear un nuevo usuario (POST).
export const registerUserController = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Email, contraseña, confirmación de contraseña, nombre y apellido son requeridos"
      });
    }

    const user = req.body as RegisterUserDTO;
    const newUser = await registerUserService(user);
    res.status(201).json(newUser);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";

    if (errorMessage.includes("ya existe")) {
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
        message: "Email y contraseña son requeridos",
      });
    }

    const user = req.body as LoginUserDTO;

    // 2️⃣ Llamar al service (incluye validación de formato y campos vacíos)
    const loginResult = await loginUserService(user);

    // 3️⃣ Retornar compatibilidad: campos de usuario al nivel raíz + accessToken
    // loginResult = { user: SafeUser, accessToken }
    return res.status(200).json({ ...loginResult.user, accessToken: loginResult.accessToken });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";

    // 4️⃣ Mapear errores a status codes
    if (errorMessage.includes("requerido") || errorMessage.includes("requeridos") || (errorMessage.includes("formato") && errorMessage.includes("inválido"))) {
      return res.status(400).json({ message: errorMessage });
    } else if (errorMessage.includes("Credenciales inválidas")) {
      return res.status(401).json({ message: errorMessage });
    } else {
      return res.status(400).json({ message: errorMessage });
    }
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
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";
    res.status(status).json({
      success: false,
      message,
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
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";
    res.status(status).json({
      success: false,
      message,
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
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";
    res.status(status).json({
      success: false,
      message,
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
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";
    res.status(status).json({
      success: false,
      message,
    });
  }
};