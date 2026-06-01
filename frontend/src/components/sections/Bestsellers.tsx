"use client"
import React, { useRef, useState, useEffect } from 'react'
import BookCard from '@/components/cards/BookCard'
import { IBook } from '@/types/Book'
import { Award, Loader2, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBooks } from '@/hooks/useBooks'

const Bestsellers = () => {
  const { books, loading, error } = useBooks()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  // Duplicar elementos para crear loop infinito
  const getInfiniteBestsellers = (): IBook[] => {
    const bestsellers: IBook[] = []
    for (let i = 0; i < books.length; i += 5) {
      if (books[i]) {
        bestsellers.push(books[i])
      }
    }
    // Duplicar los elementos 4 veces para loop suave
    return [...bestsellers, ...bestsellers, ...bestsellers, ...bestsellers]
  }

  const infiniteBestsellers = getInfiniteBestsellers()

  useEffect(() => {
    if (!carouselRef.current || !isAutoScrolling) return

    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const contentWidth = carouselRef.current.scrollWidth
        const maxScroll = contentWidth / 4 // Un cuarto del total (un set completo)
        const currentScroll = carouselRef.current.scrollLeft

        if (currentScroll >= maxScroll) {
          // Resetear al inicio sin animación cuando completa un ciclo
          carouselRef.current.scrollLeft = 0
        } else {
          carouselRef.current.scrollLeft += 0.5 // Velocidad más suave
        }
      }
    }, 20) // Velocidad del auto-scroll (más frecuente = más suave)

    return () => clearInterval(scrollInterval)
  }, [isAutoScrolling, infiniteBestsellers])

  const scrollLeft = () => {
    setIsAutoScrolling(false)
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' })
      setTimeout(() => setIsAutoScrolling(true), 3000)
    }
  }

  const scrollRight = () => {
    setIsAutoScrolling(false)
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' })
      setTimeout(() => setIsAutoScrolling(true), 3000)
    }
  }

  if (loading) {
    return (
      <section id="bestsellers" className="py-24 px-4 bg-[#1a3a1c] relative overflow-hidden flex items-center justify-center min-h-[600px]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f5efe1_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="relative z-10 text-center">
          <Loader2 className="w-16 h-16 text-[#f5efe1] animate-spin mx-auto mb-6 opacity-50" />
          <h2 className="text-xl font-black uppercase text-[#f5efe1] tracking-[0.3em] animate-pulse">Consultando el Ranking</h2>
        </div>
      </section>
    )
  }

  if (error || infiniteBestsellers.length === 0) {
    return (
      <section id="bestsellers" className="py-16 px-4 bg-[#2e4b30] border-y border-[#1a3a1c]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#f5efe1] text-lg font-bold uppercase tracking-widest opacity-50">
            {error ? "Error al sincronizar tendencias" : "Ranking temporalmente vacío"}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="bestsellers" className="py-24 px-4 bg-[#2e4b30] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-[#1a3a1c] opacity-20 uppercase tracking-tighter leading-none whitespace-nowrap">
          Essential Hits
        </div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f5efe1]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f5efe1]/10 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header con estilo Innovador */}
        <div className="relative mb-20 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-l-4 border-[#f5efe1] pl-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-12 bg-[#f5efe1]"></div>
                <span className="text-[#f5efe1] text-xs font-black uppercase tracking-[0.4em]">Propuesta Editorial</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-[#f5efe1] uppercase leading-none tracking-tighter mb-4">
                Bestsellers <span className="text-transparent border-b-4 border-dotted border-[#f5efe1] [-webkit-text-stroke:1px_#f5efe1]">Week</span>
              </h2>
              <p className="text-[#f5efe1]/70 text-sm font-medium leading-relaxed max-w-lg">
                Nuestra curaduría semanal de los títulos que están definiendo el mercado. Calidad, impacto y relevancia cultural en cada página.
              </p>
            </div>
            
            <div className="hidden lg:flex flex-col items-end text-right">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-[#f5efe1]" />
                <span className="text-[#f5efe1] font-black text-sm uppercase tracking-widest">Live Ranking</span>
              </div>
              <p className="text-[#f5efe1]/40 text-[10px] uppercase font-bold tracking-tighter">Actualizado hace unos instantes</p>
            </div>
          </div>
        </div>

        {/* Bestsellers Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-[#f5efe1] text-[#2e4b30] p-3 shadow-lg hover:bg-[#2e4b30] hover:text-[#f5efe1] transition-all duration-300 -ml-4"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-[#f5efe1] text-[#2e4b30] p-3 shadow-lg hover:bg-[#2e4b30] hover:text-[#f5efe1] transition-all duration-300 -mr-4"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-hidden pb-8 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {infiniteBestsellers.map((book: IBook, index: number) => (
              <div key={`${book.id}-${index}`} className="relative group perspective-1000 animate-scale-in flex-shrink-0 w-80" style={{ animationDelay: `${index * 150}ms` }}>
                {/* Massive Modern Numbering */}
                <div className="absolute -top-12 left-4 text-9xl font-black text-[#1a3a1c]/40 group-hover:text-[#f5efe1]/10 transition-colors duration-500 z-0 pointer-events-none tracking-tighter">
                  {String((index % Math.floor(infiniteBestsellers.length / 4)) + 1).padStart(2, '0')}
                </div>
                
                {/* Card Container */}
                <div className="relative z-10 transform-gpu group-hover:-translate-y-4 transition-transform duration-500 ease-out">

                  <div className="shadow-2xl shadow-black/20">
                    <BookCard book={book} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Label */}
      <div className="hidden 2xl:block absolute top-[20%] -right-12 origin-bottom-right -rotate-90">
        <span className="text-[#f5efe1]/20 text-6xl font-black uppercase tracking-[0.5em] select-none whitespace-nowrap">
          Exclusive Selection
        </span>
      </div>
    </section>
  )
}

export default Bestsellers
