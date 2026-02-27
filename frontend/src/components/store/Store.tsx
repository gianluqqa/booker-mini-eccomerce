"use client";

import React, { useState, useEffect, useMemo } from "react";
import BookCard from "@/components/cards/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { Loader2, Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const Store = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Usamos el hook useBooks pasándole el query solo si queremos filtrar por backend
  // Por simplicidad y consistencia con lo pedido (mostrar todos), podemos filtrar localmente
  // o dejar que el hook lo maneje si el backend es eficiente.
  const { books, loading, error } = useBooks(searchQuery);

  // Reiniciar a la página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Cálculo de paginación
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = useMemo(() => {
    return books.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [books, startIndex]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (error) {
    return (
      <div className="bg-[#f5efe1] min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#2e4b30] text-[#f5efe1] rounded-sm hover:bg-[#1a3a1c] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5efe1] min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado de la Tienda */}
        <div className="mb-12 text-center md:text-left md:flex md:items-end md:justify-between border-b border-[#2e4b30] border-opacity-10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4b30] bg-opacity-10 rounded-sm mb-4">
              <BookOpen className="w-4 h-4 text-[#2e4b30]" />
              <span className="text-[#2e4b30] text-xs font-bold tracking-widest uppercase">
                Catálogo Completo
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2e4b30] mb-4">
              Nuestra Librería
            </h1>
            <p className="text-[#2e4b30] opacity-70 max-w-2xl">
              Explora nuestra colección cuidadosamente seleccionada. Desde clásicos hasta las últimas novedades, encuentra tu próxima gran lectura.
            </p>
          </div>

          {/* Barra de Búsqueda */}
          <div className="mt-8 md:mt-0 relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-[#2e4b30] opacity-50" />
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#2e4b30] border-opacity-20 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2e4b30] focus:ring-opacity-20 transition-all text-[#2e4b30]"
            />
          </div>
        </div>

        {/* Estado de Carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mb-4" />
            <p className="text-[#2e4b30] animate-pulse">Cargando tesoros literarios...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="text-6xl mb-4 opacity-20">📚</div>
            <h3 className="text-xl font-semibold text-[#2e4b30]">No encontramos libros</h3>
            <p className="text-[#2e4b30] opacity-60 mt-2">Prueba con otros términos de búsqueda.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 text-[#2e4b30] font-medium underline underline-offset-4"
            >
              Ver todos los libros
            </button>
          </div>
        ) : (
          <>
            {/* Grid de Libros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-sm border border-[#2e4b30] border-opacity-20 transition-all ${currentPage === 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-[#2e4b30] hover:text-[#f5efe1]"
                    }`}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1 mx-4">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Mostrar solo algunas páginas si hay demasiadas
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-sm text-sm font-medium transition-all ${currentPage === pageNum
                              ? "bg-[#2e4b30] text-[#f5efe1] shadow-md"
                              : "text-[#2e4b30] hover:bg-[#2e4b30] hover:bg-opacity-5"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (
                      (pageNum === 2 && currentPage > 3) ||
                      (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNum} className="px-1 text-[#2e4b30] opacity-50">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-sm border border-[#2e4b30] border-opacity-20 transition-all ${currentPage === totalPages
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-[#2e4b30] hover:text-[#f5efe1]"
                    }`}
                  aria-label="Siguiente página"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Resumen de resultados */}
            <div className="mt-8 text-center text-xs text-[#2e4b30] opacity-40">
              Mostrando {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, books.length)} de {books.length} libros
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Store;
