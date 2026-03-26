// Servicios para operaciones relacionadas con órdenes

import { apiClient, extractData } from '@/config/api'
import { IOrder } from '@/types/Order'

/**
 * Obtiene todas las órdenes confirmadas del usuario actual
 * @returns Lista de órdenes confirmadas del usuario
 * @throws Error si no se pueden obtener las órdenes
 */
export const getUserOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: IOrder[] }>('/orders')
    return extractData<IOrder[]>(response)
  } catch (error: unknown) {
    // Si no hay órdenes, devolver array vacío en lugar de lanzar error
    if (error instanceof Error && error.message.includes('404')) {
      return []
    }
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar las órdenes'
    throw new Error(errorMessage)
  }
}

/**
 * Obtiene todas las órdenes pendientes del usuario actual
 * @returns Lista de órdenes pendientes del usuario
 * @throws Error si no se pueden obtener las órdenes
 */
export const getUserPendingOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: IOrder[] }>('/orders/pending')
    return extractData<IOrder[]>(response)
  } catch (error: unknown) {
    // Si no hay órdenes, devolver array vacío en lugar de lanzar error
    if (error instanceof Error && error.message.includes('404')) {
      return []
    }
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar las órdenes pendientes'
    throw new Error(errorMessage)
  }
}

/**
 * Obtiene una orden específica por ID
 * @param orderId - ID de la orden a obtener
 * @returns Orden encontrada
 * @throws Error si no se puede obtener la orden
 */
export const getOrderById = async (orderId: string): Promise<IOrder> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: IOrder }>(`/orders/${orderId}`)
    return extractData<IOrder>(response)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar la orden'
    
    // Manejar específicamente errores de permisos (403) y no encontrado (404)
    if (errorMessage.includes('403')) {
      throw new Error('No tienes permiso para ver esta orden')
    }
    if (errorMessage.includes('404')) {
      throw new Error('La orden no existe')
    }
    
    throw new Error(errorMessage)
  }
}
