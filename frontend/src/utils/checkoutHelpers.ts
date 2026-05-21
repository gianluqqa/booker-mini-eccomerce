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

// Validar datos de pago - Retorna objeto con errores por campo
export const validatePaymentData = (cardData: {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvc: string
}): Record<string, string> => {
  const errors: Record<string, string> = {}

  // 1. Número de tarjeta
  const cleanCardNumber = cardData.cardNumber.replace(/\s+/g, '')
  if (!cardData.cardNumber.trim() || !/^\d{16}$/.test(cleanCardNumber)) {
    errors.cardNumber = 'El número de tarjeta debe tener 16 dígitos'
  }

  // 2. Nombre
  if (!cardData.cardName || cardData.cardName.trim().length < 3) {
    errors.cardName = 'El nombre en la tarjeta es obligatorio'
  }

  // 3. Vencimiento
  if (!cardData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
    errors.expiryDate = 'La fecha de vencimiento debe tener el formato MM/YY'
  } else {
    const [month, year] = cardData.expiryDate.split('/').map(Number)
    const now = new Date()
    const currentYear = now.getFullYear() % 100
    const currentMonth = now.getMonth() + 1

    if (month < 1 || month > 12) {
      errors.expiryDate = 'Mes de vencimiento inválido'
    } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
      errors.expiryDate = 'La tarjeta está vencida o el año es inferior al actual'
    }
  }

  // 4. CVC
  if (!cardData.cvc.trim() || !/^\d{3,4}$/.test(cardData.cvc)) {
    errors.cvc = 'El CVC debe tener 3 o 4 dígitos'
  }

  return errors
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
