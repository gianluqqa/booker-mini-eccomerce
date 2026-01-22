"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IOrder } from '@/types/Order';
import { checkPendingOrder, cancelCheckout } from '@/services/checkoutService';
import { useReservationTimer } from '@/hooks/useReservationTimer';
import { useAuth } from '@/contexts/AuthContext';

interface GlobalCheckoutTimerProps {
  className?: string;
}

export const GlobalCheckoutTimer: React.FC<GlobalCheckoutTimerProps> = ({ className = "" }) => {
  const router = useRouter();
  const { user } = useAuth(); // Obtener estado de autenticación
  const [pendingOrder, setPendingOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [show, setShow] = useState(false);

  // Verificar si hay una orden PENDING activa (solo si hay usuario autenticado)
  const checkForPendingOrder = useCallback(async () => {
    // No verificar si no hay usuario autenticado
    if (!user) {
      setPendingOrder(null);
      setShow(false);
      setLoading(false);
      return;
    }

    try {
      const order = await checkPendingOrder();
      if (order && order.status === 'pending') {
        setPendingOrder(order);
        setShow(true);
      } else {
        setPendingOrder(null);
        setShow(false);
      }
    } catch {
      setPendingOrder(null);
      setShow(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Verificar al montar el componente y cuando cambia el usuario
  useEffect(() => {
    checkForPendingOrder();
    
    // NOTA: Eliminada la verificación periódica para evitar duplicación de órdenes
    // El usuario debe recargar la página o navegar para verificar nuevas órdenes PENDING
    
    return () => {
      // Limpieza si es necesaria en el futuro
    };
  }, [user, checkForPendingOrder]); // Dependencia del usuario y la función memorizada

  // Usar el hook de temporizador si hay orden pendiente
  const handleExpired = useCallback(() => {
    // Cuando expira, ocultar el componente y limpiar estado
    setShow(false);
    setPendingOrder(null);
    // NOTA: Eliminada la verificación automática para evitar crear nuevas órdenes
  }, []);

  const { isExpired, formattedTime, isWarning, isDanger } = useReservationTimer(
    pendingOrder?.expiresAt ? (typeof pendingOrder.expiresAt === 'string' ? pendingOrder.expiresAt : pendingOrder.expiresAt.toISOString()) : null,
    handleExpired
  );

  // Navegar al checkout
  const goToCheckout = () => {
    router.push('/checkout');
  };

  // Cancelar orden
  const handleCancel = async () => {
    if (!pendingOrder) return;
    
    setCancelling(true);
    try {
      await cancelCheckout();
      setPendingOrder(null);
      setShow(false);
    } catch (error) {
      console.error('❌ Error al cancelar orden desde timer global:', error);
    } finally {
      setCancelling(false);
    }
  };

  // Ocultar manualmente
  const handleDismiss = () => {
    setShow(false);
  };

  // No mostrar si está cargando, no hay orden, o está expirado
  if (loading || !show || !pendingOrder || isExpired) {
    return null;
  }

  // No mostrar en páginas de cart y checkout
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath === '/cart' || currentPath === '/checkout') {
      return null;
    }
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      <div className={`bg-white rounded-lg shadow-lg border-l-4 ${
        isDanger ? 'border-red-500' : isWarning ? 'border-yellow-500' : 'border-blue-500'
      } p-4`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isDanger ? 'bg-red-500 animate-pulse' : isWarning ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'
            }`} />
            <span className="font-semibold text-gray-800 text-sm">
              Checkout Activo
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Ocultar temporalmente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Timer */}
        <div className="mb-3">
          <div className={`text-2xl font-bold ${
            isDanger ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-blue-600'
          }`}>
            {formattedTime}
          </div>
          <div className="text-xs text-gray-500">
            Tiempo restante para completar el pago
          </div>
        </div>

        {/* Order Info */}
        <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Orden:</span>
            <span className="font-mono text-gray-800">#{pendingOrder.id?.slice(-8)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold text-gray-800">
              ${typeof pendingOrder.total === 'number' ? pendingOrder.total.toFixed(2) : parseFloat(String(pendingOrder.total)).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Warning Messages */}
        {isWarning && !isDanger && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <div className="flex items-center space-x-1 text-yellow-800">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>¡Queda poco tiempo! Completa tu pago pronto.</span>
            </div>
          </div>
        )}

        {isDanger && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <div className="flex items-center space-x-1 text-red-800">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>¡Tiempo por agotarse! Tu orden expirará pronto.</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={goToCheckout}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ir al Checkout
          </button>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelling ? 'Cancelando...' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
};
