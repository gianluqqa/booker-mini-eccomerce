import { useState, useEffect } from 'react'
import { IPendingOrder } from '@/types/PendingOrder'
import { getUserCart } from '@/services/cartService'

/**
 * Hook para verificar si el usuario tiene órdenes pendientes
 * Retorna el estado de la orden pendiente y funciones para manejarlo
 */
export const usePendingOrderCheck = () => {
  const [pendingOrder, setPendingOrder] = useState<IPendingOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkPendingOrder = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await getUserCart()
      
      // La respuesta ahora incluye pendingOrder si existe
      if (response.pendingOrder) {
        setPendingOrder(response.pendingOrder)
      } else {
        setPendingOrder(null)
      }
    } catch (err: unknown) {
      // Si el error es por orden pendiente (409), extraer la información
      const error = err as Error & { status?: number; message?: string }
      if (error.message?.includes('orden pendiente') || error.status === 409) {
        try {
          const errorData = JSON.parse(error.message || '{}')
          if (errorData.data) {
            setPendingOrder(errorData.data)
            return
          }
        } catch {
          // Si no puede parsear, continuar con error normal
        }
      }
      
      setError(error.message || 'Error al verificar órdenes pendientes')
    } finally {
      setIsLoading(false)
    }
  }

  const clearPendingOrder = () => {
    setPendingOrder(null)
    setError(null)
  }

  // Verificar al montar el hook
  useEffect(() => {
    checkPendingOrder()
  }, [])

  return {
    pendingOrder,
    hasPendingOrder: !!pendingOrder,
    isLoading,
    error,
    refetch: checkPendingOrder,
    clearPendingOrder
  }
}
