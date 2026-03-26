// Servicios para operaciones de checkout

import { apiClient, extractData } from '@/config/api'
import { IOrder } from '@/types/Order'
import { ICartResponse } from '@/types/Cart'
import { IStockReservationResponse } from '@/types/StockReservation'

/**
 * Obtiene el carrito del usuario actual
 * @returns Datos del carrito del usuario
 * @throws Error si no se puede obtener el carrito
 */
export const getUserCart = async (): Promise<ICartResponse> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: ICartResponse }>('/carts')
    return extractData<ICartResponse>(response)
  } catch (error: unknown) {
    throw error // Re-lanzar para preservación del status
  }
}

/**
 * Crea reserva de stock para el checkout (5 minutos)
 * @returns Datos de la reserva creada
 * @throws Error si no se puede crear la reserva
 */
export const createStockReservation = async (): Promise<IStockReservationResponse> => {
  try {
    const response = await apiClient.post<{ 
      success: boolean; 
      message: string; 
      data: IStockReservationResponse 
    }>('/checkout/reserve');
    
    const reservation = extractData<IStockReservationResponse>(response);
    return reservation;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear la reserva de stock';
    
    // Si el error es por orden pendiente existente
    if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
      throw new Error('Ya tienes una orden pendiente. No se puede crear otra reserva.');
    }
    
    throw error;
  }
}

/**
 * Inicia el checkout - Crea orden PENDING inmediatamente
 * @returns Orden PENDING con expiración de 5 minutos
 * @throws Error si no se puede iniciar el checkout
 */
export const startCheckout = async (): Promise<IOrder> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout', {})
    const order = extractData<IOrder>(response)
    return order
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al iniciar el checkout'
    
    // Si el error es por orden pendiente existente, extraer información
    if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
      throw new Error('Ya tienes una orden pendiente. Completa el pago o cancela antes de continuar.');
    }
    
    throw error
  }
}

/**
 * Procesa el pago de una orden PENDING existente
 * @param paymentData Datos de pago para procesar la orden
 * @returns Orden actualizada con estado "paid"
 * @throws Error si no se puede procesar el pago
 */
export const processPayment = async (paymentData: {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
}): Promise<IOrder> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout/pay', paymentData)
    const order = extractData<IOrder>(response)
    return order
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago'
    
    // Si el error es por orden pendiente existente
    if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
      throw new Error('Ya tienes una orden pendiente. Completa el pago o cancela antes de continuar.');
    }
    
    throw error
  }
}

/**
 * Verifica si existe una orden PENDING para el usuario (solo verificación, no crea)
 * @returns Orden PENDING existente o null
 * @throws Error si no se puede verificar
 */
export const checkPendingOrder = async (): Promise<IOrder | null> => {
  try {
    // Usar un endpoint dedicado para solo verificar, no crear
    const response = await apiClient.get<{ success: boolean; data: IOrder[] }>('/orders/pending')
    
    const orders = extractData<IOrder[]>(response);
    
    if (orders && orders.length > 0) {
      const order = orders[0] // Tomar la primera orden PENDING
      return order
    }
    
    return null
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al verificar orden PENDING'
    
    // Si el error es "El carrito está vacío", lo tratamos como un caso normal (no hay orden PENDING)
    if (errorMessage.includes('carrito está vacío') || errorMessage.includes('carrito vacio')) {
      return null
    }
    
    // Para otros errores, lanzamos la excepción original
    throw error
  }
}

/**
 * Cancela el checkout y elimina la reserva de stock
 * @returns Confirmación de cancelación
 * @throws Error si no se puede cancelar el checkout
 */
export const cancelCheckout = async (): Promise<{ message: string; reservationId: string }> => {
  try {
    const response = await apiClient.delete<{ 
      success: boolean; 
      message: string; 
      data: { message: string; reservationId: string }
    }>('/checkout/cancel');
    
    const result = extractData<{ message: string; reservationId: string }>(response);
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

/**
 * @deprecated Usar startCheckout() y processPayment() para el nuevo flujo
 * Procesa el checkout del carrito (convierte el carrito en una orden confirmada)
 * @param paymentData Datos de pago para procesar la orden
 * @returns Orden creada con estado "confirmed"
 * @throws Error si no se puede procesar el checkout
 */
export const processCheckout = async (paymentData: {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
}): Promise<IOrder> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout', paymentData)
    const order = extractData<IOrder>(response)
    return order
  } catch (error: unknown) {
    throw error
  }
}
