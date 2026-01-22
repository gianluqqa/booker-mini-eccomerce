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

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-yellow-800">
            Orden Pendiente en Proceso
          </h3>
          
          <div className="mt-2 text-sm text-yellow-700">
            <p>{pendingOrder.message}</p>
            
            <div className="mt-2 space-y-1">
              <p><strong>ID:</strong> {pendingOrder.id}</p>
              <p><strong>Total:</strong> ${typeof pendingOrder.total === 'number' ? pendingOrder.total.toFixed(2) : '0.00'}</p>
              <p><strong>Items:</strong> {pendingOrder.itemsCount}</p>
              
              {pendingOrder.expiresAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {isExpired ? 'Expirada' : `Expira: ${formatTime(pendingOrder.expiresAt)}`}
                  </span>
                </div>
              )}
            </div>
            
            <p className="mt-2 font-medium">
              {pendingOrder.actionRequired}
            </p>
          </div>
          
          <div className="mt-3 flex gap-2">
            {onGoToCheckout && (
              <button
                onClick={onGoToCheckout}
                className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
              >
                Ir al Checkout
              </button>
            )}
            
            {onCancelOrder && (
              <button
                onClick={onCancelOrder}
                className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Cancelar Orden
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingOrderAlert
