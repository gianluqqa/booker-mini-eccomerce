import React from 'react'
import booksData from '@/helpers/booksData'
import BookCard from '@/components/cards/BookCard'
import { IBook } from '@/interfaces/Book'
import { BookOpen, Star, TrendingUp, Award } from 'lucide-react'

const Bestsellers = () => {
  // Method to get bestsellers: every 5 books from the 20
  const getBestsellers = (): IBook[] => {
    const bestsellers: IBook[] = []
    
    // Take every 5 books (indices 0, 5, 10, 15)
    for (let i = 0; i < booksData.length; i += 5) {
      if (booksData[i]) {
        bestsellers.push(booksData[i])
      }
    }
    
    return bestsellers
  }

  const bestsellers = getBestsellers()

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#f5efe1] to-white">
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
            Discover the most popular and highly rated books from our collection
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
            Selected from our collection of {booksData.length} books
          </p>
        </div>
      </div>
    </section>
  )
}

export default Bestsellers