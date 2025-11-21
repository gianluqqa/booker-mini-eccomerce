// Hook personalizado para añadir libros al carrito

import { useState } from 'react'
import { addToCart } from '@/services/cartService'
import { IAddToCart, ICartItem } from '@/types/Cart'

interface UseAddToCartReturn {
  addBookToCart: (data: IAddToCart) => Promise<ICartItem | null>
  loading: boolean
  error: string | null
  resetError: () => void
}

/**
 * Hook personalizado para añadir libros al carrito
 * Maneja el estado de carga y errores
 * @returns Funciones y estado para añadir al carrito
 */
export const useAddToCart = (): UseAddToCartReturn => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const addBookToCart = async (data: IAddToCart): Promise<ICartItem | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await addToCart(data)
      return result
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al añadir el libro al carrito'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const resetError = () => {
    setError(null)
  }

  return {
    addBookToCart,
    loading,
    error,
    resetError,
  }
}

