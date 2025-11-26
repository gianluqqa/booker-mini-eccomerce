// Hook personalizado para manejar la búsqueda de libros
// Este hook gestiona el estado de búsqueda usando query params en la URL
// Esto permite compartir enlaces con búsquedas y mantener el estado al recargar

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

/**
 * Hook personalizado para manejar la búsqueda de libros
 * @returns Objeto con el término de búsqueda, función para actualizarlo y función para limpiarlo
 */
export const useSearch = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Obtener el término de búsqueda actual de la URL (si existe)
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return searchParams.get('q') || ''
  })

  // Sincronizar el estado cuando cambian los query params de la URL
  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
  }, [searchParams])

  /**
   * Actualiza el término de búsqueda en la URL
   * @param query - Término de búsqueda a establecer
   */
  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query)
    
    // Actualizar la URL con el nuevo query param
    // Si el query está vacío, removemos el parámetro de la URL
    if (query.trim() === '') {
      router.push(pathname, { scroll: false })
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set('q', query.trim())
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [router, pathname, searchParams])

  /**
   * Limpia el término de búsqueda
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  return {
    searchQuery,
    updateSearch,
    clearSearch,
  }
}

