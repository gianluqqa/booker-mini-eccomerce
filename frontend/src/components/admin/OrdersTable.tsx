'use client'

import React, { useEffect, useState } from 'react'
import { getAllOrders, cancelPaidOrder } from '@/services/adminService'
import { IOrder } from '@/types/Order'
import { Package, CheckCircle, XCircle, AlertCircle, Ban, Clock } from 'lucide-react'

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllOrders()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las órdenes')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setCancellingOrderId(orderId)
      const updatedOrder = await cancelPaidOrder(orderId)
      
      // Actualizar la orden en la lista local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      )

      // Mostrar mensaje de éxito
      alert('Orden cancelada exitosamente')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar la orden'
      setError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setCancellingOrderId(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'cancelled':
        return <Ban className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'Pagada'
      case 'pending':
        return 'Pendiente'
      case 'expired':
        return 'Expirada'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e4b30]"></div>
        <span className="ml-2 text-[#2e4b30]">Cargando órdenes...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
        <button
          onClick={fetchOrders}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes</h3>
        <p className="text-gray-600">No se encontraron órdenes en el sistema.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#2e4b30]">Todas las Órdenes</h3>
          <p className="text-sm text-gray-600">
            Visualización de todas las órdenes del sistema ({orders.length} total)
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-[#2e4b30] text-white rounded-lg hover:bg-[#1a2f1a] transition-colors"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Orden
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiración
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={order.id || `order-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {order.id ? `${order.id.slice(0, 8)}...` : 'ID no disponible'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {order.user ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || ''} {order.user?.surname || ''}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user?.email || 'Email no disponible'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Usuario no disponible</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status || '')}`}>
                      {getStatusIcon(order.status || '')}
                      <span className="ml-1">{getStatusText(order.status || '')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total || 0)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {order.createdAt ? formatDate(order.createdAt) : 'Fecha no disponible'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {order.expiresAt ? (
                      <span className="text-sm text-yellow-600">
                        {formatDate(order.expiresAt)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {(order.status?.toLowerCase() === 'paid') ? (
                      <button
                        onClick={() => order.id && handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {cancellingOrderId === order.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                            Cancelando...
                          </>
                        ) : (
                          <>
                            <Ban className="w-3 h-3 mr-1" />
                            Cancelar
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">Total Órdenes</p>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-900">Pagadas</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status.toLowerCase() === 'paid').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status.toLowerCase() === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center">
            <Ban className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-900">Canceladas</p>
              <p className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.status.toLowerCase() === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersTable
