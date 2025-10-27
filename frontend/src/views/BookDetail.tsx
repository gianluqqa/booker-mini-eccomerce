import booksData from "@/helpers/booksData";
import { IPropsId } from "@/interfaces/IProps";
import React from "react";
import { ShoppingCart, Star, BookOpen, User, DollarSign, Package, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BookDetail = ({ params }: IPropsId) => {
  const book = booksData.find((book) => book.id === params.id);

  if (!book) {
    return (
      <div className="min-h-screen bg-[#f5efe1] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#2e4b30] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2e4b30] mb-2">Book Not Found</h2>
          <p className="text-[#2e4b30] opacity-70 mb-6">The book you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2e4b30] text-[#f5efe1] rounded-lg hover:bg-[#1a3a1c] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Botón de Regreso */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#2e4b30] hover:text-[#1a3a1c] transition-colors duration-300 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Contenido Principal */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#f5efe1] overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">
            {/* Imagen del Libro */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-sm">
                <div className="aspect-[3/4] w-full relative overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={book.image || "/placeholder-book.jpg"}
                    alt={book.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {/* Insignia de Stock */}
                <div className="absolute top-4 right-4 bg-[#2e4b30] text-[#f5efe1] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {book.stock} in stock
                </div>
              </div>
            </div>

            {/* Información del Libro */}
            <div className="flex flex-col justify-between min-h-[500px]">
              {/* Contenido Principal */}
              <div className="space-y-6">
                {/* Título y Autor */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#1a3a1c] mb-3 leading-tight">
                    {book.title}
                  </h1>
                  <div className="flex items-center gap-2 text-lg text-[#2e4b30] mb-4">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{book.author}</span>
                  </div>
                </div>

                {/* Género */}
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#2e4b30]" />
                  <span className="text-[#2e4b30] font-medium">Genre:</span>
                  <span className="px-3 py-1 bg-[#2e4b30] bg-opacity-10 text-[#f5efe1] rounded-full text-sm font-medium">
                    {book.genre}
                  </span>
                </div>

                {/* Precio */}
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-[#2e4b30]" />
                  <span className="text-3xl font-bold text-[#2e4b30]">
                    ${book.price}
                  </span>
                </div>

                {/* Descripción */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#1a3a1c] flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Description
                  </h3>
                  <p className="text-[#2e4b30] leading-relaxed text-lg">
                    {book.description}
                  </p>
                </div>

                {/* Introducción (si está disponible) */}
                {book.intro && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-[#1a3a1c] flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Introduction
                    </h3>
                    <p className="text-[#2e4b30] leading-relaxed">
                      {book.intro}
                    </p>
                  </div>
                )}
              </div>

              {/* Botón de Añadir al Carrito */}
              <div className="mt-auto pt-6">
                <button className="w-full bg-[#2e4b30] text-[#f5efe1] hover:bg-[#1a3a1c] transition-all duration-300 py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
