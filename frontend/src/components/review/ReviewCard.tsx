import React from "react";
import { Review } from "../../types/Review";
import { Star, Edit, Trash2, Calendar } from "lucide-react";

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
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < rating
          ? "fill-[#2e4b30] text-[#2e4b30]"
          : "fill-transparent text-[#2e4b30]/20"
          }`}
        strokeWidth={3}
      />
    ));
  };

  const isOwner = currentUserId === review.userId;

  return (
    <div className="bg-white/50 border border-[#2e4b30]/10 rounded-none p-6 relative group transition-all hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(46,75,48,0.1)]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-[#1a3a1c] uppercase tracking-widest bg-[#2e4b30]/5 px-2 py-1 rounded-none">
              {review.user.name} {review.user.surname}
            </span>
            <div className="flex items-center gap-0.5">
              {renderStars(review.rating)}
            </div>
          </div>
          {review.title && (
            <h4 className="text-sm font-black text-[#1a3a1c] uppercase tracking-tight">{review.title}</h4>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#2e4b30]/40">
            <Calendar className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">{formatDate(review.createdAt)}</span>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  className="p-1.5 text-[#2e4b30] hover:bg-[#2e4b30] hover:text-[#f5efe1] rounded-none transition-all shadow-sm border border-[#2e4b30]/10"
                  title="Editar reseña"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(review.id)}
                  className="p-1.5 text-red-600 hover:bg-red-600 hover:text-white rounded-none transition-all shadow-sm border border-red-200"
                  title="Eliminar reseña"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-[#2e4b30] text-sm font-medium leading-relaxed border-l-2 border-[#2e4b30]/20 pl-4 py-1">
        {review.comment}
      </p>

      {review.updatedAt !== review.createdAt && (
        <div className="mt-4 flex items-center gap-2 opacity-30">
          <div className="h-[1px] w-4 bg-[#2e4b30]"></div>
          <p className="text-[8px] font-black uppercase tracking-widest italic-none">
            Editada: {formatDate(review.updatedAt)}
          </p>
        </div>
      )}
    </div>
  );
};
