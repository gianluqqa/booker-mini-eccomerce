"use client";
import React, { useState } from "react";
import booksData from "@/helpers/booksData";
import BookCard from "@/components/cards/BookCard";
import { IBook } from "@/interfaces/Book";
import {
  BookOpen,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Brain,
  Telescope,
  Crown,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const Collections = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  // Group books by genre
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

  // Get genre icon
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

  // Get genre description
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
    <section className="py-16 px-4 bg-gradient-to-b from-white to-[#f5efe1]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Genre Navigation */}
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

        {/* Collections Display */}
        {selectedGenre === "" ? (
          // Show all collections
          <div className="space-y-16">
            {genres.map((genre) => (
              <div
                key={genre}
                className="bg-white rounded-2xl p-8 shadow-lg border border-[#f5efe1]"
              >
                {/* Collection Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[#2e4b30] text-[#f5efe1] rounded-xl">
                    {getGenreIcon(genre)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1a3a1c]">
                      {genre}
                    </h3>
                    <p className="text-[#2e4b30] opacity-80">
                      {getGenreDescription(genre)}
                    </p>
                    <p className="text-sm text-[#2e4b30] opacity-60">
                      {genreGroups[genre].length} books in this collection
                    </p>
                  </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {genreGroups[genre].slice(0, 4).map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Show More Button */}
                {genreGroups[genre].length > 4 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setSelectedGenre(genre)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#2e4b30] text-[#f5efe1] rounded-lg hover:bg-[#1a3a1c] transition-all duration-300"
                    >
                      View All {genreGroups[genre].length} Books
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Show selected genre collection
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#f5efe1]">
            {/* Back Button */}
            <button
              onClick={() => setSelectedGenre("")}
              className="flex items-center gap-2 text-[#2e4b30] hover:text-[#1a3a1c] transition-colors duration-300 mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to All Collections
            </button>

            {/* Selected Collection Header */}
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

            {/* All Books in Collection */}
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
