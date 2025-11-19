"use client"
import React from "react";
import BookCard from "@/components/cards/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { Loader2 } from "lucide-react";

const Books = () => {
  const { books, loading, error } = useBooks();
  
  // Duplicar los libros para crear un carrusel infinito
  const duplicatedBooks = [...books, ...books];

  if (loading) {
    return (
      <section id="books" className="bg-[#f5efe1] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mx-auto mb-4" />
              <p className="text-[#2e4b30] text-lg">Cargando libros...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="books" className="bg-[#f5efe1] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <p className="text-[#2e4b30] opacity-70">No se pudieron cargar los libros</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section id="books" className="bg-[#f5efe1] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-[#2e4b30] text-lg">No hay libros disponibles</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="bg-[#f5efe1] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#2e4b30] bg-opacity-10 rounded-full mb-6">
            <span className="text-[#f5efe1] text-sm font-medium tracking-wide">
              NUESTROS LIBROS
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2e4b30] mb-6 leading-tight">
            Descubre Nuestra Colección
          </h2>

          <p className="text-[#2e4b30] text-lg sm:text-xl opacity-80 max-w-3xl mx-auto">
            Explora nuestra cuidadosamente seleccionada colección de libros de todas
            las categorías
          </p>
        </div>

        {/* Carrusel de libros - Solo visible en desktop */}
        <div className="hidden lg:block relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedBooks.map((book, index) => (
              <div key={`${book.id}-${index}`} className="flex-shrink-0 w-80 mx-4">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel más pequeño para tablets */}
        <div className="hidden md:block lg:hidden relative overflow-hidden">
          <div className="flex animate-scroll-tablet">
            {duplicatedBooks.map((book, index) => (
              <div key={`${book.id}-${index}`} className="flex-shrink-0 w-72 mx-3">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>

        {/* Grid estático para dispositivos móviles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-6 mt-8">
          {books.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scrollTablet {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite;
        }

        .animate-scroll-tablet {
          animation: scrollTablet 45s linear infinite;
        }

        .animate-scroll:hover,
        .animate-scroll-tablet:hover {
          animation-play-state: paused;
        }

        /* Gradientes en los bordes para efecto de desvanecimiento */
        .relative::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 100%;
          background: linear-gradient(to right, #f5efe1, transparent);
          z-index: 10;
          pointer-events: none;
        }

        .relative::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100%;
          background: linear-gradient(to left, #f5efe1, transparent);
          z-index: 10;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};

export default Books;
