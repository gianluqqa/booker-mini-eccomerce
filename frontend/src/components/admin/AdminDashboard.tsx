'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Users, BookOpen, BarChart3, Settings } from 'lucide-react'
import { getRoleDisplay } from '@/utils/helpers'
import UsersTable from './UserTable'
import CreateBook from './CreateBook'
import BookList from './BookList'
import OrdersTable from './OrdersTable'

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Redirigir si no es admin
  useEffect(() => {
    if (loading) return

    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
    }
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
              <div className="w-9 h-9 rounded-full bg-[#f5efe1]/20 flex items-center justify-center overflow-hidden">
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
              <span className="text-[11px] text-[#f5efe1]/90">
                ID: {user.id?.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        {/* Sección de resumen / métricas (maqueta) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#fcfaf5] rounded-xl p-3 shadow-sm border border-gray-200/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">Usuarios</p>
              <p className="text-lg font-semibold text-[#2e4b30]">—</p>
              <p className="text-[11px] text-gray-400">Usuarios registrados</p>
            </div>
          </div>

          <div className="bg-[#fcfaf5] rounded-xl p-3 shadow-sm border border-gray-200/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">Libros</p>
              <p className="text-lg font-semibold text-[#2e4b30]">—</p>
              <p className="text-[11px] text-gray-400">Gestión de catálogo</p>
            </div>
          </div>

          <div className="bg-[#fcfaf5] rounded-xl p-3 shadow-sm border border-gray-200/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">Pedidos</p>
              <p className="text-lg font-semibold text-[#2e4b30]">—</p>
              <p className="text-[11px] text-gray-400">Monitoreo de ventas</p>
            </div>
          </div>

          <div className="bg-[#fcfaf5] rounded-xl p-3 shadow-sm border border-gray-200/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">Configuración</p>
              <p className="text-lg font-semibold text-[#2e4b30]">—</p>
              <p className="text-[11px] text-gray-400">Parámetros de la tienda</p>
            </div>
          </div>
        </div>

        {/* Sección de acciones rápidas (maqueta basada en endpoints existentes) */}
        <div className="bg-[#fcfaf5] rounded-2xl p-6 shadow-sm border border-gray-200/50 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#2e4b30] mb-2">
              Acciones rápidas de administrador
            </h2>
            <p className="text-xs text-gray-600">
              Atajos a las tareas más frecuentes de administración: gestión de usuarios y
              catálogo de libros. Más adelante aquí podrás conectar vistas dedicadas.
            </p>
          </div>

          {/* Botones de acciones rápidas */}
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              className="flex items-center justify-between w-full bg-white hover:bg-gray-50 text-[#2e4b30] px-4 py-3 rounded-xl transition-colors duration-200 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-xs font-semibold">Ver y gestionar usuarios</p>
                  <p className="text-[11px] text-gray-600">
                    Tabla detallada con todos los usuarios de la plataforma
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#2e4b30] text-[#f5efe1]">
                Tabla abajo
              </span>
            </button>

            <button
              type="button"
              className="flex items-center justify-between w-full bg-white hover:bg-gray-50 text-[#2e4b30] px-4 py-3 rounded-xl transition-colors duration-200 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-xs font-semibold">Administrar catálogo de libros</p>
                  <p className="text-[11px] text-gray-600">
                    Crear nuevos libros y gestionar el listado existente
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#2e4b30] text-[#f5efe1]">
                Sección abajo
              </span>
            </button>
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
      </div>
    </div>
  )
}

export default AdminDashboard