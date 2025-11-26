// Hook personalizado para búsqueda en tiempo real con debounce
// Este hook realiza búsquedas mientras el usuario escribe, con un delay (debounce)
// para evitar hacer demasiadas peticiones al servidor

import { useState, useEffect } from 'react'
import { getBooks } from '@/services/booksService'
import { IBook } from '@/types/Book'

interface UseSearchResultsReturn {
  results: IBook[]
  loading: boolean
  error: string | null
}

/**
 * Hook personalizado para búsqueda en tiempo real de libros
 * @param query - Término de búsqueda
 * @param debounceMs - Tiempo de espera en milisegundos antes de buscar (default: 300ms)
 * @param maxResults - Número máximo de resultados a mostrar (default: 5)
 * @returns Resultados de búsqueda, estado de carga y errores
 */
export const useSearchResults = (
  query: string,
  debounceMs: number = 300,
  maxResults: number = 5
): UseSearchResultsReturn => {
  const [results, setResults] = useState<IBook[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Si el query está vacío, no hacer búsqueda
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    // Configurar el debounce: esperar antes de hacer la búsqueda
    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        // Hacer la búsqueda en el servidor
        const books = await getBooks(query.trim())
        
        // Limitar el número de resultados
        setResults(books.slice(0, maxResults))
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al buscar libros'
        setError(errorMessage)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, debounceMs)

    // Limpiar el timeout si el query cambia antes de que se complete
    return () => clearTimeout(timeoutId)
  }, [query, debounceMs, maxResults])

  return {
    results,
    loading,
    error,
  }
}

