//! Servicios exclusivos para ADMINISTRADORES
//! Todas las funciones aquí requieren autenticación y rol de admin

import { apiClient, extractData } from "@/config/api";
import { IUser } from "@/types/User";
import { IBook, ICreateBook, IUpdateBook } from "@/types/Book";
import { IOrder } from "@/types/Order";

/**
 * Obtiene todos los usuarios (solo para administradores)
 * Endpoint: GET /users
 * Requiere: Autenticación JWT + rol admin
 * @returns Lista de todos los usuarios
 * @throws Error si no se pueden obtener los usuarios o si no es admin
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: IUser[] }>(
      "/users"
    );
    return extractData<IUser[]>(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al cargar los usuarios";

    if (
      errorMessage.includes("403") ||
      errorMessage.includes("administrador")
    ) {
      throw new Error("No tienes permisos para ver todos los usuarios");
    }

    throw new Error(errorMessage);
  }
};

/**
 * Crea un nuevo libro (solo administradores)
 * Endpoint: POST /books
 * Requiere: Autenticación JWT + rol admin
 */
export const createBookAdmin = async (payload: ICreateBook): Promise<IBook> => {
  try {
    const response = await apiClient.post<{ success: boolean; data: IBook }>(
      "/books",
      payload
    );
    return extractData<IBook>(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "No se pudo crear el libro";
    throw new Error(errorMessage);
  }
};

/**
 * Actualiza un libro existente (solo administradores)
 * Endpoint: PUT /books/:id
 */
export const updateBookAdmin = async (id: string,payload: IUpdateBook): Promise<IBook> => {
  try {
    const response = await apiClient.put<{ success: boolean; data: IBook }>(
      `/books/${id}`,
      payload
    );
    return extractData<IBook>(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "No se pudo actualizar el libro";
    throw new Error(errorMessage);
  }
};

/**
 * Elimina un libro (solo administradores)
 * Endpoint: DELETE /books/:id
 */
export const deleteBookAdmin = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/books/${id}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "No se pudo eliminar el libro";
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene todas las órdenes de todos los usuarios (solo para administradores)
 * Endpoint: GET /orders/admin/all
 * Requiere: Autenticación JWT + rol admin
 * @returns Lista de todas las órdenes con información de usuarios
 * @throws Error si no se pueden obtener las órdenes o si no es admin
 */
export const getAllOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: IOrder[] }>(
      "/orders/admin/all"
    );
    return extractData<IOrder[]>(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al cargar las órdenes";

    if (
      errorMessage.includes("403") ||
      errorMessage.includes("administrador")
    ) {
      throw new Error("No tienes permisos para ver todas las órdenes");
    }

    throw new Error(errorMessage);
  }
};

/**
 * Cancela una orden pagada (solo para administradores)
 * Endpoint: PATCH /orders/admin/:id/cancel
 * Requiere: Autenticación JWT + rol admin
 * @param orderId - ID de la orden a cancelar
 * @returns Orden actualizada con estado CANCELLED
 * @throws Error si no se puede cancelar la orden o si no es admin
 */
export const cancelPaidOrder = async (orderId: string): Promise<IOrder> => {
  try {
    const response = await apiClient.patch<{ success: boolean; message: string; order: IOrder }>(
      `/orders/admin/${orderId}/cancel`
    );
    return extractData<IOrder>(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "No se pudo cancelar la orden";

    if (
      errorMessage.includes("403") ||
      errorMessage.includes("administrador")
    ) {
      throw new Error("No tienes permisos para cancelar órdenes");
    }

    if (errorMessage.includes("400") && errorMessage.includes("PAID")) {
      throw new Error("Solo se pueden cancelar órdenes en estado PAID");
    }

    if (errorMessage.includes("404")) {
      throw new Error("Orden no encontrada");
    }

    throw new Error(errorMessage);
  }
};
