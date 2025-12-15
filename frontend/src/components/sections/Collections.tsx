"use client";
import React, { useState } from "react";
import BookCard from "@/components/cards/BookCard";
import { IBook } from "@/types/Book";
import { BookOpen, Sparkles, Heart, Zap, Shield, Brain, Telescope, Crown, Star, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";

const Collections = () => {
  const { books, loading, error } = useBooks();
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Agrupar los libros por género
  const groupBooksByGenre = (): Record<string, IBook[]> => {
    return books.reduce((groups, book) => {
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
  const allBooks = books;

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
      Fantasy: "Mundos mágicos y aventuras épicas",
      "Dystopian Fiction": "Futuros oscuros y advertencias sociales",
      "Classic Literature": "Obras maestras atemporales de la literatura",
      Romance: "Historias de amor y relatos románticos",
      "Coming-of-Age": "Historias de crecimiento y autodescubrimiento",
      Thriller: "Suspenso y emoción que te mantendrán al borde del asiento",
      "Crime Thriller": "Crímenes misteriosos e investigaciones",
      "Psychological Thriller": "Suspenso psicológico que desafía la mente",
      "Science Fiction": "Mundos futuristas y maravillas científicas",
      "Literary Fiction": "Obras literarias que invitan a la reflexión",
      "Historical Fiction": "Historias ambientadas en períodos históricos",
      "Young Adult Romance": "Historias románticas para jóvenes adultos",
      "Philosophical Fiction": "Pensamientos profundos y reflexiones sobre la vida",
      Memoir: "Historias personales y experiencias de vida",
    };
    return descriptions[genre] || "Explora esta colección";
  };

  if (loading) {
    return (
      <section id="collections" className="py-16 px-4 bg-gradient-to-b from-white to-[#f5efe1] text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#2e4b30] animate-spin mx-auto mb-3" />
              <p className="text-[#2e4b30] text-sm">Cargando colecciones...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="collections" className="py-16 px-4 bg-gradient-to-b from-white to-[#f5efe1] text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 text-sm mb-3">{error}</p>
              <p className="text-[#2e4b30] opacity-70 text-xs">No se pudieron cargar las colecciones</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section id="collections" className="py-16 px-4 bg-gradient-to-b from-white to-[#f5efe1] text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-[#2e4b30] text-sm">No hay colecciones disponibles</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="py-16 px-4 bg-gradient-to-b from-white to-[#f5efe1] text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1a3a1c] mb-3 flex items-center justify-center gap-3">
            <BookOpen className="w-6 h-6 text-[#2e4b30]" />
            Colecciones
            <BookOpen className="w-6 h-6 text-[#2e4b30]" />
          </h2>
          <p className="text-sm text-[#2e4b30] opacity-80 max-w-2xl mx-auto">
            Descubre libros organizados por género y encuentra tu próxima lectura favorita
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
              Todos los Géneros
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
                Todos los Géneros
              </h3>
              <p className="text-lg text-[#2e4b30] opacity-80">
                Explora nuestra colección completa de {allBooks.length} libros
              </p>
            </div>

            {/* Contenedor del Carrusel */}
            <div className="relative">
              {/* Flechas de Navegación */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-[#2e4b30] text-[#f5efe1] p-3 rounded-full shadow-lg hover:bg-[#1a3a1c] transition-all duration-300"
                aria-label="Libros anteriores"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-[#2e4b30] text-[#f5efe1] p-3 rounded-full shadow-lg hover:bg-[#1a3a1c] transition-all duration-300"
                aria-label="Siguientes libros"
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
                    aria-label={`Ir a la diapositiva ${i + 1}`}
                  />
                ))}
              </div>

              {/* Contador de Libros */}
              <div className="text-center mt-4">
                <p className="text-sm text-[#2e4b30] opacity-70">
                  Mostrando libros {currentIndex + 1}-{Math.min(currentIndex + 4, allBooks.length)} de {allBooks.length}
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
              Volver a Todas las Colecciones
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
                  {genreGroups[selectedGenre].length} libros en esta colección
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
