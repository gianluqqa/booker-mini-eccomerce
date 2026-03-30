import { Router } from "express";
import { authenticateJWT, requireAdmin } from "../middlewares/auth";
import { createReview, getReviewsByBook, updateReview, deleteReview, getUserReviews, getAllReviews } from "../controllers/reviewController";
import { getAllReviewsAdminController, deleteReviewAdminController } from "../controllers/adminReviewsController";

const router = Router();

// Obtener todas las reseñas globales (para testimonios)
router.get("/", getAllReviews);

// Crear una nueva reseña (requiere autenticación)
router.post("/", authenticateJWT, createReview);

// Obtener todas las reseñas de un libro (público)
router.get("/book/:bookId", getReviewsByBook);

// Obtener todas las reseñas del usuario autenticado (requiere autenticación)
router.get("/user", authenticateJWT, getUserReviews);

// Actualizar una reseña (requiere autenticación)
router.put("/:reviewId", authenticateJWT, updateReview);

// Eliminar una reseña (requiere autenticación)
router.delete("/:reviewId", authenticateJWT, deleteReview);

// Obtener todas las reviews con filtros (solo administradores)
router.get("/admin/all", authenticateJWT, requireAdmin, getAllReviewsAdminController);

// Eliminar una review (solo administradores)
router.delete("/admin/:reviewId", authenticateJWT, requireAdmin, deleteReviewAdminController);

export default router;
