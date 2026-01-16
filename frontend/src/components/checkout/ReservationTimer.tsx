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

  const getTimerColor = () => {
    if (isDanger) return "text-red-600 border-red-200 bg-red-50";
    if (isWarning) return "text-yellow-600 border-yellow-200 bg-yellow-50";
    return "text-blue-600 border-blue-200 bg-blue-50";
  };

  const getClockColor = () => {
    if (isDanger) return "text-red-600";
    if (isWarning) return "text-yellow-600";
    return "text-blue-600";
  };

  return (
    <div className={`border rounded-lg p-4 ${getTimerColor()} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className={`w-5 h-5 ${getClockColor()}`} />
          <div>
            <p className="font-medium">{isDanger ? "¡Tiempo por agotarse!" : isWarning ? "Tiempo limitado" : "Tiempo de orden"}</p>
            <p className="text-sm opacity-90">Tienes {formattedTime} para completar tu compra</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${getClockColor()}`}>{formattedTime}</span>
          {onExtendReservation && (
            <button onClick={onExtendReservation} className="ml-2 text-sm underline hover:no-underline">
              Extender
            </button>
          )}
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${isDanger ? "bg-red-600" : isWarning ? "bg-yellow-600" : "bg-blue-600"}`}
            style={{
              width: `${((minutes * 60 + seconds) / 600) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
