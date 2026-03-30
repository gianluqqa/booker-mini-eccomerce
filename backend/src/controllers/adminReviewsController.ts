import { Request, Response } from "express";
import { getAllReviewsAdminService, deleteReviewAdminService } from "../services/adminReviewsService";

export const getAllReviewsAdminController = async (req: Request, res: Response) => {
  try {
    // Extraer filtros de query params
    const {
      bookId,
      userId,
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

    // Llamar al servicio con filtros
    const result = await getAllReviewsAdminService({
      bookId: bookId as string,
      userId: userId as string,
      page: pageNum,
      limit: limitNum
    });

    return res.status(200).json({
      success: true,
      message: "Reviews obtenidas exitosamente",
      data: result
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
        message: "ID de review es requerido"
      });
    }

    // Llamar al servicio para eliminar la review
    const result = await deleteReviewAdminService(reviewId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        reviewId: result.reviewId
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
