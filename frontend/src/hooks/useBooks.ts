// Hook personalizado para obtener todos los libros

import { useState, useEffect, useCallback } from 'react'
import { getBooks } from '@/services/booksService'
import { IBook } from '@/types/Book'

interface UseBooksReturn {
  books: IBook[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook personalizado para obtener todos los libros
 * @param query - Opcional: término de búsqueda para filtrar libros
 * @returns Libros, estado de carga, errores y función para recargar
 */
export const useBooks = (query?: string): UseBooksReturn => {
  const [books, setBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getBooks(query)
      setBooks(data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los libros'
      setError(errorMessage)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return {
    books,
    loading,
    error,
    refetch: fetchBooks,
  }
}

