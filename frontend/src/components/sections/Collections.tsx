import React, { useState } from "react";
import BookCard from "@/components/cards/BookCard";
import { IBook } from "@/types/Book";
import { BookOpen, Sparkles, Heart, Zap, Shield, Brain, Telescope, Crown, Star, ChevronRight, ChevronLeft, Loader2, Compass, Bookmark } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";

const Collections = () => {
  const { books, loading, error } = useBooks();
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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
  const allBooks = books;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allBooks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allBooks.length) % allBooks.length);
  };

  const scrollGenres = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getVisibleBooks = () => {
    const visibleBooks = [];
    if (allBooks.length === 0) return [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % allBooks.length;
      visibleBooks.push(allBooks[index]);
    }
    return visibleBooks;
  };

  const getGenreIcon = (genre: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Fantasy: <Crown className="w-4 h-4" />,
      "Dystopian Fiction": <Shield className="w-4 h-4" />,
      "Classic Literature": <Bookmark className="w-4 h-4" />,
      Romance: <Heart className="w-4 h-4" />,
      "Coming-of-Age": <Sparkles className="w-4 h-4" />,
      Thriller: <Zap className="w-4 h-4" />,
      "Crime Thriller": <Zap className="w-4 h-4" />,
      "Psychological Thriller": <Brain className="w-4 h-4" />,
      "Science Fiction": <Telescope className="w-4 h-4" />,
      "Literary Fiction": <BookOpen className="w-4 h-4" />,
      "Historical Fiction": <Compass className="w-4 h-4" />,
      "Young Adult Romance": <Heart className="w-4 h-4" />,
      "Philosophical Fiction": <Brain className="w-4 h-4" />,
      Memoir: <Star className="w-4 h-4" />,
    };
    return iconMap[genre] || <BookOpen className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <section id="collections" className="py-24 px-4 bg-[#f5efe1]">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="py-24 px-4 bg-[#f5efe1] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-1/2 left-0 text-[200px] font-black uppercase leading-none -rotate-90 origin-top-left select-none">Archives</div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER AREA */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-20">
          <div className="lg:col-span-8 space-y-6 border-l-4 border-[#2e4b30] pl-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[2px] w-12 bg-[#2e4b30]/20"></div>
              <span className="text-[#2e4b30]/60 text-xs font-black uppercase tracking-[0.4em]">Archivos de Booker</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-[#1a3a1c] uppercase tracking-tighter leading-[0.8] mb-4">
              Nuestras <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2e4b30] to-[#2e4b30]/40">Colecciones</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-[#2e4b30] text-sm font-semibold uppercase tracking-widest leading-relaxed border-r-4 border-[#2e4b30] pr-6 lg:ml-auto max-w-xs">
              Curaduría sistemática de géneros literarios que definen épocas y fronteras.
            </p>
          </div>
        </div>

        {/* GENRE NAVIGATION - Compact Top Row */}
        <div className="relative mb-8 bg-[#2e4b30]/5 p-2 flex items-center gap-2 border-y border-[#2e4b30]/10">
          <button
            onClick={() => scrollGenres('left')}
            className="p-3 bg-[#2e4b30] text-white hover:bg-black transition-all flex-shrink-0 z-20 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-2 no-scrollbar scroll-smooth flex-1 py-1"
          >
            <button
              onClick={() => setSelectedGenre("")}
              className={`flex-shrink-0 px-6 py-3 font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 border-2 ${selectedGenre === ""
                  ? "bg-[#2e4b30] border-[#2e4b30] text-[#f5efe1] shadow-lg"
                  : "bg-white border-[#2e4b30]/10 text-[#2e4b30]/60 hover:border-[#2e4b30]"
                }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Todos</span>
            </button>

            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`flex-shrink-0 px-6 py-3 font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 border-2 ${selectedGenre === genre
                    ? "bg-[#2e4b30] border-[#2e4b30] text-[#f5efe1] shadow-lg"
                    : "bg-white border-[#2e4b30]/10 text-[#2e4b30]/60 hover:border-[#2e4b30]"
                  }`}
              >
                {getGenreIcon(genre)}
                <span>{genre}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollGenres('right')}
            className="p-3 bg-[#2e4b30] text-white hover:bg-black transition-all flex-shrink-0 z-20 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT VIEWER */}
        <div className="bg-white/40 border-2 border-[#2e4b30]/10 p-6 md:p-10 relative shadow-xl min-h-[500px]">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#2e4b30]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#2e4b30]"></div>

          {selectedGenre === "" ? (
            /* GLOBAL VIEW */
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b border-[#2e4b30]/10 pb-6">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-[#1a3a1c] uppercase tracking-tighter">Vista General</h3>
                  <p className="text-[10px] font-bold text-[#2e4b30]/40 uppercase tracking-widest">{allBooks.length} Obras disponibles</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={prevSlide} className="p-3 bg-[#2e4b30] text-white hover:bg-black transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextSlide} className="p-3 bg-[#2e4b30] text-white hover:bg-black transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {getVisibleBooks().map((book, idx) => (
                  <div key={`${book.id}-${currentIndex}-${idx}`} className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* GENRE VIEW */
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#2e4b30] pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#2e4b30] text-white shadow-lg">
                    {getGenreIcon(selectedGenre)}
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-[#1a3a1c] uppercase tracking-tighter leading-none">{selectedGenre}</h3>
                    <p className="text-[10px] font-bold text-[#2e4b30]/50 uppercase tracking-widest mt-1">{genreGroups[selectedGenre].length} obras en esta carpeta</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {genreGroups[selectedGenre].map((book) => (
                  <div key={book.id} className="h-full animate-in fade-in zoom-in-95 duration-500">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Collections;

