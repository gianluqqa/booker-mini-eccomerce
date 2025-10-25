import React from "react";
import booksData from "@/helpers/booksData";
import BookCard from "@/components/cards/BookCard";

const Books = () => {
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

        {/* Grid de libros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {booksData.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;
