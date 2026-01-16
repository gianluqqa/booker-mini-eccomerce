"use client";

import React from "react";
import { Clock, X } from "lucide-react";
import { useReservation } from "@/contexts/ReservationContext";
import { usePathname, useRouter } from "next/navigation";
import { useReservationTimer } from "@/hooks/useReservationTimer";

/**
 * Componente flotante que muestra el temporizador de reserva de stock
 * cuando el usuario no está en la página de checkout
 */
export const GlobalReservationTimer: React.FC = () => {
  const { reservation, clearReservation } = useReservation();
  const pathname = usePathname();
  const router = useRouter();

  // No mostrar en la página de checkout
  const isCheckoutPage = pathname?.includes("/checkout");

  const { minutes, seconds, isExpired, formattedTime, isWarning, isDanger } = useReservationTimer(
    reservation?.expiresAt || null,
    clearReservation
  );

  // No mostrar si está en checkout, no hay reserva, o expiró
  if (isCheckoutPage || !reservation || isExpired) {
    return null;
  }

  const getTimerColor = () => {
    if (isDanger) return "bg-red-50 border-red-200 text-red-600";
    if (isWarning) return "bg-yellow-50 border-yellow-200 text-yellow-600";
    return "bg-blue-50 border-blue-200 text-blue-600";
  };

  const getClockColor = () => {
    if (isDanger) return "text-red-600";
    if (isWarning) return "text-yellow-600";
    return "text-blue-600";
  };

  const getProgressColor = () => {
    if (isDanger) return "bg-red-600";
    if (isWarning) return "bg-yellow-600";
    return "bg-blue-600";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className={`border rounded-lg shadow-lg p-4 ${getTimerColor()}`}>
        {/* Botón para cerrar */}
        <button
          onClick={clearReservation}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
          title="Ocultar temporizador"
        >
          <X className="w-4 h-4 opacity-60" />
        </button>

        <div className="flex items-center space-x-3 pr-6">
          <Clock className={`w-5 h-5 ${getClockColor()} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{isDanger ? "¡Tiempo por agotarse!" : isWarning ? "Tiempo limitado" : "Reserva activa"}</p>
            <p className="text-xs opacity-90">Tu reserva expira en {formattedTime}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${getClockColor()}`}>{formattedTime}</span>
          </div>
        </div>

        {/* Barra de progreso visual */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-1000 ${getProgressColor()}`}
              style={{
                width: `${((minutes * 60 + seconds) / 120) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => router.push("/checkout")}
            className="flex-1 bg-[#2e4b30] text-white px-3 py-1.5 rounded-md hover:bg-[#2e4b30]/90 transition-colors text-xs font-medium"
          >
            Ir al checkout
          </button>
          <button
            onClick={clearReservation}
            className="px-3 py-1.5 rounded-md border border-current hover:bg-black/10 transition-colors text-xs font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
