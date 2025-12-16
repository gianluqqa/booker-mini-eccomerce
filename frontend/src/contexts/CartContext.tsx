"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { ICartResponse } from "@/types/Cart";
import { getUserCart } from "@/services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: ICartResponse | null;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  itemCount: number;
  nextReservationExpiry: Date | null;
  reservationTimeLeft: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<ICartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [nextReservationExpiry, setNextReservationExpiry] = useState<Date | null>(null);
  const [reservationTimeLeft, setReservationTimeLeft] = useState<number>(0);

  const fetchCart = useCallback(async () => {
    // Si no está autenticado, no intentamos cargar el carrito
    if (!isAuthenticated) {
      setLoading(false);
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const cartData = await getUserCart();
      setCart(cartData);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { status: number } };
      if (error.response?.status !== 401) {
        setError("Error al cargar el carrito");
        console.error("Error fetching cart:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Actualizar el carrito cuando cambie el estado de autenticación
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      setNextReservationExpiry(null);
      return;
    }

    const futureReservations = cart.items
      .filter((item) => item.reservedUntil)
      .map((item) => new Date(item.reservedUntil as string | Date).getTime())
      .filter((time) => !Number.isNaN(time));

    if (futureReservations.length === 0) {
      setNextReservationExpiry(null);
      return;
    }

    const soonest = Math.min(...futureReservations);
    setNextReservationExpiry(new Date(soonest));
  }, [cart]);

  useEffect(() => {
    if (!nextReservationExpiry) {
      setReservationTimeLeft(0);
      return;
    }

    const updateTimeLeft = () => {
      setReservationTimeLeft(Math.max(0, nextReservationExpiry.getTime() - Date.now()));
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [nextReservationExpiry]);

  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  // Calcular el número total de ítems en el carrito
  const itemCount = cart?.totalItems || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        refreshCart,
        itemCount,
        nextReservationExpiry,
        reservationTimeLeft,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
