import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { createReview, getReviewsByBook, updateReview, deleteReview, getUserReviews } from "../controllers/reviewController";

const router = Router();

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

export default router;
