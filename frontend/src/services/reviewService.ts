import { apiClient } from "../config/api";
import { 
  Review, 
  CreateReviewDto, 
  UpdateReviewDto, 
  ReviewListDto 
} from "../types/Review";

export const getAllReviews = async (
  page: number = 1, 
  limit: number = 6
): Promise<ReviewListDto> => {
  try {
    const response = await apiClient.get("/reviews", {
      params: { page, limit }
    });
    const { data, meta, summary } = response.data;
    return {
      reviews: data,
      total: meta.total,
      averageRating: summary.averageRating || 0,
      ratingDistribution: summary.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  } catch (error: unknown) {
    console.error("Error al obtener todas las reseñas:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al obtener las reseñas";
    throw new Error(errorMessage);
  }
};

export const createReview = async (reviewData: CreateReviewDto): Promise<Review> => {
  try {
    const response = await apiClient.post("/reviews", reviewData);
    return response.data.data;
  } catch (error: unknown) {
    console.error("Error al crear reseña:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al crear la reseña";
    throw new Error(errorMessage);
  }
};

export const getReviewsByBook = async (
  bookId: string, 
  page: number = 1, 
  limit: number = 10
): Promise<ReviewListDto> => {
  try {
    const response = await apiClient.get(`/reviews/book/${bookId}`, {
      params: { page, limit }
    });
    const { data, meta, summary } = response.data;
    return {
      reviews: data,
      total: meta.total,
      averageRating: summary.averageRating,
      ratingDistribution: summary.ratingDistribution
    };
  } catch (error: unknown) {
    console.error("Error al obtener reseñas del libro:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al obtener las reseñas";
    throw new Error(errorMessage);
  }
};

export const updateReview = async (
  reviewId: string, 
  updateData: UpdateReviewDto
): Promise<Review> => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, updateData);
    return response.data.data;
  } catch (error: unknown) {
    console.error("Error al actualizar reseña:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al actualizar la reseña";
    throw new Error(errorMessage);
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await apiClient.delete(`/reviews/${reviewId}`);
  } catch (error: unknown) {
    console.error("Error al eliminar reseña:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar la reseña";
    throw new Error(errorMessage);
  }
};

export const getUserReviews = async (
  page: number = 1, 
  limit: number = 10
): Promise<ReviewListDto> => {
  try {
    const response = await apiClient.get("/reviews/user", {
      params: { page, limit }
    });
    const { data, meta, summary } = response.data;
    return {
      reviews: data,
      total: meta.total,
      averageRating: summary.averageRating || 0,
      ratingDistribution: summary.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  } catch (error: unknown) {
    console.error("Error al obtener reseñas del usuario:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al obtener las reseñas del usuario";
    throw new Error(errorMessage);
  }
};
