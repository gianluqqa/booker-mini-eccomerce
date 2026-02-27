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

  // No mostrar en la página de checkout, cart o profile
  const isExcludedPage = pathname?.includes("/checkout") || pathname === "/cart" || pathname === "/profile";

  const { minutes, seconds, isExpired, formattedTime, isWarning, isDanger } = useReservationTimer(
    reservation?.expiresAt || null,
    clearReservation
  );

  // No mostrar si está en página excluida, no hay reserva, o expiró
  if (isExcludedPage || !reservation || isExpired) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-[320px] sm:max-w-sm animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className={`relative overflow-hidden bg-white transition-all duration-500`}>
        {/* El borde superior es ahora la barra de progreso dinámica */}
        <div
          className={`absolute top-0 left-0 h-1 transition-all duration-1000 ease-linear ${isDanger ? 'bg-red-400' : isWarning ? 'bg-amber-400' : 'bg-blue-400'}`}
          style={{ width: `${((minutes * 60 + seconds) / 300) * 100}%` }}
        />

        <div className="p-4 sm:p-5">
          {/* Botón para cerrar */}
          <button
            onClick={clearReservation}
            className="absolute top-2 right-2 p-1.5 rounded-sm hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            title="Ocultar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm transition-colors ${isDanger ? 'bg-red-50' : isWarning ? 'bg-amber-50' : 'bg-blue-50'}`}>
              <Clock className={`h-5 w-5 ${isDanger ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-blue-500'}`} />
            </div>

            <div className="min-w-0 pr-4">
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
                {isDanger ? "Acción Requerida" : isWarning ? "Tiempo Limitado" : "Reserva Activa"}
              </h3>
              <div className={`text-xl font-black tracking-tight tabular-nums ${isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
                {formattedTime}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/checkout")}
              className="flex-1 bg-[#2e4b30] text-[#f5efe1] py-2 rounded-sm hover:bg-[#1a3a1c] transition-all text-[11px] font-bold uppercase tracking-wider active:scale-95"
            >
              Comprar Ahora
            </button>
            <button
              onClick={clearReservation}
              className="px-4 py-2 rounded-sm border border-[#2e4b30]/10 text-[#2e4b30]/60 hover:bg-gray-50 transition-all text-[11px] font-bold uppercase tracking-wider"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
