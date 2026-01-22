"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ICartItem } from "@/types/Cart";
import { getUserCart, removeFromCart, clearCart, updateCartItemQuantity } from "@/services/cartService";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { usePendingOrderCheck } from "@/hooks/usePendingOrderCheck";
import PendingOrderAlert from "@/components/alerts/PendingOrderAlert";

const Cart = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { refreshCart } = useCart();
  const { pendingOrder, hasPendingOrder } = usePendingOrderCheck();
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<{ [key: string]: boolean }>({});
  const [isRemoving, setIsRemoving] = useState<{ [key: string]: boolean }>({});

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cartData = await getUserCart();
      setCartItems(cartData.items || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar el carrito";
      setError(errorMessage);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Esperar a que termine de cargar la autenticación antes de verificar
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    fetchCart();
  }, [isAuthenticated, authLoading, fetchCart, router]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (hasPendingOrder) {
      alert("No puedes modificar el carrito mientras tienes una orden pendiente. Debes completarla o cancelarla primero.");
      return;
    }
    
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      setIsUpdating((prev) => ({ ...prev, [itemId]: true }));
      const updatedItem = await updateCartItemQuantity(itemId, newQuantity);

      // Actualizar el estado local
      setCartItems((items) => {
        const updatedItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        );
        return updatedItems;
      });
      
      // Actualizar el contexto del carrito para sincronizar el contador del Navbar
      await refreshCart();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar la cantidad";
      setError(errorMessage);
      // Recargar el carrito para mantener la consistencia
      fetchCart();
    } finally {
      setIsUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId: string) => {
    if (hasPendingOrder) {
      alert("No puedes eliminar productos del carrito mientras tienes una orden pendiente. Debes completarla o cancelarla primero.");
      return;
    }
    
    try {
      setIsRemoving((prev) => ({ ...prev, [itemId]: true }));
      await removeFromCart(itemId);
      // Actualizar el estado local
      setCartItems((items) => {
        const updatedItems = items.filter((item) => item.id !== itemId);
        return updatedItems;
      });
      
      // Actualizar el contexto del carrito para sincronizar el contador del Navbar
      await refreshCart();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar el ítem";
      setError(errorMessage);
      // Recargar el carrito para mantener la consistencia
      fetchCart();
    } finally {
      setIsRemoving((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (hasPendingOrder) {
      alert("No puedes vaciar el carrito mientras tienes una orden pendiente. Debes completarla o cancelarla primero.");
      return;
    }
    
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      try {
        await clearCart();
        setCartItems([]);
        
        // Actualizar el contexto del carrito para sincronizar el contador del Navbar
        await refreshCart();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error al vaciar el carrito";
        setError(errorMessage);
      }
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.21; // 21% IVA
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    
    if (hasPendingOrder) {
      alert("Ya tienes una orden pendiente. Debes completarla o cancelarla antes de crear una nueva.");
      return;
    }
    
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mx-auto mb-4" />
              <p className="text-[#2e4b30] text-lg">Cargando carrito...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => fetchCart()}
                className="bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium inline-block mr-4"
              >
                Reintentar
              </button>
              <Link
                href="/"
                className="bg-gray-200 text-[#2e4b30] px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium inline-block"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2e4b30]">Carrito de Compras</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-8 text-center">
            <ShoppingBag className="w-24 h-24 text-[#2e4b30]/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#2e4b30] mb-4">Tu carrito está vacío</h2>
            <p className="text-[#2e4b30]/70 mb-8">¡Añade algunos libros para comenzar!</p>
            <Link
              href="/"
              className="bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium"
            >
              Explorar Libros
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2e4b30]">Carrito de Compras</h1>
          <span className="ml-4 bg-[#2e4b30] text-[#f5efe1] px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>

        {/* Alerta de orden pendiente */}
        {hasPendingOrder && pendingOrder && (
          <div className="mb-8">
            <PendingOrderAlert
              pendingOrder={pendingOrder}
              onGoToCheckout={() => router.push('/checkout')}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 overflow-hidden">
              <div className="divide-y divide-[#2e4b30]/10">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.book.image || "/placeholder-book.jpg"}
                          alt={item.book.title}
                          width={80}
                          height={120}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0 ml-6">
                        <h3 className="text-lg font-semibold text-[#2e4b30]">{item.book.title}</h3>
                        <p className="text-[#2e4b30]/70 text-sm mb-2">por {item.book.author}</p>
                        <p className="text-lg font-bold text-[#2e4b30]">${(item.book.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating[item.id] || hasPendingOrder}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                              isUpdating[item.id] || hasPendingOrder
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                                : 'bg-[#2e4b30]/10 hover:bg-[#2e4b30]/20 text-[#2e4b30]'
                            }`}
                          >
                            {isUpdating[item.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                          </button>
                          <span className="text-[#2e4b30] font-medium min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating[item.id] || hasPendingOrder}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                              isUpdating[item.id] || hasPendingOrder
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                                : 'bg-[#2e4b30]/10 hover:bg-[#2e4b30]/20 text-[#2e4b30]'
                            }`}
                          >
                            {isUpdating[item.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isRemoving[item.id] || hasPendingOrder}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            isRemoving[item.id] || hasPendingOrder
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                              : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {isRemoving[item.id] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 border-t border-[#2e4b30]/10">
                <button 
                  onClick={handleClearCart} 
                  disabled={hasPendingOrder}
                  className={`font-medium flex items-center ${
                    hasPendingOrder 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-red-500 hover:text-red-600'
                  }`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#2e4b30] mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#2e4b30]">
                  <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} artículos)</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2e4b30]">
                  <span>IVA (21%)</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="border-t border-[#2e4b30]/10 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold text-[#2e4b30]">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={hasPendingOrder}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 mb-4 ${
                  hasPendingOrder 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-[#2e4b30] hover:bg-[#2e4b30]/90 text-[#f5efe1]'
                }`}
              >
                {hasPendingOrder ? 'Orden Pendiente en Proceso' : 'Proceder al Pago'}
              </button>

              <Link
                href="/"
                className="block w-full text-center text-[#2e4b30] hover:text-[#2e4b30]/70 transition-colors duration-200 font-medium"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
