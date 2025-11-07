import { Request, Response } from "express";
import { registerUserService, loginUserService, getUsersService, getUserByIdService, updateUserService } from "../services/users-services";
import { LoginUserDTO, RegisterUserDTO, UpdateUserDTO } from "../dto/UserDto";
import { validateUpdateUser } from "../middlewares/validateUser";
import { UserRole } from "../enums/UserRole";

//? Crear un nuevo usuario (POST).
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

//? Iniciar sesión (POST).
export const loginUserController = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Validar que el body exista
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = req.body as LoginUserDTO;

    // 2️⃣ Llamar al service (incluye validación de formato y campos vacíos)
    const loginResult = await loginUserService(user);

    // 3️⃣ Retornar compatibilidad: campos de usuario al nivel raíz + accessToken
    // loginResult = { user: SafeUser, accessToken }
    return res.status(200).json({ ...loginResult.user, accessToken: loginResult.accessToken });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // 4️⃣ Mapear errores a status codes
    if (errorMessage.includes("required") || errorMessage.includes("format is invalid")) {
      return res.status(400).json({ message: errorMessage });
    } else if (errorMessage.includes("Invalid credentials")) {
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
    const message = error.message || "Internal server error";
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
    const message = error.message || "Internal server error";
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
        message: "Unauthorized",
      });
    }

    // 🔹 Validar permisos: customers solo pueden actualizar su propia información
    // Los admins pueden actualizar cualquier usuario
    if (authUser.role !== UserRole.ADMIN && authUser.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own information",
      });
    }

    // 🔹 Los customers no pueden cambiar su rol
    if (authUser.role !== UserRole.ADMIN && user.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot change your role",
      });
    }

    // 🔹 Validar los campos del usuario
    const errors = validateUpdateUser(user);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const updatedUser = await updateUserService(userId, user);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({
      success: false,
      message,
    });
  }
};