// Componente de dropdown para mostrar resultados de búsqueda
// Este componente muestra una lista desplegable con los libros encontrados
// cuando el usuario está buscando

"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, BookOpen } from "lucide-react";
import { IBook } from "@/types/Book";

interface SearchDropdownProps {
  results: IBook[];
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
}

/**
 * Componente que muestra un dropdown con los resultados de búsqueda
 * @param results - Lista de libros encontrados
 * @param loading - Indica si está cargando los resultados
 * @param isOpen - Indica si el dropdown debe estar visible
 * @param onClose - Función para cerrar el dropdown
 * @param searchQuery - Término de búsqueda actual
 */
const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  loading,
  isOpen,
  onClose,
  searchQuery,
}) => {
  // Si no está abierto o no hay query, no mostrar nada
  if (!isOpen || !searchQuery.trim()) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-[#2e4b30]/20 z-50 max-h-96 overflow-y-auto">
      {loading ? (
        // Mostrar indicador de carga mientras busca
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#2e4b30] animate-spin mr-2" />
          <span className="text-[#2e4b30] text-sm">Buscando...</span>
        </div>
      ) : results.length > 0 ? (
        // Mostrar lista de resultados
        <div className="py-2" onClick={(e) => e.stopPropagation()}>
          {results.map((book) => {
            // Solo mostrar el libro si tiene ID
            if (!book.id) return null;
            
            return (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                onClick={() => {
                  // Cerrar el dropdown cuando se hace clic en un libro
                  onClose();
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#f5efe1] transition-colors duration-200 border-b border-[#2e4b30]/10 last:border-b-0 cursor-pointer block"
              >
              {/* Imagen del libro */}
              <div className="flex-shrink-0 w-12 h-16 bg-[#f5efe1] rounded overflow-hidden">
                {book.image ? (
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={48}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#2e4b30]/40" />
                  </div>
                )}
              </div>

              {/* Información del libro */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#2e4b30] truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-[#2e4b30]/70 truncate">
                  {book.author}
                </p>
                <p className="text-sm font-bold text-[#2e4b30] mt-1">
                  ${book.price.toFixed(2)}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      ) : (
        // Mostrar mensaje cuando no hay resultados
        <div className="py-8 px-4 text-center">
          <p className="text-[#2e4b30]/70 text-sm">
            No se encontraron libros para &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;

