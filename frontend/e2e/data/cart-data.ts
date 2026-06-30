/**
 * Datos de prueba para el módulo de carrito.
 * Contiene mensajes de error y validaciones esperadas.
 */
export const CART_DATA = {
  // Mensajes de éxito
  successMessages: {
    bookAdded: 'Añadido',
  },

  // Mensajes de error
  errorMessages: {
    notAuthenticated: 'Debes iniciar sesión para añadir libros al carrito',
    outOfStock: 'Agotado',
    pendingOrderBlock: 'No puedes modificar el carrito mientras tienes una orden pendiente',
  },

  // Estados del carrito
  cartStates: {
    empty: 'Tu carrito está vacío',
    hasItems: 'artículo',
    hasMultipleItems: 'artículos',
  },

  // Botones y elementos de la UI
  uiElements: {
    addToCartButtonTitle: 'Añadir al carrito',
    viewDetailsButton: 'Ver Detalles',
    cartIcon: 'ShoppingCart',
    emptyCartMessage: 'Tu carrito está vacío',
    proceedToPaymentButton: 'Proceder al Pago',
  },
};
