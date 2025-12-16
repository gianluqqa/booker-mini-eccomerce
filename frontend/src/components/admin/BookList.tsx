'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useBooks } from '@/hooks/useBooks'
import { IBook } from '@/types/Book'
import { deleteBookAdmin } from '@/services/adminService'
import { BookOpen, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react'
import UpdateBook from './UpdateBook'

const BookList: React.FC = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { books, loading, error, refetch } = useBooks()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [editingBook, setEditingBook] = useState<IBook | null>(null)

  // Proteger: solo admin
  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleDelete = async (book: IBook) => {
    if (!book.id) return

    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el libro "${book.title}"?`
    )
    if (!confirmed) return

    try {
      setActionError(null)
      setDeletingId(book.id)
      await deleteBookAdmin(book.id)
      await refetch()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo eliminar el libro'
      setActionError(message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (book: IBook) => {
    setEditingBook(book)
  }

  const handleCloseEdit = () => {
    setEditingBook(null)
  }

  const handleUpdated = async () => {
    await refetch()
  }

  if (authLoading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-[#2e4b30] animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#2e4b30]">
              Lista de libros
            </h2>
            <p className="text-xs text-gray-600">
              {books.length} {books.length === 1 ? 'libro' : 'libros'} en el
              catálogo
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700 border border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {actionError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700 border border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#2e4b30] animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-base">No hay libros en el catálogo.</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto rounded-xl border border-gray-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-[#2e4b30]">
                  Título
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#2e4b30]">
                  Autor
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#2e4b30]">
                  Género
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#2e4b30]">
                  Precio
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#2e4b30]">
                  Stock
                </th>
                <th className="text-right py-3 px-4 font-semibold text-[#2e4b30]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-gray-100 hover:bg-[#f5efe1] hover:bg-opacity-40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 line-clamp-2">
                      {book.title}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-700">{book.author}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {book.genre}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-800 font-semibold">
                      ${book.price}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        book.stock > 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {book.stock > 0
                        ? `${book.stock} en stock`
                        : 'Sin stock'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(book)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#f5efe1] text-[#2e4b30] hover:bg-[#2e4b30] hover:text-[#f5efe1] transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(book)}
                        disabled={deletingId === book.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {deletingId === book.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ventana de edición */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
            <UpdateBook book={editingBook} onClose={handleCloseEdit} onUpdated={handleUpdated} />
          </div>
        </div>
      )}
    </div>
  )
}

export default BookList
