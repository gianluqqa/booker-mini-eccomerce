// Servicios para operaciones relacionadas con libros

import { apiClient } from '@/config/api'
import { IBook } from '@/types/Book'

/**
 * Obtiene todos los libros desde la API
 * @param query - Opcional: término de búsqueda para filtrar libros
 * @returns Lista de libros
 * @throws Error si no se pueden obtener los libros
 */
export const getBooks = async (query?: string): Promise<IBook[]> => {
  try {
    const params = query ? { q: query } : {}
    const response = await apiClient.get<IBook[]>('/books', { params })
    // El backend retorna directamente un array de libros
    return Array.isArray(response.data) ? response.data : []
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar los libros'
    throw new Error(errorMessage)
  }
}

/**
 * Obtiene un libro por su ID desde la API
 * @param id - ID del libro a obtener
 * @returns Datos del libro
 * @throws Error si no se puede obtener el libro
 */
export const getBookById = async (id: string): Promise<IBook> => {
  try {
    const response = await apiClient.get<IBook>(`/books/${id}`)
    return response.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar el libro'
    throw new Error(errorMessage)
  }
}

