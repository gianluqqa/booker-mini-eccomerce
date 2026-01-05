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
