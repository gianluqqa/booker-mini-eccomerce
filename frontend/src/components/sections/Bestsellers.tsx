"use client"
import React from 'react'
import BookCard from '@/components/cards/BookCard'
import { IBook } from '@/types/Book'
import { BookOpen, Star, TrendingUp, Award, Loader2 } from 'lucide-react'
import { useBooks } from '@/hooks/useBooks'

const Bestsellers = () => {
  const { books, loading, error } = useBooks()

  // Method to get bestsellers: every 5 books from the collection
  const getBestsellers = (): IBook[] => {
    const bestsellers: IBook[] = []
    
    // Take every 5 books (indices 0, 5, 10, 15, etc.)
    for (let i = 0; i < books.length; i += 5) {
      if (books[i]) {
        bestsellers.push(books[i])
      }
    }
    
    return bestsellers
  }

  const bestsellers = getBestsellers()

  if (loading) {
    return (
      <section id="bestsellers" className="py-16 px-4 bg-gradient-to-b from-[#f5efe1] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mx-auto mb-4" />
              <p className="text-[#2e4b30] text-lg">Cargando bestsellers...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="bestsellers" className="py-16 px-4 bg-gradient-to-b from-[#f5efe1] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <p className="text-[#2e4b30] opacity-70">No se pudieron cargar los bestsellers</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (bestsellers.length === 0) {
    return (
      <section id="bestsellers" className="py-16 px-4 bg-gradient-to-b from-[#f5efe1] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-[#2e4b30] text-lg">No hay bestsellers disponibles</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="bestsellers" className="py-16 px-4 bg-gradient-to-b from-[#f5efe1] to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-[#2e4b30]" />
            <h2 className="text-4xl font-bold text-[#1a3a1c]">
              Bestsellers
            </h2>
            <Star className="w-8 h-8 text-[#2e4b30]" />
          </div>
          <p className="text-lg text-[#2e4b30] opacity-80 max-w-2xl mx-auto flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Descubre los libros más populares y mejor valorados de nuestra colección
          </p>
        </div>

        {/* Bestsellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestsellers.map((book, index) => (
            <div key={book.id} className="relative">
              {/* Bestseller Badge */}
              <div className="absolute -top-2 -right-2 z-10 bg-[#2e4b30] text-[#f5efe1] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                #{index + 1}
              </div>
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <p className="text-[#2e4b30] opacity-70 flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            Seleccionados de nuestra colección de {books.length} libros
          </p>
        </div>
      </div>
    </section>
  )
}

export default Bestsellers