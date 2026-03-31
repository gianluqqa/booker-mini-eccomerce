import { Request, Response } from "express";
import { getAllReviewsAdminService, deleteReviewAdminService } from "../services/adminReviewsService";

export const getAllReviewsAdminController = async (req: Request, res: Response) => {
  try {
    // Extraer filtros de query params
    const {
      book,
      user,
      page = 1,
      limit = 10
    } = req.query;

    // Validar parámetros
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: "El número de página debe ser mayor a 0"
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "El límite debe estar entre 1 y 100"
      });
    }

    // Llamar al servicio con filtros de nombre/título
    const result = await getAllReviewsAdminService({
      book: book as string,
      user: user as string,
      page: pageNum,
      limit: limitNum
    });

    return res.status(200).json({
      success: true,
      data: result.reviews,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit
      }
    });
  } catch (error: any) {
    console.error("Error al obtener reviews de admin:", error);
    
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message
    });
  }
};

export const deleteReviewAdminController = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: ["ID de reseña es requerido"]
      });
    }

    // Llamar al servicio para eliminar la review
    await deleteReviewAdminService(reviewId);

    return res.status(200).json({
      success: true,
      message: "Reseña eliminada exitosamente",
      data: {
        id: reviewId
      }
    });
  } catch (error: any) {
    console.error("Error al eliminar review de admin:", error);
    
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message
    });
  }
};
