"use client"
import React, { useState, useEffect } from "react";
import { ShoppingCart, Star, BookOpen, Package, Tag, ArrowLeft, Loader2, Share2, Heart, ShieldCheck, MessageSquare } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getBookById } from "@/services/booksService";
import { IBook } from "@/types/Book";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useAuth } from "@/contexts/AuthContext";
import { ReviewList } from "@/components/review/ReviewList";
import { toggleFavorite } from "@/services/userService";


const BookDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [book, setBook] = useState<IBook | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addBookToCart, loading: addingToCart, error: cartError } = useAddToCart();

  useEffect(() => {
    if (user && book) {
      setIsFavorite(user.favorites?.some(f => f.id === book.id) || false);
    }
  }, [user, book]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !user || !book?.id) {
      if (!isAuthenticated) router.push("/login");
      return;
    }

    try {
      const result = await toggleFavorite(user.id, book.id);
      setIsFavorite(result.isFavorite);
      
      // Actualizar el objeto usuario en el contexto
      const updatedFavorites = result.isFavorite 
        ? [...(user.favorites || []), book]
        : (user.favorites || []).filter(f => f.id !== book.id);
      
      updateUser({ ...user, favorites: updatedFavorites });
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };



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
        setError(err instanceof Error ? err.message : "No se pudo cargar el libro.");
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
    if (!book?.id) return;
    await addBookToCart({ bookId: book.id, quantity: 1 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe1] flex items-center justify-center">
        <div className="text-center relative">
          <div className="absolute inset-0 animate-ping rounded-none bg-[#2e4b30]/10 opacity-75"></div>
          <Loader2 className="w-16 h-16 text-[#2e4b30] animate-spin relative z-10" />
          <p className="text-[#2e4b30] font-black uppercase tracking-widest mt-6 text-xs">Cargando Universos...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#f5efe1] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border-2 border-[#2e4b30] p-10 rounded-none shadow-[8px_8px_0px_0px_rgba(46,75,48,1)]">
          <BookOpen className="w-12 h-12 text-[#2e4b30] mb-6" />
          <h2 className="text-2xl font-black text-[#2e4b30] uppercase mb-4 tracking-tighter">Error de Lectura</h2>
          <p className="text-[#2e4b30] mb-8 font-medium border-l-4 border-[#2e4b30] pl-4">
            {error || "Este capítulo parece haber sido arrancado del catálogo."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-3 bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-none font-bold uppercase text-xs tracking-widest hover:bg-[#1a3a1c] transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Regresar a la Biblioteca
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efe1] pt-24 pb-12 px-4 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* HEADER / NAVEGACIÓN */}
        <div className="flex items-center justify-end border-b-2 border-[#2e4b30]/10 pb-6">
          <div className="flex gap-4">
            <button
              onClick={handleToggleFavorite}

              className={`p-2 transition-all shadow-sm border rounded-none ${isFavorite ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white/50 border-[#2e4b30]/10 text-[#2e4b30] hover:bg-red-50 hover:text-red-600'}`}
              title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-600" : ""}`} />
            </button>

          </div>
        </div>

        {/* GRID PRINCIPAL: IMAGEN + INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">

          {/* LADO IZQUIERDO: IMAGEN */}
          <div className="lg:col-span-5">
            <div className="relative group">
              <div className="absolute top-8 left-8 w-full h-full border-2 border-[#2e4b30] rounded-none -z-10 group-hover:top-4 group-hover:left-4 transition-all duration-500"></div>
              <div className="aspect-[3/4.5] w-full bg-[#1a3a1c] relative overflow-hidden rounded-none shadow-2xl border-2 border-[#2e4b30]">
                {book.image && !imageError ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <BookOpen className="w-24 h-24 text-[#f5efe1]/20" />
                    <span className="text-[#f5efe1] font-black uppercase tracking-tighter mt-4 opacity-50">Imagen No Disponible</span>
                  </div>
                )}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-[#f5efe1]">
                  <div className="bg-[#2e4b30] p-4 rounded-none shadow-xl border border-white/10">
                    <p className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70">En Almacén</p>
                    <p className="text-xl font-bold flex items-center gap-2">
                      <Package className="w-5 h-5" /> {book.stock} Unidades
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: INFO + TICKET */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-7 grid-rows-[auto_1fr] gap-8 items-stretch flex-grow">

              {/* Información y Sinopsis (Col 4) */}
              <div className="md:col-span-4 space-y-12">
                <div className="relative">
                  <span className="absolute -top-12 left-0 text-[80px] font-black text-[#2e4b30]/5 uppercase leading-none select-none pointer-events-none">
                    {book.author.split(' ')[0]}
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-black text-[#1a3a1c] uppercase tracking-tighter leading-[0.9] mb-4 relative z-10">
                    {book.title}
                  </h1>
                  <div className="flex items-center gap-3 text-[#2e4b30]">
                    <div className="h-0.5 w-12 bg-[#2e4b30]"></div>
                    <span className="font-extrabold uppercase tracking-widest text-sm">{book.author}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/40 border border-[#2e4b30]/10 p-4 rounded-none">
                    <p className="text-[9px] font-black text-[#2e4b30]/50 uppercase tracking-[0.2em] mb-1">GÉNERO</p>
                    <p className="text-xs font-bold text-[#2e4b30] uppercase tracking-wider">{book.genre}</p>
                  </div>
                  <div className="bg-white/40 border border-[#2e4b30]/10 p-4 rounded-none">
                    <p className="text-[9px] font-black text-[#2e4b30]/50 uppercase tracking-[0.2em] mb-1">ESTADO</p>
                    <p className="text-xs font-bold text-[#2e4b30] uppercase tracking-wider">Nuevo / Sellado</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-[#1a3a1c] uppercase tracking-[0.3em] flex items-center gap-3">
                    <Tag className="w-4 h-4" /> Sinopsis
                  </h3>
                  <p className="text-[#2e4b30] text-sm leading-relaxed font-semibold border-l-2 border-[#2e4b30] pl-6 py-2">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* TICKET DE COMPRA (Col 3) */}
              <div className="md:col-span-3 h-full">
                <div className="bg-[#1a3a1c] text-[#f5efe1] p-8 rounded-none shadow-2xl space-y-8 border-t-8 border-[#2e4b30] h-full flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">PRECIO</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black opacity-50">$</span>
                      <span className="text-5xl font-black tracking-tighter">{book.price}</span>
                      <span className="text-xs font-bold opacity-30">USD</span>
                    </div>
                  </div>

                  <div className="space-y-4 border-y border-white/10 py-6">
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#f5efe1]" />
                      <span>Seguridad Total</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <Package className="w-4 h-4 text-[#f5efe1]" />
                      <span>Envío Priority</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {cartError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-none text-[10px] font-bold uppercase text-center">
                        {cartError}
                      </div>
                    )}
                    <button
                      onClick={handleAddToCart}
                      disabled={book.stock === 0 || addingToCart}
                      className={`w-full py-5 rounded-none font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 transition-all ${book.stock > 0 && !addingToCart
                        ? "bg-[#f5efe1] text-[#1a3a1c] hover:bg-white hover:translate-y-[-4px] shadow-[0px_4px_0px_0px_rgba(245,239,225,0.2)] active:translate-y-[0px]"
                        : "bg-white/10 text-white/20 cursor-not-allowed opacity-50"
                        }`}
                    >
                      {addingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingCart className="w-5 h-5" /> Comprar Ahora</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* IMPACTO EDITORIAL (Ocupando todo el espacio restante hasta la base de la imagen) */}
              <div className="md:col-span-7 pt-4 h-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-[10px] font-black text-[#1a3a1c] uppercase tracking-[0.4em] flex items-center gap-3 mb-6">
                    <Star className="w-4 h-4 text-[#2e4b30]" /> Impacto Editorial
                  </h3>
                  <div className="flex-grow h-full">
                    {book.id && <ReviewList bookId={book.id} mode="stats" />}
                  </div>
                </div>
              </div>
            </div>

            {book.intro && (
              <div className="bg-[#1a3a1c]/5 p-6 border-l-4 border-[#2e4b30] rounded-none">
                <h3 className="text-sm font-black text-[#1a3a1c] uppercase tracking-[0.3em] flex items-center gap-3 mb-4">
                  <Star className="w-4 h-4 text-[#2e4b30]" /> Nota Editorial
                </h3>
                <p className="text-[#2e4b30]/80 text-[13px] leading-relaxed font-medium">
                  {book.intro}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN CONVERSACIONES (FULL WIDTH AT BOTTOM) */}
        <div className="space-y-8 pt-12 border-t-2 border-[#2e4b30]/10">
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-black text-[#1a3a1c] uppercase tracking-tighter flex items-center gap-4">
              <MessageSquare className="w-8 h-8 text-[#2e4b30]" /> Conversaciones
            </h3>
            <div className="h-0.5 flex-1 bg-[#2e4b30]/10 mx-8"></div>
            <span className="text-xs font-black text-[#2e4b30]/40 uppercase tracking-[0.4em]">Comunidad Literaria</span>
          </div>

          <div className="bg-white/30 rounded-none p-8 lg:p-12 border border-[#2e4b30]/10 shadow-sm">
            {book.id && (
              <ReviewList
                bookId={book.id}
                currentUserId={user?.id}
                mode="feed"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
