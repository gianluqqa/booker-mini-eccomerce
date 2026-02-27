import React from 'react'
import { IPendingOrder } from '@/types/PendingOrder'
import { AlertTriangle, Clock } from 'lucide-react'

interface PendingOrderAlertProps {
  pendingOrder: IPendingOrder
  onGoToCheckout?: () => void
  onCancelOrder?: () => void
  className?: string
}

/**
 * Componente de alerta para mostrar cuando el usuario tiene una orden pendiente
 */
export const PendingOrderAlert: React.FC<PendingOrderAlertProps> = ({
  pendingOrder,
  onGoToCheckout,
  onCancelOrder,
  className = ''
}) => {
  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = pendingOrder.expiresAt ?
    new Date(pendingOrder.expiresAt) < new Date() : false

  // Calcular el total de forma robusta
  const totalAmount = Number(pendingOrder.total) || Number((pendingOrder as any).totalPrice) || 0;

  return (
    <div className={`relative overflow-hidden bg-white border-t-4 border-t-amber-300 ${className}`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          {/* Icono y Título Principal */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#fef9c3]/60 ring-1 ring-amber-200/50">
              <AlertTriangle className={`h-6 w-6 ${isExpired ? 'text-red-500' : 'text-amber-600'}`} />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-[#2e4b30]">
                  Checkout Pendiente
                </h3>
                {pendingOrder.expiresAt && !isExpired && (
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-100">
                    <Clock className="h-3 w-3" />
                    Expira {formatTime(pendingOrder.expiresAt)}
                  </span>
                )}
                {isExpired && (
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600 ring-1 ring-red-100">
                    Expirada
                  </span>
                )}
              </div>
              <p className="text-sm text-[#2e4b30]/60 font-medium">
                {pendingOrder.itemsCount} {pendingOrder.itemsCount === 1 ? 'libro' : 'libros'} en espera para completar la compra.
              </p>
            </div>
          </div>

          {/* Detalles de la Orden */}
          <div className="hidden xl:flex items-center gap-8 px-8 border-x border-[#2e4b30]/5">
            <div className="text-center">
              <p className="text-[10px] font-semibold text-[#2e4b30]/40 uppercase tracking-tight">ID Orden</p>
              <p className="text-xs font-mono font-medium text-[#2e4b30]">#{pendingOrder.id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-semibold text-[#2e4b30]/40 uppercase tracking-tight">Total</p>
              <p className="text-sm font-semibold text-[#2e4b30]">${totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 sm:shrink-0">
            {onCancelOrder && (
              <button
                onClick={onCancelOrder}
                className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2e4b30]/40 hover:text-red-600 transition-colors"
              >
                Cancelar
              </button>
            )}
            {onGoToCheckout && (
              <button
                onClick={onGoToCheckout}
                className="rounded-sm bg-[#2e4b30] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#f5efe1] transition-all hover:bg-[#1a3a1c] active:scale-95"
              >
                Continuar Pago
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingOrderAlert
