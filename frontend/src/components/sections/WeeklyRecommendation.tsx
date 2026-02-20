"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookOpen, Clock, Gift, Sparkles, Award, Star, ArrowRight, Loader2, ShoppingCart } from 'lucide-react';
import { IBook } from '@/types/Book';
import { useBooks } from '@/hooks/useBooks';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAddToCart } from '@/hooks/useAddToCart';

const WeeklyRecommendation = () => {
  const { books, loading } = useBooks();
  const [recommendation, setRecommendation] = useState<IBook | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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
      router.push("/login");
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
    <section id="weekly-recommendation" className="py-16 px-4 bg-[#2e4b30]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-[#f5efe1]" />
            <h2 className="text-3xl font-bold text-[#f5efe1]">
              Recomendación de la Semana
            </h2>
            <Star className="w-6 h-6 text-[#f5efe1]" />
          </div>
          <p className="text-sm text-[#f5efe1] opacity-80 max-w-2xl mx-auto">
            Descubre nuestra selección especial, elegida con cuidado por nuestro equipo de curadores
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda: Información */}
          <div className="space-y-6">
            {/* Badge de selección */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5efe1] text-[#2e4b30] rounded-full text-sm font-semibold">
              <Award className="w-4 h-4" />
              Selección Booker
            </div>

            {/* Título y autor */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#f5efe1] mb-2">
                {recommendation.title}
              </h3>
              <p className="text-lg text-[#f5efe1] opacity-80">
                por {recommendation.author}
              </p>
            </div>

            {/* Precio y stock */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#f5efe1]">
                ${typeof recommendation.price === 'number' 
                  ? recommendation.price.toFixed(2) 
                  : parseFloat(String(recommendation.price)).toFixed(2)
                }
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                recommendation.stock > 0
                  ? "bg-[#f5efe1] text-[#2e4b30]"
                  : "bg-red-100 text-red-600"
              }`}>
                {recommendation.stock > 0 ? `${recommendation.stock} disponibles` : "Sin stock"}
              </div>
            </div>

            {/* Mensaje de éxito */}
            {successMessage && (
              <div className="px-4 py-3 bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm font-medium">
                {successMessage}
              </div>
            )}

            {/* Descripción */}
            <div className="bg-[#1a3a1c] rounded-xl p-6 border border-[#f5efe1]/10">
              <p className="text-[#f5efe1] leading-relaxed">
                Una obra que captura la esencia de la literatura contemporánea con 
                prosas poéticas y personajes inolvidables. Perfecta para quienes buscan 
                historias que resuenan profundamente en el alma.
              </p>
            </div>

            {/* Características */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#f5efe1]" />
                <span className="text-sm text-[#f5efe1]">Lectura de fin de semana</span>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-[#f5efe1]" />
                <span className="text-sm text-[#f5efe1]">Ideal para regalar</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={recommendation.stock === 0 || cartLoading}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  recommendation.stock > 0 && !cartLoading
                    ? "bg-[#f5efe1] text-[#2e4b30] hover:bg-[#e8dcc8] hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {cartLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Añadiendo...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    {recommendation.stock > 0 ? "Añadir al carrito" : "No disponible"}
                  </>
                )}
              </button>
              
              <button
                onClick={handleViewDetails}
                className="flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 bg-[#1a3a1c] text-[#f5efe1] hover:bg-black hover:shadow-lg flex items-center justify-center gap-2 border border-[#f5efe1]/20"
              >
                Ver detalles
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Columna derecha: Imagen del libro */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Badge flotante */}
              <div className="absolute -top-3 -right-3 z-10 bg-[#f5efe1] text-[#2e4b30] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Top Pick
              </div>

              {/* Contenedor de la imagen */}
              <div 
                onClick={handleViewDetails}
                className="relative bg-[#f5efe1] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-[#f5efe1]/20"
              >
                <div className="aspect-[3/4] w-80">
                  {recommendation.image && !imageError ? (
                    <Image
                      src={recommendation.image}
                      alt={recommendation.title}
                      width={320}
                      height={427}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f5efe1] to-[#e8dcc8] flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-[#2e4b30]/30" />
                    </div>
                  )}
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