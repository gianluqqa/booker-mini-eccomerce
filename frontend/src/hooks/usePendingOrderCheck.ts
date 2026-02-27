import { useCart } from '@/contexts/CartContext'

/**
 * Hook para obtener si el usuario tiene órdenes pendientes
 * Ahora se basa en el estado central de CartContext para evitar múltiples llamadas API.
 */
export const usePendingOrderCheck = () => {
  const { pendingOrder, loading: isLoading, error, refreshCart } = useCart()

  const clearPendingOrder = () => {
    // Esto es solo local, idealmente refetch para sincronizar con backend.
  }

  return {
    pendingOrder,
    hasPendingOrder: !!pendingOrder,
    isLoading,
    error,
    refetch: refreshCart,
    clearPendingOrder
  }
}
