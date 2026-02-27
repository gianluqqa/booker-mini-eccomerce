import React, { useState } from "react";
import { CreateReviewDto, UpdateReviewDto, Review } from "../../types/Review";
import { Star, X, Check, Loader2 } from "lucide-react";
import { REVIEW_CONFIG, isValidReviewLength } from "@/config/reviewConfig";

interface ReviewFormProps {
  bookId: string;
  initialReview?: Review;
  onSubmit: (data: CreateReviewDto | UpdateReviewDto) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  initialReview,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [rating, setRating] = useState<number>(initialReview?.rating || 5);
  const [title, setTitle] = useState<string>(initialReview?.title || "");
  const [comment, setComment] = useState<string>(initialReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidReviewLength(comment)) return;
    setIsSubmitting(true);
    try {
      const data = isEditing
        ? { rating, title: title.trim() || undefined, comment }
        : { rating, title: title.trim() || undefined, comment, bookId };
      await onSubmit(data);
    } catch (error) {
      console.error("Error al guardar reseña:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          className="p-1 transition-transform hover:scale-125"
        >
          <Star
            className={`w-6 h-6 transition-all ${starValue <= (hoveredStar || rating)
              ? "fill-[#2e4b30] text-[#2e4b30]"
              : "fill-transparent text-[#2e4b30]/20"
              }`}
            strokeWidth={2.5}
          />
        </button>
      );
    });
  };

  return (
    <div className="bg-[#1a3a1c] p-[2px] rounded-none shadow-2xl">
      <div className="bg-[#f5efe1] p-8 border border-white/5 space-y-8">
        <div className="flex justify-between items-center border-b border-[#2e4b30]/10 pb-4">
          <h3 className="text-xl font-black text-[#1a3a1c] uppercase tracking-tighter">
            {isEditing ? "Corregir Reseña" : "Voz del Lector"}
          </h3>
          <button onClick={onCancel} className="text-[#2e4b30]/40 hover:text-[#2e4b30] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calificación */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#2e4b30] uppercase tracking-[0.3em] block">
                Valoración Cosmética
              </label>
              <div className="flex items-center gap-2 bg-white/40 p-3 border border-[#2e4b30]/10 rounded-none w-fit">
                {renderStars()}
                <span className="text-[10px] font-black text-[#2e4b30] ml-4 bg-[#2e4b30] text-white px-2 py-1">
                  {rating}/5
                </span>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#2e4b30] uppercase tracking-[0.3em] block">
                Resumen Corto
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="El corazón de tu crítica..."
                className="w-full bg-white/60 border-2 border-[#2e4b30]/10 p-3 focus:border-[#2e4b30] focus:outline-none text-sm font-bold text-[#2e4b30] placeholder-[#2e30]/30 transition-all rounded-none"
                maxLength={255}
              />
            </div>
          </div>

          {/* Comentario */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#2e4b30] uppercase tracking-[0.3em] block">
              Tu Pensamiento
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué universos descubriste en estas páginas?"
              rows={5}
              className="w-full bg-white/60 border-2 border-[#2e4b30]/10 p-4 focus:border-[#2e4b30] focus:outline-none text-sm font-bold text-[#2e4b30] resize-none placeholder-[#2e30]/30 transition-all rounded-none"
              required
              maxLength={REVIEW_CONFIG.MAX_CHARACTERS}
            />
            <div className="flex justify-end">
              <span className={`text-[10px] font-black uppercase tracking-widest ${comment.length > REVIEW_CONFIG.MAX_CHARACTERS - 100 ? "text-red-500" : "text-[#2e4b30]/40"}`}>
                {comment.length} / {REVIEW_CONFIG.MAX_CHARACTERS} Caracteres
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2e4b30] text-[#f5efe1] py-4 font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-[#1a3a1c] transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <><Check className="w-4 h-4" /> {isEditing ? "Actualizar Obra" : "Publicar mi Voz"}</>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 border-2 border-[#2e4b30]/10 text-[#2e4b30] font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#2e4b30]/5 transition-all"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
