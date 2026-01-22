// Servicios para operaciones relacionadas con el carrito

import { apiClient, extractData } from '@/config/api'
import { ICartResponse, IAddToCart, ICartItem } from '@/types/Cart'
import { IPendingOrder } from '@/types/PendingOrder'

interface CartResponse extends ICartResponse {
  pendingOrder?: IPendingOrder;
}

interface ApiResponse {
  success: boolean;
  data: ICartResponse;
  pendingOrder?: IPendingOrder;
}

/**
 * Obtiene el carrito del usuario actual
 * @returns Datos del carrito del usuario
 * @throws Error si no se puede obtener el carrito
 */
export const getUserCart = async (): Promise<CartResponse> => {
  try {
    const response = await apiClient.get<ApiResponse>('/carts')
    
    const responseData = response.data;
    
    // Extraer el carrito y mantener pendingOrder si existe
    const cartData = responseData.success ? responseData.data : (responseData as unknown as ICartResponse);
    
    return {
      items: cartData.items,
      totalItems: cartData.totalItems,
      totalPrice: cartData.totalPrice,
      pendingOrder: responseData.pendingOrder
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar el carrito'
    throw new Error(errorMessage)
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
    const errorMessage = error instanceof Error ? error.message : 'Error al añadir el libro al carrito'
    throw new Error(errorMessage)
  }
}

/**
 * Elimina un ítem del carrito del usuario actual
 * @param cartId - ID del ítem del carrito a eliminar
 * @returns Promise que se resuelve cuando el ítem se ha eliminado correctamente
 * @throws Error si no se puede eliminar el ítem del carrito
 */
export const removeFromCart = async (cartId: string): Promise<void> => {
  try {
    await apiClient.delete(`/carts/${cartId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el ítem del carrito';
    throw new Error(errorMessage);
  }
};

/**
 * Vacía completamente el carrito del usuario actual
 * @returns Promise que se resuelve cuando el carrito se ha vaciado correctamente
 * @throws Error si no se puede vaciar el carrito
 */
export const clearCart = async (): Promise<void> => {
  try {
    await apiClient.delete('/carts');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al vaciar el carrito';
    throw new Error(errorMessage);
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<ICartItem> => {
  try {
    const response = await apiClient.put<{ success: boolean; data: ICartItem }>(`/carts/${itemId}`, { quantity });
    return extractData<ICartItem>(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la cantidad';
    throw new Error(errorMessage);
  }
};