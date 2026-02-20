import React, { useState } from "react";
import { CreateReviewDto, UpdateReviewDto, Review } from "../../types/Review";
import { Star } from "lucide-react";

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
    
    if (!comment.trim()) {
      alert("Por favor escribe un comentario");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const data = isEditing
        ? { rating, title: title.trim() || undefined, comment }
        : { rating, title: title.trim() || undefined, comment, bookId };
      
      await onSubmit(data);
    } catch (error) {
      console.error("Error al guardar reseña:", error);
      alert("Error al guardar la reseña. Por favor intenta nuevamente.");
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
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              starValue <= (hoveredStar || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-300"
            }`}
          />
        </button>
      );
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isEditing ? "Editar Reseña" : "Escribir una Reseña"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Calificación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación *
          </label>
          <div className="flex items-center gap-2">
            {renderStars()}
            <span className="text-sm text-gray-600 ml-2">
              {rating} de 5 estrellas
            </span>
          </div>
        </div>

        {/* Título (opcional) */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título (opcional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Breve resumen de tu opinión"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            maxLength={255}
          />
        </div>

        {/* Comentario */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comentario *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este libro..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
            required
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
};
