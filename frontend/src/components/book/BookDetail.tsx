"use client"
import React, { useState, useEffect } from "react";
import { ShoppingCart, Star, BookOpen, User, DollarSign, Package, Tag, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { getBookById } from "@/services/booksService";
import { IBook } from "@/types/Book";

const BookDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState<IBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { addBookToCart, loading: addingToCart, error: cartError } = useAddToCart();

  useEffect(() => {
    const fetchBook = async () => {
      const bookId = params?.id as string;
      
      if (!bookId) {
        setError("ID de libro no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const bookData = await getBookById(bookId);
        setBook(bookData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("No se pudo cargar el libro.");
        }
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params?.id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!book?.id) {
      return;
    }

    await addBookToCart({
      bookId: book.id,
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe1] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#2e4b30] animate-spin mx-auto mb-4" />
          <p className="text-[#2e4b30] text-lg">Cargando libro...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#f5efe1] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#2e4b30] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2e4b30] mb-2">Libro no encontrado</h2>
          <p className="text-[#2e4b30] opacity-70 mb-6">
            {error || "El libro que buscas no existe."}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2e4b30] text-[#f5efe1] rounded-lg hover:bg-[#1a3a1c] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Contenido Principal */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#f5efe1] overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">
            {/* Imagen del Libro */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-sm">
                <div className="aspect-[3/4] w-full relative overflow-hidden rounded-xl shadow-lg flex items-center justify-center bg-[#f5efe1] bg-opacity-20">
                  {book.image && !imageError ? (
                    <img
                      src={book.image}
                      alt={book.title || book.author || "Portada del libro"}
                      className="w-full h-full object-cover object-center"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-5xl text-[#2e4b30] opacity-40">📚</span>
                  )}
                </div>
                {/* Insignia de Stock */}
                <div className="absolute top-4 right-4 bg-[#2e4b30] text-[#f5efe1] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {book.stock} en stock
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
                  <span className="text-[#2e4b30] font-medium">Género:</span>
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
                    Descripción
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
                      Introducción
                    </h3>
                    <p className="text-[#2e4b30] leading-relaxed">
                      {book.intro}
                    </p>
                  </div>
                )}
              </div>

              {/* Botón de Añadir al Carrito */}
              <div className="mt-auto pt-6 space-y-3">
                {cartError && (
                  <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
                    {cartError}
                  </div>
                )}
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0 || addingToCart}
                  className={`w-full transition-all duration-300 py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl ${
                    book.stock > 0 && !addingToCart
                      ? "bg-[#2e4b30] text-[#f5efe1] hover:bg-[#1a3a1c]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Añadiendo...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      {book.stock > 0 ? "Añadir al Carrito" : "Sin Stock"}
                    </>
                  )}
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
