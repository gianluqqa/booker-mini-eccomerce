'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getAllReviewsAdmin, deleteReviewAdmin, IAdminReview, IAdminReviewsFilters, IAdminReviewsResponse } from '@/services/adminService'
import { Star, Filter, Search, Book, User, MessageSquare, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react'

const ReviewsAdminTable: React.FC = () => {
  const router = useRouter()
  const [reviews, setReviews] = useState<IAdminReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<IAdminReviewsFilters>({
    page: 1,
    limit: 10
  })
  const [showFilters, setShowFilters] = useState(false)
  const [bookFilter, setBookFilter] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)

  const handleViewReview = (review: IAdminReview) => {
    // Navegar a la página del libro para ver la review completa
    router.push(`/book/${review.bookId}`)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta review? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setDeletingReviewId(reviewId)
      await deleteReviewAdmin(reviewId)
      
      // Actualizar la lista local eliminando la review eliminada
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId))
      setTotal(prevTotal => prevTotal - 1)
      
      // Mostrar mensaje de éxito
      alert('✅ Review eliminada exitosamente')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la review'
      alert(`❌ Error: ${errorMessage}`)
    } finally {
      setDeletingReviewId(null)
    }
  }

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result: IAdminReviewsResponse = await getAllReviewsAdmin(filters)
      setReviews(result.reviews)
      setTotal(result.total)
      setCurrentPage(result.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las reviews')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleFilter = () => {
    const newFilters: IAdminReviewsFilters = {
      ...filters,
      page: 1,
      book: bookFilter.trim() || undefined,
      user: userFilter.trim() || undefined
    }
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setBookFilter('')
    setUserFilter('')
    setFilters({ page: 1, limit: 10 })
  }

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">({rating})</span>
      </div>
    )
  }

  const totalPages = Math.ceil(total / (filters.limit || 10))

  // Solo mostrar el loading de pantalla completa la primera vez
  if (loading && reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2e4b30]"></div>
        <span className="mt-4 text-[#2e4b30] font-medium">Cargando reviews...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#2e4b30]">Gestión de Reviews</h3>
          <p className="text-sm text-gray-600">
            Visualiza y filtra todas las reviews del sistema ({total} totales)
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Book className="w-4 h-4 inline mr-1" />
                Nombre del Libro
              </label>
              <input
                type="text"
                value={bookFilter}
                onChange={(e) => setBookFilter(e.target.value)}
                placeholder="Título del libro..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e4b30] text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nombre del Usuario
              </label>
              <input
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Nombre o apellido..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e4b30] text-gray-900 bg-white"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#2e4b30] text-white rounded-lg hover:bg-[#2e4b30]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <Search className="w-4 h-4" />}
                Filtrar
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="overflow-x-auto relative">
          {loading && reviews.length > 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
              <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100">
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-[#2e4b30] border-t-transparent"></div>
              </div>
            </div>
          )}
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Libro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No se encontraron reviews</p>
                    <p className="text-sm">Intenta ajustar los filtros o carga más datos</p>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        {review.title && (
                          <p className="font-medium text-gray-900 mb-1">{review.title}</p>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-3">{review.comment}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {review.user.name} {review.user.surname}
                        </p>
                        <p className="text-gray-500 text-xs">
                          ID: {review.userId.slice(0, 8)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {review.book ? (
                          <>
                            <p className="font-medium text-gray-900">{review.book.title}</p>
                            <p className="text-gray-500 text-xs">{review.book.author}</p>
                          </>
                        ) : (
                          <p className="text-gray-500">Libro no disponible</p>
                        )}
                        <p className="text-gray-500 text-xs">
                          ID: {review.bookId.slice(0, 8)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <p>{new Date(review.createdAt).toLocaleDateString('es-ES')}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleTimeString('es-ES')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewReview(review)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200 group"
                          title="Ver review completa en el libro"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={deletingReviewId === review.id}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar review"
                        >
                          {deletingReviewId === review.id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((currentPage - 1) * (filters.limit || 10)) + 1} a{' '}
                {Math.min(currentPage * (filters.limit || 10), total)} de {total} reviews
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsAdminTable
