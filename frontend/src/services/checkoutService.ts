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
    console.log('🚨 [FRONTEND] createStockReservation - Creando reserva');
    const response = await apiClient.post<{ 
      success: boolean; 
      message: string; 
      data: IStockReservationResponse 
    }>('/checkout/reserve');
    
    const reservation = extractData<IStockReservationResponse>(response);
    console.log('✅ [FRONTEND] createStockReservation - Reserva creada:', reservation.reservationId);
    return reservation;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear la reserva de stock';
    console.error('❌ [FRONTEND] Error en createStockReservation:', error);
    
    // Si el error es por orden pendiente existente
    if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
      console.log('🚨 [FRONTEND] Error de orden pendiente detectado en createStockReservation');
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
    console.log('🚨 [FRONTEND] startCheckout - Iniciando checkout');
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout', {})
    const order = extractData<IOrder>(response)
    console.log('✅ [FRONTEND] startCheckout - Orden creada:', order.id);
    return order
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al iniciar el checkout'
    console.error('❌ [FRONTEND] Error en startCheckout:', error)
    
    // Si el error es por orden pendiente existente, extraer información
    if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
      console.log('🚨 [FRONTEND] Error de orden pendiente detectado');
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
    console.log('💳 [FRONTEND] processPayment - Procesando pago');
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout/pay', paymentData)
    const order = extractData<IOrder>(response)
    console.log('✅ [FRONTEND] processPayment - Pago procesado, orden:', order.id, 'estado:', order.status);
    return order
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago'
    console.error('❌ [FRONTEND] Error en processPayment:', error)
    
    // Si el error es por orden pendiente existente
    if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
      console.log('🚨 [FRONTEND] Error de orden pendiente detectado en processPayment');
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
    console.log('🔍 [FRONTEND] checkPendingOrder - Verificando orden PENDING');
    
    // Usar un endpoint dedicado para solo verificar, no crear
    const response = await apiClient.get<{ success: boolean; orders: IOrder[] }>('/orders/pending')
    
    console.log('📡 [FRONTEND] checkPendingOrder - Respuesta del servidor:', response.data);
    
    if (response.data.success && response.data.orders && response.data.orders.length > 0) {
      const order = response.data.orders[0] // Tomar la primera orden PENDING
      console.log('✅ [FRONTEND] checkPendingOrder - Orden PENDING encontrada:', order.id);
      console.log('📅 [FRONTEND] checkPendingOrder - expiresAt:', order.expiresAt);
      console.log('📅 [FRONTEND] checkPendingOrder - status:', order.status);
      return order
    }
    
    console.log('🔍 [FRONTEND] checkPendingOrder - No hay orden PENDING');
    return null
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al verificar orden PENDING'
    console.error('❌ [FRONTEND] Error en checkPendingOrder:', error)
    
    // Si el error es "El carrito está vacío", lo tratamos como un caso normal (no hay orden PENDING)
    if (errorMessage.includes('carrito está vacío') || errorMessage.includes('carrito vacio')) {
      console.log('🔍 [FRONTEND] checkPendingOrder - Carrito vacío, sin orden PENDING');
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
    console.log('🔄 [FRONTEND] cancelCheckout - Cancelando checkout');
    const response = await apiClient.delete<{ 
      success: boolean; 
      message: string; 
      data: { message: string; reservationId: string }
    }>('/checkout/cancel');
    
    const result = extractData<{ message: string; reservationId: string }>(response);
    console.log('✅ [FRONTEND] cancelCheckout - Checkout cancelado:', result.message);
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cancelar el checkout';
    console.error('❌ [FRONTEND] Error en cancelCheckout:', error);
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
    console.log('🔄 [FRONTEND] processCheckout (deprecated) - Procesando checkout legado');
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout', paymentData)
    const order = extractData<IOrder>(response)
    return order
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar el checkout'
    console.error('❌ [FRONTEND] Error en processCheckout (deprecated):', error)
    throw error
  }
}
