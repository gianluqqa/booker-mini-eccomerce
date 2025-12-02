"use client"

import React from 'react'
import { Package } from 'lucide-react'
import { IOrder } from '@/types/Order'
import { formatDate } from '@/utils/helpers'

interface ConfirmOrdersProps {
  orders: IOrder[]
}

const ConfirmOrders: React.FC<ConfirmOrdersProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-[#2e4b30] mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Pedidos Confirmados
        </h2>
        <p className="text-gray-500 text-center py-4">No tienes pedidos confirmados aún</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-semibold text-[#2e4b30] mb-4 flex items-center gap-2">
        <Package className="w-5 h-5" />
        Pedidos Confirmados
      </h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-600">Orden #</span>
                  <span className="text-sm font-semibold text-[#2e4b30]">{order.id.substring(0, 8)}...</span>
                </div>
                {order.createdAt && <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>}
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status === 'paid' ? 'Pagado' : order.status === 'shipped' ? 'Enviado' : order.status}
                </span>
                {order.total && (
                  <span className="text-lg font-bold text-[#2e4b30]">${Number(order.total).toFixed(2)}</span>
                )}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-700 truncate">{item.book.title}</p>
                      {item.book.author && (
                        <p className="text-xs text-gray-500 truncate">por {item.book.author}</p>
                      )}
                      <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right ml-4">
                      {item.totalPrice ? (
                        <p className="font-semibold text-[#2e4b30]">${item.totalPrice.toFixed(2)}</p>
                      ) : (
                        <p className="font-semibold text-[#2e4b30]">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConfirmOrders
