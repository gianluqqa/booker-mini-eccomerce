'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Users, BookOpen, BarChart3, Star, Search } from 'lucide-react'
import { getRoleDisplay } from '@/utils/helpers'
import { getAllUsers } from '@/services/adminService'
import { getBooks } from '@/services/booksService'
import { getAllOrders } from '@/services/adminService'
import { useState } from 'react'
import UsersTable from './UserTable'
import CreateBook from './CreateBook'
import BookList from './BookList'
import OrdersTable from './OrdersTable'
import ReviewsAdminTable from './ReviewsAdminTable'

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [usersCount, setUsersCount] = useState<number | null>(null)
  const [booksCount, setBooksCount] = useState<number | null>(null)
  const [ordersCount, setOrdersCount] = useState<number | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [userSearchTerm, setUserSearchTerm] = useState('')

  // Redirigir si no es admin
  useEffect(() => {
    if (loading) return

    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    // Fetch dashboard stats after confirming admin
    const fetchStats = async () => {
      try {
        const [users, books, orders] = await Promise.all([
          getAllUsers(),
          getBooks(),
          getAllOrders(),
        ])
        setUsersCount(users.length)
        setBooksCount(books.length)
        setOrdersCount(orders.length)
      } catch (err) {
        console.error('Error loading admin stats', err)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [isAuthenticated, loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-[#2e4b30] text-base">Cargando panel de administrador...</p>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Encabezado del admin */}
        <div className="bg-[#2e4b30] rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#f5efe1] mb-1">
              Panel de administrador
            </h1>
            <p className="text-[#f5efe1] text-sm sm:text-base opacity-80">
              Gestiona usuarios, libros y monitorea la actividad general de la tienda.
            </p>
          </div>

          <div className="w-full sm:w-auto sm:min-w-[250px] flex-shrink-0 bg-[#f5efe1]/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
                <Image src="/admin-logo.png" alt="Avatar admin" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <p className="text-xs text-[#f5efe1]/80">Sesión iniciada como</p>
                <p className="text-sm font-semibold text-[#f5efe1]">
                  {user.name} {user.surname}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#f5efe1]/90">
              <span className="px-3 py-1 rounded-full bg-[#f5efe1]/10 border border-[#f5efe1]/30">
                {getRoleDisplay(user.role)}
              </span>
              <button 
                onClick={() => router.push('/profile')}
                className="px-3 py-1 rounded-full bg-[#f5efe1] text-[#2e4b30] font-semibold hover:bg-white transition-colors"
              >
                Ir a Perfil de Comprador
              </button>
            </div>
          </div>
        </div>

        {/* Sección de resumen / métricas (maqueta) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#fcfaf5] rounded-xl p-3 shadow-sm border border-gray-200/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">Usuarios</p>
              {statsLoading ? (
                <p className="text-lg font-semibold text-[#2e4b30]">Cargando...</p>
              ) : (
                <p className="text-lg font-semibold text-[#2e4b30]">{usersCount ?? '—'}</p>
              )}
              <p className="text-[11px] text-gray-400">Usuarios registrados</p>
            </div>
          </div>

          <div className="bg-[#fcfaf5] rounded-xl p-3 shadow-sm border border-gray-200/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">Libros</p>
              {statsLoading ? (
                <p className="text-lg font-semibold text-[#2e4b30]">Cargando...</p>
              ) : (
                <p className="text-lg font-semibold text-[#2e4b30]">{booksCount ?? '—'}</p>
              )}
              <p className="text-[11px] text-gray-400">Gestión de catálogo</p>
            </div>
          </div>

          <div className="bg-[#fcfaf5] rounded-xl p-3 shadow-sm border border-gray-200/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">Pedidos</p>
              {statsLoading ? (
                <p className="text-lg font-semibold text-[#2e4b30]">Cargando...</p>
              ) : (
                <p className="text-lg font-semibold text-[#2e4b30]">{ordersCount ?? '—'}</p>
              )}
              <p className="text-[11px] text-gray-400">Monitoreo de ventas</p>
            </div>
          </div>
        </div>

        {/* Gestión de usuarios */}
        <div className="bg-[#fcfaf5] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/50">
          <UsersTable />
        </div>

        {/* Gestión de libros */}
        <div className="bg-[#fcfaf5] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/50 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#2e4b30]">
                Gestión de catálogo de libros
              </h2>
              <p className="text-xs text-gray-600">
                Crea nuevos libros y administra el listado completo del catálogo.
              </p>
            </div>
          </div>

          <CreateBook />
          <BookList />
        </div>

        {/* Gestión de órdenes */}
        <div className="bg-[#fcfaf5] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/50 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#2e4b30]">
                Gestión de Órdenes
              </h2>
              <p className="text-xs text-gray-600">
                Visualiza y monitorea todas las órdenes del sistema con detalles de clientes y estados.
              </p>
            </div>
          </div>

          <OrdersTable />
        </div>

        {/* Gestión de Reviews */}
        <div className="bg-[#fcfaf5] rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#2e4b30]">
                  Gestión de Reviews
                </h2>
                <p className="text-xs text-gray-600">
                  Visualiza y filtra todas las reviews del sistema por usuario.
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por usuario..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e4b30] text-sm text-gray-900"
              />
            </div>
          </div>

          <ReviewsAdminTable userSearchTerm={userSearchTerm} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard