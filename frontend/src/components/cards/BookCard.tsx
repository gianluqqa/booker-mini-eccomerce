"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IBookCardProps } from "@/types/Book";
import Link from "next/link";
import Image from "next/image";
import { Eye, ShoppingCart, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAddToCart } from "@/hooks/useAddToCart";

const BookCard: React.FC<IBookCardProps> = ({ book }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addBookToCart, loading, error, resetError } = useAddToCart();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

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

  return (
    <div className="bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm border border-[#f5efe1] border-opacity-20 rounded-xl p-6 hover:bg-opacity-10 transition-all duration-300 group cursor-pointer">
      {/* Imagen del libro */}
      <div className="aspect-[3/4] bg-[#f5efe1] bg-opacity-10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {book.image && !imageError ? (
          <Image
            src={book.image}
            alt={book.title}
            width={200}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            unoptimized={book.image.includes('example.com')}
          />
        ) : (
          <div className="text-[#2e4b30] text-4xl opacity-50">📚</div>
        )}
      </div>

      {/* Información del libro */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#1a3a1c] line-clamp-2 group-hover:text-[#0f2410] transition-colors duration-300">
          {book.title}
        </h3>

        <p className="text-[#1a3a1c] opacity-80 text-sm">{book.author}</p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-[#1a3a1c]">${book.price}</div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              book.stock > 0
                ? "bg-[#2e4b30] text-[#f5efe1]"
                : "bg-red-100 text-red-600"
            }`}
          >
            {book.stock > 0 ? `${book.stock} disponibles` : "Sin stock"}
          </div>
        </div>

        {/* Mensajes de feedback */}
        {(error || successMessage) && (
          <div
            className={`px-3 py-2 rounded-lg text-xs font-medium ${
              error
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {error || successMessage}
          </div>
        )}

        {/* Botones de Accion */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
              book.stock > 0 && !loading
                ? "bg-[#2e4b30] text-[#f5efe1] hover:bg-[#1a3a1c] hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={book.stock === 0 || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Añadiendo...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {book.stock > 0 ? "Añadir al carrito" : "No disponible"}
              </>
            )}
          </button>
          
          {/* Botones de Detalles*/}
          <Link
            href={`/book/${book.id}`}
            className="flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 bg-[#f5efe1] text-[#2e4b30] hover:bg-[#2e4b30] hover:text-[#f5efe1] hover:shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
