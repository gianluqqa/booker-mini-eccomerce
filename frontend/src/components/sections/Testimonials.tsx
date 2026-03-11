"use client";

import React from 'react';
import Link from 'next/link';
import { Quote, BookOpen, Loader2, ArrowRight, Star } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Review } from '@/types/Review';

const Testimonials = () => {
  const { testimonials, loading, error } = useTestimonials(1, 6);


  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#f5efe1]">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-[#2e4b30] animate-spin mb-4" />
          <p className="text-[#2e4b30] font-black uppercase tracking-widest text-sm">Sincronizando Reseñas...</p>
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return null; // Ocultar sección si no hay reseñas reales
  }

  return (
    <section id="testimonials" className="py-24 px-4 bg-[#f5efe1] overflow-hidden relative border-y border-[#2e4b30]/10">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Unificado Archive Style */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-[#2e4b30] pl-8 animate-fade-in-up">
          <div className="max-w-2xl">
            <div className="inline-block px-2 py-1 bg-[#2e4b30] text-[#f5efe1] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Archive 004 / Community
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-[#1a3a1c] uppercase tracking-tighter leading-[0.9]">
              Diálogo <br />Literario
            </h2>
          </div>
          <p className="text-[#2e4b30] text-[11px] font-bold uppercase tracking-[0.2em] max-w-[300px] leading-relaxed opacity-40">
            Ecos de lectura capturados en el tiempo. Perspectivas técnicas sobre la narrativa contemporánea.
          </p>
        </div>

        {/* Grid de Testimonios - Archive Case Design Alineado */}
        <div className="border-l-4 border-transparent pl-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial: Review, index) => (
              <Link
                key={testimonial.id}
                href={`/book/${testimonial.bookId}`}
                className="group relative bg-white border border-[#2e4b30]/10 p-6 flex flex-col justify-between aspect-square transition-all duration-700 hover:bg-[#2e4b30] animate-scale-in overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Overlay Decorativo Técnico */}
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-[40px] font-black text-[#2e4b30] group-hover:text-[#f5efe1]">0{index + 1}</span>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[#2e4b30]/30 group-hover:text-[#f5efe1]/30 uppercase tracking-[0.2em] transition-colors">
                        Fecha de Publicación
                      </span>
                      <span className="text-[10px] font-black text-[#2e4b30] group-hover:text-[#f5efe1] uppercase tracking-[0.1em] transition-colors">
                        {new Date(testimonial.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {/* Rating en Estrellas */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < testimonial.rating ? 'text-[#2e4b30] fill-current' : 'text-[#2e4b30]/10'} transition-all`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-4 -left-2 w-10 h-10 text-[#2e4b30]/5 group-hover:text-[#f5efe1]/5 transition-colors" />
                    
                    {/* Título de la Reseña */}
                    <h4 className="text-[11px] font-black text-[#2e4b30] group-hover:text-[#f5efe1] uppercase tracking-tight mb-2 transition-colors truncate">
                      {testimonial.title || "Impresión Literaria"}
                    </h4>

                    <blockquote className="text-xs md:text-[12px] font-medium text-[#2e4b30]/80 group-hover:text-[#f5efe1]/90 leading-relaxed uppercase tracking-tight transition-colors line-clamp-4">
                      &ldquo;{testimonial.comment}&rdquo;
                    </blockquote>
                  </div>
                </div>

                <div className="relative z-10 pt-6 border-t border-[#2e4b30]/5 group-hover:border-[#f5efe1]/10 transition-colors">
                  <div className="mb-4">
                    <h3 className="text-[10px] font-black text-[#2e4b30] group-hover:text-[#f5efe1] uppercase tracking-[0.2em] transition-colors">
                      {testimonial.user.name} {testimonial.user.surname}
                    </h3>
                  </div>

                  {testimonial.book && (
                    <div className="flex items-center gap-2 bg-[#f5efe1]/50 p-2 group-hover:bg-[#f5efe1]/10 transition-all border border-transparent group-hover:border-[#f5efe1]/20">
                      <BookOpen className="w-3 h-3 text-[#2e4b30]/40 group-hover:text-[#f5efe1]/40 transition-colors" />
                      <p className="text-[8px] font-black text-[#2e4b30] group-hover:text-[#f5efe1] uppercase truncate tracking-widest transition-colors">
                        {testimonial.book.title}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Action Reveal */}
        <div className="mt-20 flex flex-col items-center animate-fade-in">
          <p className="text-[9px] font-black text-[#2e4b30]/40 uppercase tracking-[0.6em] mb-8">Share your frequency</p>
          <button className="group relative px-12 py-5 bg-[#2e4b30] text-[#f5efe1] overflow-hidden transition-all hover:bg-black">
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
              Registrar Reseña <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;