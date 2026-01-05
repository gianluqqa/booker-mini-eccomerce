import { ICartItem } from '@/types/Cart'
import { IOrder } from '@/types/Order'

// Calcular subtotal desde carrito
export const calculateSubtotalFromCart = (cartItems: ICartItem[]): number => {
  return cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0)
}

// Calcular subtotal desde orden
export const calculateSubtotalFromOrder = (order: IOrder): number => {
  if (!order.items) return 0
  return order.items.reduce((total, item) => {
    return total + (item.totalPrice || (item.price * item.quantity))
  }, 0)
}

// Calcular impuestos (21%)
export const calculateTax = (subtotal: number): number => {
  return subtotal * 0.21
}

// Calcular total
export const calculateTotal = (subtotal: number): number => {
  return subtotal + calculateTax(subtotal)
}

// Validar datos de pago
export const validatePaymentData = (cardData: {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvc: string
}): string | null => {
  if (!cardData.cardNumber.trim()) {
    return 'El número de tarjeta es requerido'
  }

  if (!cardData.cardName.trim()) {
    return 'El nombre en la tarjeta es requerido'
  }

  if (!cardData.expiryDate.trim()) {
    return 'La fecha de vencimiento es requerida'
  }

  if (!cardData.cvc.trim()) {
    return 'El CVC es requerido'
  }

  // Validar formato de tarjeta (solo números, 16 dígitos)
  const cleanCardNumber = cardData.cardNumber.replace(/\s+/g, '')
  if (!/^\d{16}$/.test(cleanCardNumber)) {
    return 'El número de tarjeta debe tener 16 dígitos'
  }

  // Validar formato de fecha (MM/YY)
  if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
    return 'La fecha de vencimiento debe tener formato MM/AA'
  }

  // Validar CVC (3-4 dígitos)
  if (!/^\d{3,4}$/.test(cardData.cvc)) {
    return 'El CVC debe tener 3 o 4 dígitos'
  }

  return null // Sin errores
}

// Formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount)
}

// Formatear fecha
export const formatDate = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
