"use client"
import React, { useEffect, useState } from 'react'
import { IUser } from '@/types/User'
import { ICartItem } from '@/types/Cart'
import { User, Mail, MapPin, Phone, Calendar, ShoppingCart, Package, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getUserProfile } from '@/services/userService'
import { getUserCart } from '@/services/cartService'
import { getRoleDisplay, getRoleColor, formatDate } from '@/utils/helpers'

const Profile = () => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<IUser | null>(null)
  const [cartItems, setCartItems] = useState<ICartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Obtener perfil del usuario actual
        const userData = await getUserProfile()
        setUserData(userData)

        // Obtener carrito del usuario
        try {
          const cartData = await getUserCart()
          setCartItems(cartData.items)
        } catch {
          // Si no hay carrito o hay error, simplemente no mostrar items
          setCartItems([])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos del perfil'
        setError(errorMessage)
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, router])

  // Si no está autenticado, no renderizar nada (será redirigido)
  if (!isAuthenticated) {
    return null
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mx-auto mb-4" />
          <p className="text-[#2e4b30] text-lg">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error || !userData) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'No se pudo cargar el perfil'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg font-medium hover:bg-[#1a3a1c] transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado del Perfil */}
        <div className="bg-[#2e4b30] rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar del usuario */}
            <div className="w-24 h-24 bg-[#f5efe1] bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-[#f5efe1]" />
            </div>
            
            {/* Información Principal */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#f5efe1] mb-2">
                {userData.name} {userData.surname}
              </h1>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(userData.role)}`}>
                  {getRoleDisplay(userData.role)}
                </span>
                <span className="text-[#f5efe1] text-sm opacity-80">
                  Miembro desde {formatDate(userData.createdAt)}
                </span>
              </div>
              <p className="text-[#f5efe1] opacity-90">
                Lector apasionado de literatura clásica y novelas contemporáneas.
              </p>
            </div>
          </div>
        </div>

        {/* Cuadrícula de Información */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Información de Contacto */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-[#2e4b30] mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Información de Contacto
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#4a6b4d]" />
                <span className="text-gray-700">{userData.email}</span>
              </div>
              {userData.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#4a6b4d]" />
                  <span className="text-gray-700">{userData.phone}</span>
                </div>
              )}
              {userData.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#4a6b4d] mt-1" />
                  <div>
                    <p className="text-gray-700">{userData.address}</p>
                    {userData.city && userData.country && (
                      <p className="text-gray-500 text-sm">
                        {userData.city}, {userData.country}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas de Actividad */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-[#2e4b30] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Actividad
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Libros en el carrito</span>
                <span className="font-semibold text-[#2e4b30]">
                  {cartItems.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de artículos en el carrito</span>
                <span className="font-semibold text-[#2e4b30]">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Miembro desde</span>
                <span className="font-semibold text-[#2e4b30]">
                  {formatDate(userData.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Pedidos Recientes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-[#2e4b30] mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Pedidos Recientes
          </h2>
          <div className="space-y-3">
            <p className="text-gray-500 text-center py-4">
              El historial de pedidos estará disponible próximamente
            </p>
          </div>
        </div>

        {/* Carrito Actual */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-[#2e4b30] mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito Actual
          </h2>
          {cartItems && cartItems.length > 0 ? (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-[#f5efe1] bg-opacity-30 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ShoppingCart className="w-4 h-4 text-[#4a6b4d] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 font-medium truncate">{item.book.title}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#2e4b30] ml-2">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay libros en el carrito</p>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button className="flex-1 bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg font-medium hover:bg-[#1a3a1c] transition-colors duration-200">
            Editar Perfil
          </button>
          <button className="flex-1 bg-white text-[#2e4b30] border border-[#2e4b30] px-6 py-3 rounded-lg font-medium hover:bg-[#f5efe1] transition-colors duration-200">
            Ver Historial
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile