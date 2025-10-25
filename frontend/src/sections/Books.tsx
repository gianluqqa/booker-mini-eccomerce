"use client"
import React from "react";
import booksData from "@/helpers/booksData";
import BookCard from "@/components/cards/BookCard";

const Books = () => {
  // Duplicar los libros para crear un carrusel infinito
  const duplicatedBooks = [...booksData, ...booksData];

  return (
    <section className="bg-[#f5efe1] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#2e4b30] bg-opacity-10 rounded-full mb-6">
            <span className="text-[#f5efe1] text-sm font-medium tracking-wide">
              OUR BOOKS
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2e4b30] mb-6 leading-tight">
            Discover Our Collection
          </h2>

          <p className="text-[#2e4b30] text-lg sm:text-xl opacity-80 max-w-3xl mx-auto">
            Explore our carefully curated collection of books from all
            categories
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
          {booksData.slice(0, 4).map((book) => (
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
