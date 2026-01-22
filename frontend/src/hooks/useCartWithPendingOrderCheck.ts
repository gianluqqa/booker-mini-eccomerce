import { usePendingOrderCheck } from './usePendingOrderCheck'

/**
 * Hook que proporciona funciones wrapper para operaciones del carrito
 * que verifican automáticamente si hay órdenes pendientes
 */
export const useCartWithPendingOrderCheck = () => {
  const { hasPendingOrder, pendingOrder, refetch } = usePendingOrderCheck()
  

  const checkBeforeCartAction = (actionName: string): boolean => {
    if (hasPendingOrder) {
      const total = typeof pendingOrder?.total === 'number' ? pendingOrder.total.toFixed(2) : '0.00';
      alert(`⚠️ No puedes ${actionName}. Tienes una orden pendiente.\n\nOrden ID: ${pendingOrder?.id?.slice(0, 8)}...\nTotal: $${total}\n\nDebes confirmar o cancelar la orden para continuar.`)
      return false
    }
    return true
  }

  return {
    hasPendingOrder,
    pendingOrder,
    refetch,
    checkBeforeCartAction,
    
    // Wrapper functions para operaciones del carrito
    canAddToCart: () => checkBeforeCartAction('agregar productos al carrito'),
    canUpdateCart: () => checkBeforeCartAction('modificar el carrito'),
    canRemoveFromCart: () => checkBeforeCartAction('eliminar productos del carrito'),
    canClearCart: () => checkBeforeCartAction('vaciar el carrito'),
  }
}
