"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IBookCardProps } from "@/types/Book";
import { Eye, ShoppingCart, Loader2, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAddToCart } from "@/hooks/useAddToCart";
import { toggleFavorite } from "@/services/userService";



const BookCard: React.FC<IBookCardProps> = ({ book }) => {
  const router = useRouter();
  const { isAuthenticated, user, updateUser } = useAuth();
  const { addBookToCart, loading, error, resetError } = useAddToCart();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    user?.favorites?.some((f) => f.id === book.id) || false
  );

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    try {
      const result = await toggleFavorite(user.id, book.id!);
      setIsFavorite(result.isFavorite);

      // Actualizar el objeto usuario en el contexto
      const updatedFavorites = result.isFavorite
        ? [...(user.favorites || []), book]
        : (user.favorites || []).filter((f) => f.id !== book.id);

      updateUser({ ...user, favorites: updatedFavorites });
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };



  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    resetError();
    setSuccessMessage(null);

    // Verificar autenticación
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Verificar que el libro tenga ID
    if (!book.id) {
      return;
    }

    // Añadir al carrito
    const result = await addBookToCart({
      bookId: book.id,
      quantity: 1,
    });

    if (result) {
      setSuccessMessage("Libro añadido al carrito");
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleViewDetails = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!book.id) {
      console.error("El libro no tiene un ID válido");
      return;
    }

    router.push(`/book/${book.id}`);
  };

  // Validar que el libro tenga ID antes de renderizar
  if (!book.id) {
    return (
      <div className="block bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm rounded-none p-6 opacity-50">
        <p className="text-red-500 text-sm">Error: Libro sin ID válido</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm rounded-none p-6 hover:bg-opacity-10 transition-all duration-300 group border border-[#2e4b30]/5 hover:border-[#2e4b30]/20 shadow-sm hover:shadow-md">
      <div
        onClick={handleViewDetails}
        className="aspect-[3/4] bg-[#f5efe1] bg-opacity-10 rounded-none mb-4 flex items-center justify-center overflow-hidden cursor-pointer relative"
      >
        {/* Botón de favoritos */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 z-10 p-2 bg-[#f5efe1]/40 backdrop-blur-md rounded-none border border-[#2e4b30]/10 hover:bg-[#f5efe1] transition-all duration-300 group/heart"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'fill-red-600 text-red-600' : 'text-[#2e4b30] group-hover/heart:text-red-600'}`} 
          />
        </button>

        {book.image && !imageError ? (
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-[#2e4b30] text-4xl opacity-50">📚</div>
        )}
      </div>

      {/* Información del libro */}
      <div className="flex flex-col flex-1 mt-4">
        <div className="flex-1 space-y-3">
          <h3
            onClick={handleViewDetails}
            className="text-lg font-black text-[#1a3a1c] uppercase tracking-tighter line-clamp-2 group-hover:text-[#0f2410] transition-colors duration-300 cursor-pointer h-14"
          >
            {book.title}
          </h3>

          <p className="text-[#2e4b30]/60 text-[10px] font-black uppercase tracking-widest">{book.author}</p>

          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-black text-[#1a3a1c] tracking-tighter">${book.price}</div>

            <div
              className={`px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-tighter ${book.stock > 0
                ? "bg-[#2e4b30]/10 text-[#2e4b30] border border-[#2e4b30]/20"
                : "bg-red-50 text-red-600 border border-red-200"
                }`}
            >
              {book.stock > 0 ? `${book.stock} Unidades` : "Sin stock"}
            </div>
          </div>

          {/* Mensajes de feedback */}
          {(error || successMessage) && (
            <div
              className={`px-3 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest ${error
                ? "bg-red-50 text-red-700 border border-red-100"
                : "bg-green-50 text-green-700 border border-green-100"
                }`}
            >
              {error || successMessage}
            </div>
          )}
        </div>

        {/* Botones de Accion - Stacked for better fit and brutalist look */}
        <div className="flex flex-col gap-2 pt-6">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-4 rounded-none font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${book.stock > 0 && !loading
              ? "bg-[#2e4b30] text-[#f5efe1] hover:bg-black"
              : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
              }`}
            disabled={book.stock === 0 || loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{book.stock > 0 ? "Añadir" : "Agotado"}</span>
              </>
            )}
          </button>

          <button
            onClick={handleViewDetails}
            className="w-full py-3 px-4 rounded-none font-black uppercase text-[10px] tracking-[0.2em] bg-transparent text-[#2e4b30] border border-[#2e4b30] hover:bg-[#2e4b30] hover:text-[#f5efe1] transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Detalles</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
