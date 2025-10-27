"use client";
import React, { useState } from "react";
import booksData from "@/helpers/booksData";
import BookCard from "@/components/cards/BookCard";
import { IBook } from "@/interfaces/Book";
import { BookOpen, Sparkles, Heart, Zap, Shield, Brain, Telescope, Crown, Star, ChevronRight, ChevronLeft } from "lucide-react";

const Collections = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Agrupar los libros por género
  const groupBooksByGenre = (): Record<string, IBook[]> => {
    return booksData.reduce((groups, book) => {
      const genre = book.genre;
      if (!groups[genre]) {
        groups[genre] = [];
      }
      groups[genre].push(book);
      return groups;
    }, {} as Record<string, IBook[]>);
  };

  const genreGroups = groupBooksByGenre();
  const genres = Object.keys(genreGroups);

  // Crear un array de todos los libros para el carrusel
  const allBooks = booksData;

  // Funciones para la navegación del carrusel
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allBooks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allBooks.length) % allBooks.length);
  };

  // Función para obtener los libros visibles en el carrusel
  const getVisibleBooks = () => {
    const visibleBooks = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % allBooks.length;
      visibleBooks.push(allBooks[index]);
    }
    return visibleBooks;
  };

  // Obtener el ícono para un género
  const getGenreIcon = (genre: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Fantasy: <Crown className="w-6 h-6" />,
      "Dystopian Fiction": <Shield className="w-6 h-6" />,
      "Classic Literature": <BookOpen className="w-6 h-6" />,
      Romance: <Heart className="w-6 h-6" />,
      "Coming-of-Age": <Sparkles className="w-6 h-6" />,
      Thriller: <Zap className="w-6 h-6" />,
      "Crime Thriller": <Zap className="w-6 h-6" />,
      "Psychological Thriller": <Brain className="w-6 h-6" />,
      "Science Fiction": <Telescope className="w-6 h-6" />,
      "Literary Fiction": <BookOpen className="w-6 h-6" />,
      "Historical Fiction": <BookOpen className="w-6 h-6" />,
      "Young Adult Romance": <Heart className="w-6 h-6" />,
      "Philosophical Fiction": <Brain className="w-6 h-6" />,
      Memoir: <Star className="w-6 h-6" />,
    };
    return iconMap[genre] || <BookOpen className="w-6 h-6" />;
  };

  // Obtener la descripción para un género
  const getGenreDescription = (genre: string) => {
    const descriptions: Record<string, string> = {
      Fantasy: "Magical worlds and epic adventures",
      "Dystopian Fiction": "Dark futures and societal warnings",
      "Classic Literature": "Timeless masterpieces of literature",
      Romance: "Love stories and romantic tales",
      "Coming-of-Age": "Stories of growth and self-discovery",
      Thriller: "Edge-of-your-seat suspense and excitement",
      "Crime Thriller": "Mysterious crimes and investigations",
      "Psychological Thriller": "Mind-bending psychological suspense",
      "Science Fiction": "Futuristic worlds and scientific wonders",
      "Literary Fiction": "Thought-provoking literary works",
      "Historical Fiction": "Stories set in historical periods",
      "Young Adult Romance": "Romantic stories for young adults",
      "Philosophical Fiction": "Deep thoughts and life reflections",
      Memoir: "Personal life stories and experiences",
    };
    return descriptions[genre] || "Explore this collection";
  };

  return (
    <section id="collections" className="py-16 px-4 bg-gradient-to-b from-white to-[#f5efe1]">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1a3a1c] mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-[#2e4b30]" />
            Collections
            <BookOpen className="w-8 h-8 text-[#2e4b30]" />
          </h2>
          <p className="text-lg text-[#2e4b30] opacity-80 max-w-2xl mx-auto">
            Discover books organized by genre and find your next favorite read
          </p>
        </div>

        {/* Navegación por Género */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => setSelectedGenre("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedGenre === ""
                  ? "bg-[#2e4b30] text-[#f5efe1]"
                  : "bg-[#f5efe1] text-[#2e4b30] hover:bg-[#2e4b30] hover:text-[#f5efe1]"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedGenre === genre
                    ? "bg-[#2e4b30] text-[#f5efe1]"
                    : "bg-[#f5efe1] text-[#2e4b30] hover:bg-[#2e4b30] hover:text-[#f5efe1]"
                }`}
              >
                {getGenreIcon(genre)}
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Muestra de Colecciones */}
        {selectedGenre === "" ? (
          // Mostrar carrusel para todos los libros
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#f5efe1]">
            {/* Encabezado del Carrusel */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-[#1a3a1c] mb-4 flex items-center justify-center gap-3">
                <div className="p-2 bg-[#2e4b30] text-[#f5efe1] rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                All Genres
              </h3>
              <p className="text-lg text-[#2e4b30] opacity-80">
                Explore our complete collection of {allBooks.length} books
              </p>
            </div>

            {/* Contenedor del Carrusel */}
            <div className="relative">
              {/* Flechas de Navegación */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-[#2e4b30] text-[#f5efe1] p-3 rounded-full shadow-lg hover:bg-[#1a3a1c] transition-all duration-300"
                aria-label="Previous books"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-[#2e4b30] text-[#f5efe1] p-3 rounded-full shadow-lg hover:bg-[#1a3a1c] transition-all duration-300"
                aria-label="Next books"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Cuadrícula de Libros */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {getVisibleBooks().map((book, index) => (
                  <div key={`${book.id}-${currentIndex}-${index}`} className="transition-all duration-500">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>

              {/* Indicadores del Carrusel */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.min(5, allBooks.length) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentIndex % 5
                        ? 'bg-[#2e4b30]'
                        : 'bg-[#2e4b30]/30 hover:bg-[#2e4b30]/50'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Contador de Libros */}
              <div className="text-center mt-4">
                <p className="text-sm text-[#2e4b30] opacity-70">
                  Showing books {currentIndex + 1}-{Math.min(currentIndex + 4, allBooks.length)} of {allBooks.length}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Mostrar la colección del género seleccionado
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#f5efe1]">
            {/* Botón de Regreso */}
            <button
              onClick={() => setSelectedGenre("")}
              className="flex items-center gap-2 text-[#2e4b30] hover:text-[#1a3a1c] transition-colors duration-300 mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to All Collections
            </button>

            {/* Encabezado de la Colección Seleccionada */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-[#2e4b30] text-[#f5efe1] rounded-xl">
                {getGenreIcon(selectedGenre)}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#1a3a1c]">
                  {selectedGenre}
                </h3>
                <p className="text-lg text-[#2e4b30] opacity-80">
                  {getGenreDescription(selectedGenre)}
                </p>
                <p className="text-[#2e4b30] opacity-60">
                  {genreGroups[selectedGenre].length} books in this collection
                </p>
              </div>
            </div>

            {/* Todos los Libros de la Colección */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {genreGroups[selectedGenre].map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Collections;
