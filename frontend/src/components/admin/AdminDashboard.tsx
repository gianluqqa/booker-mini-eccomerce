'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Shield, Users, BookOpen, BarChart3, Settings, User as UserIcon } from 'lucide-react'
import { getRoleDisplay } from '@/utils/helpers'
import UsersTable from './UserTable'
import CreateBook from './CreateBook'
import BookList from './BookList'

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
        <p className="text-[#2e4b30] text-lg">Cargando panel de administrador...</p>
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
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#f5efe1] bg-opacity-10 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-[#f5efe1]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#f5efe1] mb-1">
                Panel de administrador
              </h1>
              <p className="text-[#f5efe1] text-sm sm:text-base opacity-80">
                Gestiona usuarios, libros y monitorea la actividad general de la tienda.
              </p>
            </div>
          </div>

          <div className="bg-[#f5efe1] bg-opacity-10 rounded-xl p-4 min-w-[220px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#f5efe1] bg-opacity-20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-[#f5efe1]" />
              </div>
              <div>
                <p className="text-xs text-[#f5efe1] opacity-80">Sesión iniciada como</p>
                <p className="text-sm font-semibold text-[#f5efe1]">
                  {user.name} {user.surname}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#f5efe1] opacity-90">
              <span className="px-3 py-1 rounded-full bg-[#f5efe1] bg-opacity-10 border border-[#f5efe1] border-opacity-30">
                {getRoleDisplay(user.role)}
              </span>
              <span className="text-[11px]">
                ID: {user.id?.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        {/* Sección de resumen / métricas (maqueta) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Usuarios</p>
              <p className="text-xl font-semibold text-[#2e4b30]">—</p>
              <p className="text-[11px] text-gray-400">Resumen de usuarios registrados (próximamente)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Libros</p>
              <p className="text-xl font-semibold text-[#2e4b30]">—</p>
              <p className="text-[11px] text-gray-400">Gestión de catálogo (crear/editar/eliminar)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Pedidos</p>
              <p className="text-xl font-semibold text-[#2e4b30]">—</p>
              <p className="text-[11px] text-gray-400">Panel de monitoreo de ventas (a implementar)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Configuración</p>
              <p className="text-xl font-semibold text-[#2e4b30]">—</p>
              <p className="text-[11px] text-gray-400">Parámetros de la tienda y permisos (placeholder)</p>
            </div>
          </div>
        </div>

        {/* Sección de acciones rápidas (maqueta basada en endpoints existentes) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-[#2e4b30] mb-4">
            Acciones rápidas de administrador
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Estas acciones son una maqueta basada en las funcionalidades del backend:
            gestión de usuarios (`/users`), gestión de libros (`/books`) y protección
            con rol admin. Más adelante aquí podrás conectar formularios y tablas reales.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              className="flex items-center justify-between w-full bg-[#f5efe1] hover:bg-[#f1e4cf] text-[#2e4b30] px-4 py-3 rounded-xl transition-colors duration-200 border border-[#e0d6c6]"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Ver y gestionar usuarios</p>
                  <p className="text-xs text-gray-600">Listado de todos los usuarios registrados</p>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#2e4b30] text-[#f5efe1]">
                Próximamente
              </span>
            </button>

            <button
              type="button"
              className="flex items-center justify-between w-full bg-[#f5efe1] hover:bg-[#f1e4cf] text-[#2e4b30] px-4 py-3 rounded-xl transition-colors duration-200 border border-[#e0d6c6]"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Administrar catálogo de libros</p>
                  <p className="text-xs text-gray-600">
                    Crear, editar y eliminar libros utilizando los endpoints protegidos
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#2e4b30] text-[#f5efe1]">
                Próximamente
              </span>
            </button>

            <UsersTable />
            <CreateBook />
            <BookList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard