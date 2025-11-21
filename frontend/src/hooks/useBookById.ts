// Hook personalizado para obtener un libro por ID

import { useState, useEffect, useCallback } from 'react'
import { getBookById } from '@/services/booksService'
import { IBook } from '@/types/Book'

interface UseBookByIdReturn {
  book: IBook | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook personalizado para obtener un libro por su ID
 * @param id - ID del libro a obtener
 * @returns Libro, estado de carga, errores y función para recargar
 */
export const useBookById = (id: string | undefined): UseBookByIdReturn => {
  const [book, setBook] = useState<IBook | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBook = useCallback(async () => {
    if (!id) {
      setLoading(false)
      setError('ID de libro no proporcionado')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getBookById(id)
      setBook(data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el libro'
      setError(errorMessage)
      setBook(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBook()
  }, [fetchBook])

  return {
    book,
    loading,
    error,
    refetch: fetchBook,
  }
}

