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
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar el carrito'
    throw new Error(errorMessage)
  }
}

/**
 * Crea reserva de stock para el checkout (10 minutos)
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
    
    return extractData<IStockReservationResponse>(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear la reserva de stock';
    throw new Error(errorMessage);
  }
}

/**
 * Inicia el checkout - Crea orden PENDING inmediatamente
 * @returns Orden PENDING con expiración de 10 minutos
 * @throws Error si no se puede iniciar el checkout
 */
export const startCheckout = async (): Promise<IOrder> => {
  try {
    console.log('🚀 Iniciando checkout - Creando orden PENDING...')
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout', {})
    const order = extractData<IOrder>(response)
    console.log('✅ Orden PENDING creada:', order)
    return order
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al iniciar el checkout'
    console.error('❌ Error en startCheckout:', error)
    throw new Error(errorMessage)
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
    console.log('💳 Procesando pago de orden PENDING...', paymentData)
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout', paymentData)
    const order = extractData<IOrder>(response)
    console.log('✅ Pago procesado, orden actualizada:', order)
    return order
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago'
    console.error('❌ Error en processPayment:', error)
    throw new Error(errorMessage)
  }
}

/**
 * Verifica si existe una orden PENDING para el usuario
 * @returns Orden PENDING existente o null
 * @throws Error si no se puede verificar
 */
export const checkPendingOrder = async (): Promise<IOrder | null> => {
  try {
    console.log('🔍 Verificando orden PENDING existente...')
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout', {})
    const order = extractData<IOrder>(response)
    
    // Si el backend devuelve una orden PENDING existente, la retornamos
    if (order.status === 'pending') {
      console.log('✅ Orden PENDING encontrada:', order)
      return order
    }
    
    console.log('📋 No hay orden PENDING existente')
    return null
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al verificar orden PENDING'
    console.error('❌ Error en checkPendingOrder:', error)
    throw new Error(errorMessage)
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
    
    return extractData<{ message: string; reservationId: string }>(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cancelar el checkout';
    throw new Error(errorMessage);
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
    console.log('⚠️ Usando función legada processCheckout - Considerar usar startCheckout() + processPayment()')
    console.log('Enviando datos de pago al backend:', paymentData)
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout', paymentData)
    const order = extractData<IOrder>(response)
    console.log('Respuesta del backend:', order)
    return order
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar el checkout'
    console.error('Error en processCheckout:', error)
    throw new Error(errorMessage)
  }
}
