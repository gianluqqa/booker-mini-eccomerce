"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { IStockReservationResponse } from "@/types/StockReservation";

interface ReservationContextType {
  reservation: IStockReservationResponse | null;
  setReservation: (reservation: IStockReservationResponse | null) => void;
  clearReservation: () => void;
  hasActiveReservation: boolean;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation debe usarse dentro de un ReservationProvider");
  }
  return context;
};

interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const [reservation, setReservation] = useState<IStockReservationResponse | null>(null);

  // Cargar reserva desde localStorage al montar el componente
  useEffect(() => {
    const storedReservation = localStorage.getItem('stockReservation');
    if (storedReservation) {
      try {
        const parsedReservation = JSON.parse(storedReservation);
        // Verificar si la reserva aún no ha expirado
        const expiryTime = new Date(parsedReservation.expiresAt).getTime();
        const currentTime = new Date().getTime();
        
        if (expiryTime > currentTime) {
          setReservation(parsedReservation);
        } else {
          // Si ya expiró, limpiar el localStorage
          localStorage.removeItem('stockReservation');
        }
      } catch (err) {
        console.error('Error parsing stored reservation:', err);
        localStorage.removeItem('stockReservation');
      }
    }
  }, []);

  // Guardar reserva en localStorage cuando cambie
  useEffect(() => {
    if (reservation) {
      localStorage.setItem('stockReservation', JSON.stringify(reservation));
    } else {
      localStorage.removeItem('stockReservation');
    }
  }, [reservation]);

  const clearReservation = useCallback(() => {
    setReservation(null);
    localStorage.removeItem('stockReservation');
  }, []);

  const hasActiveReservation = reservation !== null;

  return (
    <ReservationContext.Provider
      value={{
        reservation,
        setReservation,
        clearReservation,
        hasActiveReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
