import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { useReservationTimer } from "@/hooks/useReservationTimer";
import { IOrder } from "@/types/Order";

interface ReservationTimerProps {
  order?: IOrder | null;
  reservation?: { expiresAt?: string | null } | null; // Mantener para compatibilidad
  expiresAt?: string | null;
  onExpired?: () => void;
  onExtend?: () => void;
  onExtendReservation?: () => void;
  className?: string;
}

/**
 * Componente que muestra el temporizador de reserva de stock
 * con indicadores visuales de estado (normal, advertencia, peligro)
 */
export const ReservationTimer: React.FC<ReservationTimerProps> = ({ order, reservation, expiresAt, onExpired, onExtend, onExtendReservation, className = "" }) => {
  // Priorizar order.expiresAt, luego expiresAt directo, luego reservation.expiresAt
  const finalExpiresAt = order?.expiresAt ? (typeof order.expiresAt === 'string' ? order.expiresAt : order.expiresAt.toISOString()) : expiresAt || reservation?.expiresAt || null;
  const finalOnExtend = onExtend || onExtendReservation;

  const { minutes, seconds, isExpired, formattedTime, isWarning, isDanger } = useReservationTimer(finalExpiresAt, onExpired);

  if (!finalExpiresAt || isExpired) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Orden expirada</p>
            <p className="text-red-600 text-sm">Tu orden ha expirado. Por favor, inicia un nuevo checkout.</p>
          </div>
          {finalOnExtend && (
            <button onClick={finalOnExtend} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm">
              Reiniciar checkout
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-white transition-all duration-500 ${className}`}>
      {/* El borde superior es ahora la barra de progreso dinámica */}
      <div
        className={`absolute top-0 left-0 h-1 transition-all duration-1000 ease-linear ${isDanger ? 'bg-red-400' : isWarning ? 'bg-amber-400' : 'bg-blue-400'}`}
        style={{ width: `${((minutes * 60 + seconds) / 300) * 100}%` }}
      />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-sm transition-colors ${isDanger ? 'bg-red-50' : isWarning ? 'bg-amber-50' : 'bg-blue-50'}`}>
              <Clock className={`h-6 w-6 ${isDanger ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-blue-500'}`} />
            </div>

            <div className="space-y-0.5">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
                {isDanger ? "Acción Requerida" : isWarning ? "Tiempo Limitado" : "Tiempo de Orden"}
              </h3>
              <p className="text-sm text-[#2e4b30]/60 font-medium">
                Tu reserva de stock está activa.
              </p>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center px-2 py-1 sm:p-0 rounded-sm bg-gray-50/50 sm:bg-transparent">
            <div className="sm:hidden text-[10px] font-bold text-[#2e4b30]/40 uppercase tracking-tighter mr-4">Expira en:</div>
            <div className={`text-3xl sm:text-4xl font-black tracking-tighter tabular-nums ${isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
              {formattedTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
