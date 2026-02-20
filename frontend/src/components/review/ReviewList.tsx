import React, { useState, useEffect, useCallback } from "react";
import { Review, ReviewListDto, CreateReviewDto, UpdateReviewDto } from "../../types/Review";
import { getReviewsByBook } from "../../services/reviewService";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { Star, MessageSquare, BarChart3 } from "lucide-react";

interface ReviewListProps {
  bookId: string;
  currentUserId?: string;
  onReviewUpdated?: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  bookId,
  currentUserId,
  onReviewUpdated,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    averageRating: number;
    ratingDistribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
  }>({
    total: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data: ReviewListDto = await getReviewsByBook(bookId, 1, 50); // Obtener más reseñas para estadísticas
      setReviews(data.reviews);
      setStats({
        total: data.total,
        averageRating: data.averageRating,
        ratingDistribution: data.ratingDistribution,
      });
      setError(null);
    } catch (err) {
      setError("Error al cargar las reseñas");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchReviews();
  }, [bookId, fetchReviews]);

  const handleCreateReview = async (reviewData: CreateReviewDto | UpdateReviewDto) => {
    try {
      const { createReview } = await import("../../services/reviewService");
      await createReview(reviewData as CreateReviewDto);
      setShowForm(false);
      fetchReviews();
      onReviewUpdated?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la reseña";
      
      // Si el error es porque ya existe una reseña, mostrar opción de editar
      if (errorMessage.includes("Ya has reseñado")) {
        // Buscar la reseña existente del usuario
        const userReview = reviews.find(review => review.userId === currentUserId);
        if (userReview) {
          setEditingReview(userReview);
          return;
        }
      }
      
      throw error;
    }
  };

  const handleUpdateReview = async (reviewData: UpdateReviewDto) => {
    if (!editingReview) return;
    
    try {
      const { updateReview } = await import("../../services/reviewService");
      await updateReview(editingReview.id, reviewData);
      setEditingReview(null);
      fetchReviews();
      onReviewUpdated?.();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reseña?")) return;
    
    try {
      const { deleteReview } = await import("../../services/reviewService");
      await deleteReview(reviewId);
      fetchReviews();
      onReviewUpdated?.();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error al eliminar la reseña");
    }
  };

  const renderStars = (rating: number, size: "small" | "large" = "small") => {
    const starSize = size === "large" ? "w-6 h-6" : "w-4 h-4";
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const renderRatingDistribution = () => {
    const total = stats.total;
    if (total === 0) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-2 text-blue-600 hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calificación promedio */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {renderStars(Math.round(stats.averageRating), "large")}
              </div>
            </div>
            <p className="text-gray-600">
              {stats.total} {stats.total === 1 ? "reseña" : "reseñas"}
            </p>
          </div>

          {/* Distribución de calificaciones */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Distribución</span>
            </div>
            {renderRatingDistribution()}
          </div>
        </div>
      </div>

      {/* Formulario de crear/editar reseña */}
      {currentUserId && (showForm || editingReview) && (
        <ReviewForm
          bookId={bookId}
          initialReview={editingReview || undefined}
          onSubmit={editingReview ? handleUpdateReview : handleCreateReview}
          onCancel={() => {
            setShowForm(false);
            setEditingReview(null);
          }}
          isEditing={!!editingReview}
        />
      )}

      {/* Botón para agregar/editar reseña */}
      {currentUserId && !showForm && !editingReview && (
        <div className="flex flex-col items-center gap-2">
          {(() => {
            const userReview = reviews.find(review => review.userId === currentUserId);
            if (userReview) {
              return (
                <button
                  onClick={() => setEditingReview(userReview)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Editar mi reseña
                </button>
              );
            } else {
              return (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Escribir una reseña
                </button>
              );
            }
          })()}
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Este libro aún no tiene reseñas.</p>
            {currentUserId && !showForm && (
              <p className="text-sm mt-2">
                ¡Sé el primero en compartir tu opinión sobre este libro!
              </p>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              onEdit={currentUserId ? setEditingReview : undefined}
              onDelete={currentUserId ? handleDeleteReview : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
