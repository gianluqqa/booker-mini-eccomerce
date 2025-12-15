//! Servicios exclusivos para ADMINISTRADORES
//! Todas las funciones aquí requieren autenticación y rol de admin

import { apiClient, extractData } from "@/config/api";
import { IUser } from "@/types/User";
import { IBook, ICreateBook, IUpdateBook } from "@/types/Book";

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
