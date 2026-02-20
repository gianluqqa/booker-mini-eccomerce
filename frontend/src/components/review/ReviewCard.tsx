import React from "react";
import { Review } from "../../types/Review";
import { Star, Edit, Trash2 } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const isOwner = currentUserId === review.userId;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">
              {review.user.name} {review.user.surname}
            </span>
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
          </div>
          {review.title && (
            <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
          {isOwner && (
            <div className="flex gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Editar reseña"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(review.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar reseña"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      
      {review.updatedAt !== review.createdAt && (
        <p className="text-xs text-gray-500 mt-2 italic">
          Editada el {formatDate(review.updatedAt)}
        </p>
      )}
    </div>
  );
};
