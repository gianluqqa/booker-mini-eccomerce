"use client"
import React from "react";
import BookStrip from "@/components/cards/BookStrip";
import { useBooks } from "@/hooks/useBooks";
import { Loader2 } from "lucide-react";

const Books = () => {
  // Obtener todos los libros sin filtro
  const { books, loading, error } = useBooks();

  // Dividir libros en dos grupos para las dos filas (máximo 10 por fila según el usuario)
  const row1Books = books.slice(0, Math.ceil(books.length / 2)).slice(0, 10);
  const row2Books = books.slice(Math.ceil(books.length / 2)).slice(0, 10);

  // Duplicar para el efecto infinito
  const duplicatedRow1 = [...row1Books, ...row1Books];
  const duplicatedRow2 = [...row2Books, ...row2Books];

  if (loading) {
    return (
      <section id="books" className="bg-[#f5efe1] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#2e4b30] animate-spin mx-auto mb-3" />
            <p className="text-[#2e4b30] text-sm font-black uppercase tracking-widest">Sincronizando Archivos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || books.length === 0) {
    return (
      <section id="books" className="bg-[#f5efe1] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-[#2e4b30] text-sm font-black uppercase tracking-widest opacity-50">
              {error || "No se encontraron ejemplares disponibles"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="bg-[#f5efe1] py-24 overflow-hidden border-y border-[#2e4b30]/10">
      <div className="max-w-[1800px] mx-auto">
        {/* Header - Brutalist & Premium */}
        <div className="px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-block px-2 py-1 bg-[#2e4b30] text-[#f5efe1] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Archive 001
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-[#1a3a1c] uppercase tracking-tighter leading-[0.9]">
              The <br />Library
            </h2>
          </div>
          <p className="text-[#2e4b30] text-xs font-bold uppercase tracking-widest max-w-[280px] leading-relaxed opacity-60">
            Una selección técnica y estética de ejemplares literarios. Curaduría constante, renovación infinita.
          </p>
        </div>

        {/* Animation Container */}
        <div className="flex flex-col gap-4">
          {/* Row 1: Left to Right */}
          <div className="relative flex overflow-hidden group">
            <div className="flex gap-4 animate-scroll-right whitespace-nowrap">
              {duplicatedRow1.map((book, index) => (
                <div key={`r1-${book.id}-${index}`} className="flex-shrink-0">
                  <BookStrip book={book} />
                </div>
              ))}
            </div>

            {/* Mirror for smooth loop if small amount of books */}
            <div className="flex gap-4 animate-scroll-right whitespace-nowrap absolute top-0 left-0 translate-x-[-100%] group-hover:pause">
              {duplicatedRow1.map((book, index) => (
                <div key={`r1-mirror-${book.id}-${index}`} className="flex-shrink-0">
                  <BookStrip book={book} />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left (or Left to Right as requested, but I'll make them slightly offset for aesthetic) */}
          {row2Books.length > 0 && (
            <div className="relative flex overflow-hidden group">
              <div className="flex gap-4 animate-scroll-right-delayed whitespace-nowrap">
                {duplicatedRow2.map((book, index) => (
                  <div key={`r2-${book.id}-${index}`} className="flex-shrink-0">
                    <BookStrip book={book} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Grid (Optional fallback but keeping it clean) */}
        <div className="mt-12 px-6 md:hidden">
          <p className="text-[10px] font-black uppercase text-[#2e4b30]/40 tracking-widest mb-4">Preview Móvil</p>
          <div className="flex flex-col gap-3">
            {books.slice(0, 5).map(book => (
              <BookStrip key={`mob-${book.id}`} book={book} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-right {
          animation: scrollRight 40s linear infinite;
        }

        .animate-scroll-right-delayed {
          animation: scrollRight 50s linear infinite;
        }

        .group:hover .animate-scroll-right,
        .group:hover .animate-scroll-right-delayed {
          animation-play-state: paused;
        }

        /* Gradientes laterales para suavizar bordes */
        section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 15%;
          height: 100%;
          background: linear-gradient(to right, #f5efe1, transparent);
          z-index: 20;
          pointer-events: none;
        }

        section::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 15%;
          height: 100%;
          background: linear-gradient(to left, #f5efe1, transparent);
          z-index: 20;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};

export default Books;

