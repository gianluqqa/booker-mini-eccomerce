import { AppDataSource } from "../config/data-source";
import { Review } from "../entities/Review";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto, ReviewListDto } from "../dto/ReviewDto";

const reviewRepository = AppDataSource.getRepository(Review);
const bookRepository = AppDataSource.getRepository(Book);
const userRepository = AppDataSource.getRepository(User);

export const createReviewService = async (reviewData: CreateReviewDto, userId: string): Promise<ReviewResponseDto> => {
  const { bookId, comment, rating, title } = reviewData;

  // Verificar que el libro existe
  const book = await bookRepository.findOne({ where: { id: bookId } });
  if (!book) {
    throw new Error("Libro no encontrado");
  }

  // Verificar que el usuario existe
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Verificar si el usuario ya ha reseñado este libro
  const existingReview = await reviewRepository.findOne({
    where: { bookId, userId }
  });

  if (existingReview) {
    throw new Error("Ya has reseñado este libro. Puedes editar tu reseña existente si deseas actualizarla.");
  }

  // Validar rating
  if (rating < 1 || rating > 5) {
    throw new Error("La calificación debe estar entre 1 y 5");
  }

  const review = reviewRepository.create({
    comment,
    rating,
    title: title || null,
    bookId,
    userId,
    book,
    user
  });

  const savedReview = await reviewRepository.save(review);

  return {
    id: savedReview.id,
    comment: savedReview.comment,
    rating: savedReview.rating,
    title: savedReview.title || undefined,
    createdAt: savedReview.createdAt,
    updatedAt: savedReview.updatedAt,
    bookId: savedReview.bookId,
    userId: savedReview.userId,
    user: {
      id: user.id,
      name: user.name,
      surname: user.surname
    }
  };
};

export const getReviewsByBookService = async (bookId: string, page: number = 1, limit: number = 10): Promise<ReviewListDto> => {
  // Verificar que el libro existe
  const book = await bookRepository.findOne({ where: { id: bookId } });
  if (!book) {
    throw new Error("Libro no encontrado");
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await reviewRepository.findAndCount({
    where: { bookId },
    relations: ["user"],
    order: { createdAt: "DESC" },
    skip,
    take: limit
  });

  // Calcular estadísticas
  const allReviews = await reviewRepository.find({
    where: { bookId },
    select: ["rating"]
  });

  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
    : 0;

  const ratingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  allReviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
  });

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
    }
  }));

  return {
    reviews: reviewResponseDtos,
    total,
    averageRating: Math.round(averageRating * 100) / 100,
    ratingDistribution
  };
};

export const updateReviewService = async (reviewId: string, userId: string, updateData: UpdateReviewDto): Promise<ReviewResponseDto> => {
  const review = await reviewRepository.findOne({
    where: { id: reviewId, userId },
    relations: ["user"]
  });

  if (!review) {
    throw new Error("Reseña no encontrada o no tienes permiso para editarla");
  }

  // Validar rating si se proporciona
  if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
    throw new Error("La calificación debe estar entre 1 y 5");
  }

  // Actualizar campos
  if (updateData.comment) review.comment = updateData.comment;
  if (updateData.rating) review.rating = updateData.rating;
  if (updateData.title !== undefined) review.title = updateData.title;

  const updatedReview = await reviewRepository.save(review);

  return {
    id: updatedReview.id,
    comment: updatedReview.comment,
    rating: updatedReview.rating,
    title: updatedReview.title || undefined,
    createdAt: updatedReview.createdAt,
    updatedAt: updatedReview.updatedAt,
    bookId: updatedReview.bookId,
    userId: updatedReview.userId,
    user: {
      id: review.user.id,
      name: review.user.name,
      surname: review.user.surname
    }
  };
};

export const deleteReviewService = async (reviewId: string, userId: string): Promise<void> => {
  const review = await reviewRepository.findOne({
    where: { id: reviewId, userId }
  });

  if (!review) {
    throw new Error("Reseña no encontrada o no tienes permiso para eliminarla");
  }

  await reviewRepository.remove(review);
};

export const getUserReviewsService = async (userId: string, page: number = 1, limit: number = 10): Promise<ReviewListDto> => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await reviewRepository.findAndCount({
    where: { userId },
    relations: ["user", "book"],
    order: { createdAt: "DESC" },
    skip,
    take: limit
  });

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
    }
  }));

  // Calcular promedio de calificaciones del usuario
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return {
    reviews: reviewResponseDtos,
    total,
    averageRating: Math.round(averageRating * 100) / 100,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };
};
export const getAllReviewsService = async (page: number = 1, limit: number = 6): Promise<ReviewListDto> => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await reviewRepository.findAndCount({
    relations: ["user", "book"],
    order: { createdAt: "DESC" },
    skip,
    take: limit
  });

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
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };
};
