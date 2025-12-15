'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createBookAdmin } from '@/services/adminService'
import { getGenres, IGenre } from '@/services/booksService'
import { ICreateBook } from '@/types/Book'
import { BookOpen, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface CreateBookForm {
  title: string
  author: string
  price: string
  stock: string
  image: string
  genre: string
  intro: string
  description: string
}

const CreateBook: React.FC = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState<CreateBookForm>({
    title: '',
    author: '',
    price: '',
    stock: '',
    image: '',
    genre: '',
    intro: '',
    description: '',
  })

  const [genres, setGenres] = useState<IGenre[]>([])
  const [loadingGenres, setLoadingGenres] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Proteger ruta: solo admin
  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, user, router])

  // Cargar géneros
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true)
        const data = await getGenres()
        setGenres(data)
      } catch (err) {
        console.error('Error cargando géneros:', err)
      } finally {
        setLoadingGenres(false)
      }
    }

    fetchGenres()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validaciones básicas en frontend
    const priceNumber = Number(formData.price)
    const stockNumber = Number(formData.stock)

    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      setError('El precio debe ser un número mayor a 0')
      return
    }

    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      setError('El stock debe ser un número entero mayor o igual a 0')
      return
    }

    if (!formData.genre) {
      setError('Debes seleccionar un género')
      return
    }

    if (!formData.description || formData.description.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres')
      return
    }

    const payload: ICreateBook = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      price: priceNumber,
      stock: stockNumber,
      image: formData.image.trim() || undefined,
      genre: formData.genre,
      intro: formData.intro.trim() || undefined,
      description: formData.description.trim(),
    }

    try {
      setSubmitting(true)
      await createBookAdmin(payload)
      setSuccessMessage('Libro creado correctamente.')
      setFormData({
        title: '',
        author: '',
        price: '',
        stock: '',
        image: '',
        genre: '',
        intro: '',
        description: '',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear el libro'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || (!isAuthenticated && !user)) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#2e4b30] animate-spin mx-auto mb-3" />
          <p className="text-[#2e4b30] text-base">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#2e4b30] bg-opacity-10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-[#2e4b30]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#2e4b30]">Crear nuevo libro</h2>
          <p className="text-sm text-gray-600">Completa los campos para agregar un libro al catálogo.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
          <CheckCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Título *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
              placeholder="Ej: El Señor de los Anillos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="author">
              Autor *
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
              placeholder="Ej: J.R.R. Tolkien"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
              Precio (USD) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
              placeholder="Ej: 19.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stock">
              Stock *
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
              placeholder="Ej: 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="genre">
              Género *
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              disabled={loadingGenres}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {loadingGenres ? 'Cargando géneros...' : 'Selecciona un género'}
              </option>
              {genres.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="image">
            URL de imagen (opcional)
          </label>
          <input
            id="image"
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="intro">
            Introducción (opcional)
          </label>
          <textarea
            id="intro"
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white resize-none"
            placeholder="Breve introducción del libro..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
            Descripción *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white resize-none"
            placeholder="Describe de qué trata el libro y por qué es interesante..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#2e4b30] text-[#f5efe1] px-6 py-2 rounded-lg font-medium hover:bg-[#1a3a1c] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Creando libro...
              </span>
            ) : (
              'Crear libro'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBook