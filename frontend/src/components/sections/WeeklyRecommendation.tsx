"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookOpen, Clock, Gift, Sparkles, Award, Star, ArrowRight, Loader2, ShoppingCart } from 'lucide-react';
import { IBook } from '@/types/Book';
import { useBooks } from '@/hooks/useBooks';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNoAuthAlert } from '@/contexts/NoAuthAlertContext';
import { useAddToCart } from '@/hooks/useAddToCart';


const WeeklyRecommendation = () => {
  const { books, loading } = useBooks();
  const [recommendation, setRecommendation] = useState<IBook | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showAlert } = useNoAuthAlert();
  const { addBookToCart, loading: cartLoading } = useAddToCart();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    if (books.length > 0) {
      const randomIndex = Math.floor(Math.random() * books.length);
      setRecommendation(books[randomIndex]);
    }
  }, [books]);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setSuccessMessage(null);

    if (!isAuthenticated) {
      showAlert("añadir libros a tu colección");
      return;
    }

    if (!recommendation?.id) {
      return;
    }

    const result = await addBookToCart({
      bookId: recommendation.id,
      quantity: 1,
    });

    if (result) {
      setSuccessMessage("Libro añadido al carrito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleViewDetails = () => {
    if (!recommendation?.id) {
      return;
    }
    router.push(`/book/${recommendation.id}`);
  };

  if (loading || !recommendation) {
    return (
      <section id="weekly-recommendation" className="py-16 px-4 bg-[#2e4b30]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#f5efe1] animate-spin mx-auto mb-3" />
              <p className="text-[#f5efe1] text-sm">Preparando tu recomendación de la semana...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="weekly-recommendation" className="py-24 px-4 bg-[#2e4b30] relative overflow-hidden">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border-2 border-[#f5efe1] rotate-12"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-[#f5efe1] -rotate-6"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#f5efe1]/20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* LADO IZQUIERDO: TEXTO Y ACCIONES (Col 7) */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            <div className="space-y-6 border-l-4 border-[#f5efe1]/30 pl-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-[2px] w-12 bg-[#f5efe1]/30"></div>
                <span className="text-[#f5efe1]/60 text-xs font-black uppercase tracking-[0.4em]">Propuesta Semanal</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-[#f5efe1] uppercase tracking-tighter leading-[0.85]">
                Libro de la <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5efe1] to-[#f5efe1]/40">Semana</span>
              </h2>
            </div>

            <div className="relative pl-8 border-l-2 border-[#f5efe1]/20">
              <h3 className="text-3xl md:text-4xl font-bold text-[#f5efe1] mb-2 tracking-tight">
                {recommendation.title}
              </h3>
              <p className="text-xl text-[#f5efe1]/70 font-medium italic">
                — {recommendation.author}
              </p>
            </div>

            <div className="bg-[#1a3a1c] p-8 border border-[#f5efe1]/10 shadow-2xl relative">
              <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-[#f5efe1]/20" />
              <p className="text-[#f5efe1]/90 leading-relaxed text-lg font-medium italic">
                "{recommendation.description || 'Una obra que captura la esencia de la literatura contemporánea con prosas poéticas y personajes inolvidables. Perfecta para quienes buscan historias que resuenan profundamente en el alma.'}"
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#f5efe1]/40 mb-1">Inversión</span>
                <span className="text-4xl font-black text-[#f5efe1] tracking-tighter">
                  ${typeof recommendation.price === 'number'
                    ? recommendation.price.toFixed(2)
                    : parseFloat(String(recommendation.price)).toFixed(2)
                  }
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center px-4 py-2 border border-[#f5efe1]/20">
                  <Clock className="w-5 h-5 text-[#f5efe1] mb-1" />
                  <span className="text-[10px] font-bold text-[#f5efe1] uppercase">420 Pag.</span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 border border-[#f5efe1]/20">
                  <Award className="w-5 h-5 text-[#f5efe1] mb-1" />
                  <span className="text-[10px] font-bold text-[#f5efe1] uppercase">Best Seller</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={recommendation.stock === 0 || cartLoading}
                className={`group relative overflow-hidden px-10 py-5 font-black uppercase text-[11px] tracking-[0.3em] transition-all ${recommendation.stock > 0 && !cartLoading
                  ? "bg-[#f5efe1] text-[#2e4b30] hover:bg-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                  {recommendation.stock > 0 ? "Añadir a Colección" : "Agotado"}
                </span>
              </button>

              <button
                onClick={handleViewDetails}
                className="px-10 py-5 font-black uppercase text-[11px] tracking-[0.3em] bg-transparent border-2 border-[#f5efe1]/20 text-[#f5efe1] hover:bg-[#f5efe1] hover:text-[#2e4b30] transition-all flex items-center justify-center gap-3"
              >
                Explorar Obra
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {successMessage && (
              <p className="text-[#f5efe1] text-xs font-bold uppercase tracking-widest animate-pulse">
                ✓ {successMessage}
              </p>
            )}
          </div>

          {/* LADO DERECHO: IMAGEN DINÁMICA (Col 5) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative group cursor-pointer" onClick={handleViewDetails}>
              {/* Sombras y marcos decorativos */}
              <div className="absolute top-10 left-10 w-full h-full border-2 border-[#f5efe1]/20 -z-10 group-hover:top-6 group-hover:left-6 transition-all duration-500"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#f5efe1]/40 -z-10"></div>

              {/* Contenedor Principal de Imagen */}
              <div className="w-72 md:w-96 aspect-[3/4.5] bg-[#1a3a1c] shadow-[30px_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden border-2 border-[#f5efe1]/10">
                {recommendation.image && !imageError ? (
                  <img
                    src={recommendation.image}
                    alt={recommendation.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (

                  <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                    <BookOpen className="w-20 h-20 text-[#f5efe1]/10" />
                    <span className="text-[#f5efe1]/30 font-black uppercase tracking-widest text-[10px]">Sin Imagen</span>
                  </div>
                )}

                {/* Badge Flotante Estilizado */}
                <div className="absolute top-0 right-0 p-8">
                  <div className="bg-[#f5efe1] text-[#2e4b30] w-14 h-14 flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                </div>

                {/* Info Overlay al Hover */}
                <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[#f5efe1] text-[10px] font-black uppercase tracking-[0.5em]">Edición Limitada</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WeeklyRecommendation;