"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IBookCardProps } from "@/types/Book";
import { Eye, ShoppingCart, Loader2, Plus, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAddToCart } from "@/hooks/useAddToCart";
import { toggleFavorite } from "@/services/userService";
import { useNoAuthAlert } from "@/contexts/NoAuthAlertContext";



const BookStrip: React.FC<IBookCardProps> = ({ book }) => {
    const router = useRouter();
    const { isAuthenticated, user, updateUser } = useAuth();
    const { showAlert } = useNoAuthAlert();
    const { addBookToCart, loading, error, resetError } = useAddToCart();


    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(
        user?.favorites?.some((f) => f.id === book.id) || false
    );

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated || !user) {
            showAlert("añadir libros a tus favoritos");
            return;
        }


        try {
            const result = await toggleFavorite(user.id, book.id!);
            setIsFavorite(result.isFavorite);

            // Actualizar el objeto usuario en el contexto
            const updatedFavorites = result.isFavorite
                ? [...(user.favorites || []), book]
                : (user.favorites || []).filter((f) => f.id !== book.id);

            updateUser({ ...user, favorites: updatedFavorites });
        } catch (err) {
            console.error("Error updating favorite:", err);
        }
    };



    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        resetError();
        setSuccessMessage(null);

        if (!isAuthenticated) {
            showAlert("añadir libros al carrito");
            return;
        }


        if (!book.id) return;

        const result = await addBookToCart({
            bookId: book.id,
            quantity: 1,
        });

        if (result) {
            setSuccessMessage("Añadido");
            setTimeout(() => setSuccessMessage(null), 2000);
        }
    };

    const handleViewDetails = (e?: React.MouseEvent<HTMLElement>) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (book.id) {
            router.push(`/book/${book.id}`);
        }
    };

    return (
        <div className="flex items-center justify-between w-full h-16 bg-[#f5efe1] border border-[#2e4b30]/20 hover:border-[#2e4b30] transition-all duration-300 group px-6 relative overflow-hidden">

            {/* Background decoration for brutalist feel */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#2e4b30] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

            {/* Title */}
            <div className="flex-1 mr-4 overflow-hidden">
                <h3
                    onClick={handleViewDetails}
                    className="text-sm font-black text-[#1a3a1c] uppercase tracking-tighter truncate cursor-pointer hover:text-[#2e4b30] transition-colors"
                >
                    {book.title}
                </h3>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Details Button */}
                <button
                    onClick={handleViewDetails}
                    className="p-2 border border-[#2e4b30]/10 text-[#2e4b30] hover:bg-[#2e4b30] hover:text-[#f5efe1] transition-all"
                    title="Ver Detalles"
                >
                    <Eye className="w-4 h-4" />
                </button>

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    className={`p-2 border border-[#2e4b30]/10 transition-all ${isFavorite ? "bg-red-50" : "hover:bg-red-50"}`}
                    title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                    <Heart className={`w-4 h-4 transition-all ${isFavorite ? "fill-red-600 text-red-600" : "text-[#2e4b30]"}`} />
                </button>

                {/* Add Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={book.stock === 0 || loading}
                    className={`p-2 transition-all ${book.stock > 0 && !loading
                        ? "bg-[#2e4b30] text-[#f5efe1] hover:bg-black"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    title={book.stock > 0 ? "Añadir al carrito" : "Sin stock"}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : successMessage ? (
                        <span className="text-[10px] font-black px-1">{successMessage}</span>
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Error message tooltip-like (extreme minimalist) */}
            {error && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] px-2 py-0.5 font-bold uppercase">
                    Error
                </div>
            )}
        </div>
    );
};

export default BookStrip;
