import { Request, Response } from "express";
import { deleteUserService, deleteAllUsersExceptAdminService } from "../services/users-services";
import { UserRole } from "../enums/UserRole";

//? Eliminar un usuario específico por ID (DELETE).
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const authUser = (req as any).authUser as { id: string; role: string } | undefined;

    // 🔹 Verificar que el usuario esté autenticado
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // 🔹 Solo los admins pueden eliminar usuarios
    if (authUser.role !== UserRole.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Prohibido: Solo los administradores pueden eliminar usuarios",
      });
    }

    const result = await deleteUserService(userId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: { userId: result.userId },
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

//? Eliminar todos los usuarios excepto el admin (DELETE).
export const deleteAllUsersExceptAdminController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as { id: string; role: string } | undefined;

    // 🔹 Verificar que el usuario esté autenticado
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // 🔹 Solo los admins pueden realizar esta acción
    if (authUser.role !== UserRole.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Prohibido: Solo los administradores pueden realizar esta acción",
      });
    }

    const result = await deleteAllUsersExceptAdminService();
    res.status(200).json({
      success: true,
      message: result.message,
      data: { deletedCount: result.deletedCount },
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
