// Servicios para operaciones relacionadas con el carrito

import { apiClient, extractData } from '@/config/api'
import { ICartResponse, IAddToCart, ICartItem } from '@/types/Cart'
import { IPendingOrder } from '@/types/PendingOrder'

interface CartResponse extends ICartResponse {
  pendingOrder?: IPendingOrder;
}

interface ApiResponse {
  success: boolean;
  data: ICartResponse & { pendingOrder?: IPendingOrder };
}

/**
 * Obtiene el carrito del usuario actual
 * @returns Datos del carrito del usuario
 * @throws Error si no se puede obtener el carrito
 */
export const getUserCart = async (): Promise<CartResponse> => {
  try {
    const response = await apiClient.get<ApiResponse>('/carts')
    
    const { data } = response.data;
    
    return {
      items: data.items,
      totalItems: data.totalItems,
      totalPrice: data.totalPrice,
      pendingOrder: data.pendingOrder
    };
  } catch (error: unknown) {
    throw error // Re-lanzar para que el interceptor o el contexto manejen el status
  }
}

/**
 * Añade un libro al carrito del usuario actual
 * @param addToCartData - Datos del libro a añadir (bookId y cantidad opcional)
 * @returns Item del carrito creado o actualizado
 * @throws Error si no se puede añadir el libro al carrito
 */
export const addToCart = async (addToCartData: IAddToCart): Promise<ICartItem> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; data: ICartItem }>('/carts/add', addToCartData)
    return extractData<ICartItem>(response)
  } catch (error: unknown) {
    throw error
  }
}

/**
 * Elimina un ítem del carrito del usuario actual
 * @param cartId - ID del ítem del carrito a eliminar
 * @returns Promise que se resuelve cuando el ítem se ha eliminado correctamente
 * @throws Error si no se puede eliminar el ítem del carrito
 */
export const removeFromCart = async (cartId: string): Promise<{ deletedItemId: string }> => {
  try {
    const response = await apiClient.delete<{ success: boolean; data: { id: string } }>(`/carts/${cartId}`);
    const data = extractData<{ id: string }>(response);
    return { deletedItemId: data.id };
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Vacía completamente el carrito del usuario actual
 * @returns Promise que se resuelve cuando el carrito se ha vaciado correctamente
 * @throws Error si no se puede vaciar el carrito
 */
export const clearCart = async (): Promise<{ deletedItemsCount: number }> => {
  try {
    const response = await apiClient.delete<{ success: boolean; data: { count: number } }>('/carts');
    const data = extractData<{ count: number }>(response);
    return { deletedItemsCount: data.count };
  } catch (error: unknown) {
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<ICartItem> => {
  try {
    const response = await apiClient.put<{ success: boolean; data: ICartItem }>(`/carts/${itemId}`, { quantity });
    return extractData<ICartItem>(response);
  } catch (error: unknown) {
    throw error;
  }
};