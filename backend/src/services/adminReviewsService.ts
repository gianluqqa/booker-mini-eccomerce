import { AppDataSource } from "../config/data-source";
import { Review } from "../entities/Review";
import { ReviewResponseDto } from "../dto/ReviewDto";

interface AdminReviewsFilters {
  bookId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

interface AdminReviewsResponse {
  reviews: ReviewResponseDto[];
  total: number;
  page: number;
  limit: number;
  filters: {
    bookId: string | null;
    userId: string | null;
  };
}

export const getAllReviewsAdminService = async (
  filters: AdminReviewsFilters = {}
): Promise<AdminReviewsResponse> => {
  const { bookId, userId, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const reviewRepository = AppDataSource.getRepository(Review);

  // Construir query base
  const queryBuilder = reviewRepository
    .createQueryBuilder("review")
    .leftJoinAndSelect("review.user", "user")
    .leftJoinAndSelect("review.book", "book")
    .orderBy("review.createdAt", "DESC");

  // Aplicar filtros
  if (bookId) {
    queryBuilder.andWhere("review.bookId = :bookId", { bookId });
  }

  if (userId) {
    queryBuilder.andWhere("review.userId = :userId", { userId });
  }

  // Obtener total y resultados
  const [reviews, total] = await queryBuilder
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  // Mapear a DTOs
  const reviewResponseDtos: ReviewResponseDto[] = reviews.map(review => ({
    id: review.id,
    comment: review.comment,
    rating: review.rating,
    title: review.title || undefined,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    bookId: review.bookId,
    userId: review.userId,
    user: {
      id: review.user.id,
      name: review.user.name,
      surname: review.user.surname
    },
    book: review.book ? {
      title: review.book.title,
      author: review.book.author
    } : undefined
  }));

  return {
    reviews: reviewResponseDtos,
    total,
    page,
    limit,
    filters: {
      bookId: bookId || null,
      userId: userId || null
    }
  };
};

export const deleteReviewAdminService = async (reviewId: string): Promise<{ message: string; reviewId: string }> => {
  const reviewRepository = AppDataSource.getRepository(Review);

  // Verificar que la review existe
  const review = await reviewRepository.findOne({
    where: { id: reviewId },
    relations: ["user", "book"]
  });

  if (!review) {
    throw { status: 404, message: "Review no encontrada" };
  }

  // Eliminar la review
  await reviewRepository.remove(review);

  return {
    message: "Review eliminada exitosamente",
    reviewId: reviewId
  };
};
