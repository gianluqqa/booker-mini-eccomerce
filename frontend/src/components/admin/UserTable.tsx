"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getAllUsers } from '@/services/adminService'
import { IUser } from '@/types/User'
import { Users, Loader2, AlertCircle, Mail, Calendar, Shield, User as UserIcon } from 'lucide-react'
import { getRoleDisplay, getRoleColor, formatDate } from '@/utils/helpers'

const UsersTable = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar autenticación y rol de admin
    if (authLoading) return

    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }

    // Cargar usuarios
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los usuarios'
        setError(errorMessage)
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isAuthenticated, authLoading, user, router])

  // No renderizar si no es admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mx-auto mb-4" />
          <p className="text-[#2e4b30] text-lg">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Error al cargar usuarios</h3>
        </div>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#2e4b30] text-[#f5efe1] px-6 py-2 rounded-lg font-medium hover:bg-[#1a3a1c] transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2e4b30] bg-opacity-10 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#2e4b30]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#2e4b30]">Gestión de Usuarios</h2>
            <p className="text-sm text-gray-600">
              {users.length} {users.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Usuario</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Rol</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Registrado</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr
                  key={userItem.id}
                  className="border-b border-gray-100 hover:bg-[#f5efe1] hover:bg-opacity-30 transition-colors duration-150"
                >
                  {/* Columna Usuario */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2e4b30] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-[#2e4b30]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {userItem.name} {userItem.surname}
                        </p>
                        <p className="text-xs text-gray-500">ID: {userItem.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>

                  {/* Columna Email */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{userItem.email}</span>
                    </div>
                  </td>

                  {/* Columna Rol */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        userItem.role
                      )}`}
                    >
                      {userItem.role === 'admin' && <Shield className="w-3 h-3" />}
                      {getRoleDisplay(userItem.role)}
                    </span>
                  </td>

                  {/* Columna Fecha de registro */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(userItem.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>

                  {/* Columna Ubicación */}
                  <td className="py-4 px-4">
                    {userItem.city && userItem.country ? (
                      <span className="text-sm text-gray-600">
                        {userItem.city}, {userItem.country}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No especificada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UsersTable