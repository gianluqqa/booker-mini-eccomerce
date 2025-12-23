// Servicios para operaciones de checkout

import { apiClient, extractData } from '@/config/api'
import { IOrder } from '@/types/Order'
import { ICartResponse } from '@/types/Cart'

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
 * Procesa el checkout del carrito (convierte el carrito en una orden)
 * @returns Orden creada
 * @throws Error si no se puede procesar el checkout
 */
export const processCheckout = async (): Promise<IOrder> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; data: IOrder }>('/checkout')
    return extractData<IOrder>(response)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar el checkout'
    throw new Error(errorMessage)
  }
}
