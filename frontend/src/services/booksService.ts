// Servicios para operaciones relacionadas con libros

import { apiClient, extractData } from '@/config/api'
import { IBook } from '@/types/Book'

export interface IGenre {
  id: string
  name: string
}

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
    const response = await apiClient.get(`/books/${id}`)
    return extractData<IBook>(response)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar el libro'
    throw new Error(errorMessage)
  }
}

/**
 * Obtiene todos los géneros disponibles
 */
export const getGenres = async (): Promise<IGenre[]> => {
  try {
    const response = await apiClient.get<IGenre[]>('/books/genres')
    return Array.isArray(response.data) ? response.data : []
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar los géneros'
    throw new Error(errorMessage)
  }
}


