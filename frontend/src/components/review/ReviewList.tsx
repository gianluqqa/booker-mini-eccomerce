import React, { useState, useEffect, useCallback } from "react";
import { Review, ReviewListDto, CreateReviewDto, UpdateReviewDto } from "../../types/Review";
import { getReviewsByBook } from "../../services/reviewService";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { Star, MessageSquare, BarChart3, Loader2, Plus } from "lucide-react";
import Link from "next/link";

interface ReviewListProps {
  bookId: string;
  currentUserId?: string;
  onReviewUpdated?: () => void;
  mode?: "stats" | "feed" | "full";
}

export const ReviewList: React.FC<ReviewListProps> = ({
  bookId,
  currentUserId,
  onReviewUpdated,
  mode = "full"
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
      const data: ReviewListDto = await getReviewsByBook(bookId, 1, 50);
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
    const { createReview } = await import("../../services/reviewService");
    await createReview(reviewData as CreateReviewDto);
    setShowForm(false);
    fetchReviews();
    onReviewUpdated?.();
  };

  const handleUpdateReview = async (reviewData: UpdateReviewDto) => {
    if (!editingReview) return;
    const { updateReview } = await import("../../services/reviewService");
    await updateReview(editingReview.id, reviewData);
    setEditingReview(null);
    fetchReviews();
    onReviewUpdated?.();
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("¿Eliminar este pensamiento para siempre?")) return;
    const { deleteReview } = await import("../../services/reviewService");
    await deleteReview(reviewId);
    fetchReviews();
    onReviewUpdated?.();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating
          ? "fill-[#2e4b30] text-[#2e4b30]"
          : "fill-transparent text-[#2e4b30]/10"
          }`}
        strokeWidth={2.5}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/5 shadow-inner">
        <Loader2 className="w-8 h-8 text-[#2e4b30] animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase text-[#2e4b30] tracking-widest">Sincronizando pensamientos...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-12 ${mode === "stats" ? "h-full flex flex-col" : ""}`}>
      {/* Resumen de Estadísticas con un look minimalista y geométrico */}
      {(mode === "full" || mode === "stats") && (
        <div className={`bg-white/40 border border-[#2e4b30]/10 p-8 rounded-none shadow-sm ${mode === "stats" ? "flex-grow flex flex-col justify-center" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            <div className="md:col-span-4 text-center md:text-left space-y-2">
              <p className="text-[10px] font-black text-[#2e4b30]/50 uppercase tracking-[0.4em]">IMPACTO MEDIO</p>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-6xl font-black text-[#1a3a1c] tracking-tighter italic-none">
                  {stats.averageRating.toFixed(1)}
                </span>
                <div className="flex flex-col items-start gap-1">
                  <div className="flex">{renderStars(Math.round(stats.averageRating))}</div>
                  <p className="text-[9px] font-black text-[#2e4b30] uppercase opacity-40">
                    {stats.total} {stats.total === 1 ? "Lectura" : "Lecturas"}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col gap-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-[#2e4b30] w-2">{rating}</span>
                    <div className="flex-1 h-1.5 bg-[#2e4b30]/5 rounded-none overflow-hidden">
                      <div
                        className="bg-[#2e4b30] h-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-black text-[#2e4b30]/30 w-4 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {(mode === "full" || mode === "feed") && (
        <>
          {/* Acciones de Reseña */}
          <div className="flex justify-center">
            {!showForm && !editingReview && (
              currentUserId ? (
                (() => {
                  const userReview = reviews.find(review => review.userId === currentUserId);
                  if (userReview) return null; // No mostrar botón si ya tiene reseña (ya existe el icono de editar)

                  return (
                    <button
                      onClick={() => setShowForm(true)}
                      className="group relative px-10 py-4 bg-[#2e4b30] text-[#f5efe1] overflow-hidden rounded-none"
                    >
                      <div className="absolute inset-0 bg-[#1a3a1c] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <span className="relative flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em]">
                        <Plus className="w-4 h-4" />
                        Añadir Pensamiento
                      </span>
                    </button>
                  );
                })()
              ) : (
                <Link
                  href="/login"
                  className="text-[10px] font-black text-[#2e4b30]/60 uppercase tracking-widest border border-[#2e4b30]/20 px-6 py-3 hover:bg-[#2e4b30] hover:text-[#f5efe1] transition-all duration-300 cursor-pointer rounded-none"
                >
                  Inicia sesión para compartir tu voz
                </Link>
              )
            )}
          </div>

          {/* Formulario */}
          {currentUserId && (showForm || editingReview) && (
            <ReviewForm
              bookId={bookId}
              initialReview={editingReview || undefined}
              onSubmit={editingReview ? handleUpdateReview : handleCreateReview}
              onCancel={() => { setShowForm(false); setEditingReview(null); }}
              isEditing={!!editingReview}
            />
          )}

          {/* Feed de Reseñas */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-[#2e4b30]/10 rounded-none">
                <MessageSquare className="w-10 h-10 mx-auto mb-6 text-[#2e4b30]/10" />
                <p className="text-[10px] font-black text-[#2e4b30]/40 uppercase tracking-widest italic-none">El silencio es absoluto por ahora.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    currentUserId={currentUserId}
                    onEdit={setEditingReview}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
