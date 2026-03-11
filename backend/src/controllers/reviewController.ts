import { Request, Response } from "express";
import { createReviewService, getReviewsByBookService, updateReviewService, deleteReviewService, getUserReviewsService, getAllReviewsService } from "../services/reviewService";
import { CreateReviewDto, UpdateReviewDto } from "../dto/ReviewDto";

export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUser?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const reviewData: CreateReviewDto = req.body;
    const review = await createReviewService(reviewData, userId);

    res.status(201).json({
      message: "Reseña creada exitosamente",
      review
    });
  } catch (error: any) {
    console.error("Error al crear reseña:", error);
    res.status(400).json({ message: error.message || "Error al crear la reseña" });
  }
};

export const getReviewsByBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getReviewsByBookService(bookId, page, limit);

    res.json({
      message: "Reseñas obtenidas exitosamente",
      ...result
    });
  } catch (error: any) {
    console.error("Error al obtener reseñas del libro:", error);
    res.status(400).json({ message: error.message || "Error al obtener las reseñas" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUser?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { reviewId } = req.params;
    const updateData: UpdateReviewDto = req.body;

    const review = await updateReviewService(reviewId, userId, updateData);

    res.json({
      message: "Reseña actualizada exitosamente",
      review
    });
  } catch (error: any) {
    console.error("Error al actualizar reseña:", error);
    res.status(400).json({ message: error.message || "Error al actualizar la reseña" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUser?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { reviewId } = req.params;
    await deleteReviewService(reviewId, userId);

    res.json({
      message: "Reseña eliminada exitosamente"
    });
  } catch (error: any) {
    console.error("Error al eliminar reseña:", error);
    res.status(400).json({ message: error.message || "Error al eliminar la reseña" });
  }
};

export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUser?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getUserReviewsService(userId, page, limit);

    res.json({
      message: "Reseñas del usuario obtenidas exitosamente",
      ...result
    });
  } catch (error: any) {
    console.error("Error al obtener reseñas del usuario:", error);
    res.status(400).json({ message: error.message || "Error al obtener las reseñas del usuario" });
  }
};
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;

    const result = await getAllReviewsService(page, limit);

    res.json({
      message: "Reseñas globales obtenidas exitosamente",
      ...result
    });
  } catch (error: any) {
    console.error("Error al obtener reseñas globales:", error);
    res.status(400).json({ message: error.message || "Error al obtener las reseñas" });
  }
};
