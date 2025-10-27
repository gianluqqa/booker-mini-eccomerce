"use client"
import React from 'react'
import { IUser } from '@/interfaces/IUser'
import { User, Mail, MapPin, Phone, Calendar, ShoppingCart, Package,  } from 'lucide-react'

const Profile = () => {
  // Datos de ejemplo del usuario
  const userData: IUser = {
    id: "user-123",
    name: "Maria",
    surname: "Gonzalez",
    email: "maria.gonzalez@example.com",
    password: "********", 
    address: "Calle Mayor 123, 2º B",
    country: "España",
    city: "Madrid",
    phone: "+34 612 345 678",
    role: "USER",
    cart: ["book-1", "book-3", "book-7"],
    orders: ["order-001", "order-002", "order-003"],
  }


  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator'
      case 'USER':
        return 'User'
      default:
        return 'User'
    }
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'text-red-600 bg-red-100'
      case 'USER':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
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
                  Member since January 2024
                </span>
              </div>
              <p className="text-[#f5efe1] opacity-90">
                Passionate reader of classic literature and contemporary novels.
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
              Contact Information
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
              Activity
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Books in cart</span>
                <span className="font-semibold text-[#2e4b30]">
                  {userData.cart?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Orders placed</span>
                <span className="font-semibold text-[#2e4b30]">
                  {userData.orders?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member since</span>
                <span className="font-semibold text-[#2e4b30]">Enero 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Pedidos Recientes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-[#2e4b30] mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Recent Orders
          </h2>
          <div className="space-y-3">
            {userData.orders?.map((orderId, index) => (
              <div key={orderId} className="flex items-center justify-between p-3 bg-[#f5efe1] bg-opacity-30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#4a6b4d]" />
                  <span className="text-gray-700">Order #{orderId}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {index === 0 ? '2 days ago' : index === 1 ? '1 week ago' : '2 weeks ago'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito Actual */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-[#2e4b30] mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Current Cart
          </h2>
          {userData.cart && userData.cart.length > 0 ? (
            <div className="space-y-3">
              {userData.cart.map((bookId, index) => (
                <div key={bookId} className="flex items-center justify-between p-3 bg-[#f5efe1] bg-opacity-30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-[#4a6b4d]" />
                    <span className="text-gray-700">Book #{bookId}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {index === 0 ? 'Added today' : index === 1 ? 'Yesterday' : '3 days ago'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No books in the cart</p>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button className="flex-1 bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg font-medium hover:bg-[#1a3a1c] transition-colors duration-200">
            Edit Profile
          </button>
          <button className="flex-1 bg-white text-[#2e4b30] border border-[#2e4b30] px-6 py-3 rounded-lg font-medium hover:bg-[#f5efe1] transition-colors duration-200">
            View History
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile