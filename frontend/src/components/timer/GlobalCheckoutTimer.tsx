"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const { user } = useAuth();
  const [pendingOrder, setPendingOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 80 }); // Se ajustará al montar

  // Ajustar posición inicial a la esquina superior derecha al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth;
      const componentWidth = 384; // max-w-sm = 24rem = 384px
      const initialX = windowWidth - componentWidth - 16; // 16px = 1rem de margen
      setPosition({ x: initialX, y: 80 });
    }
  }, []);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

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
    
    // Verificar periódicamente cada 5 segundos para detectar nuevas órdenes PENDING
    const interval = setInterval(() => {
      checkForPendingOrder();
    }, 5000);
    
    return () => {
      clearInterval(interval);
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

  // Funciones de arrastre
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { ...position };
    e.preventDefault();
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    // Calcular nuevas posición
    let newX = elementStartPos.current.x + deltaX;
    let newY = elementStartPos.current.y + deltaY;

    // Obtener dimensiones de la ventana y del componente
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const componentWidth = 384; // max-w-sm = 24rem = 384px
    const componentHeight = 200; // Altura aproximada del componente

    // Aplicar límites para que no salga de la pantalla
    // Límite horizontal: no salir por la izquierda ni derecha
    newX = Math.max(0, Math.min(newX, windowWidth - componentWidth));
    
    // Límite vertical: no superar navbar (80px) ni salir por abajo
    newY = Math.max(80, Math.min(newY, windowHeight - componentHeight));

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
    <div 
      ref={dragRef}
      className={`fixed z-50 max-w-sm ${className}`}
      style={{ 
        left: position.x, 
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: isDragging ? 'none' : 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-[#f5efe1] border border-[#2e4b30] rounded-lg shadow-lg select-none">
        <div className="p-4">
          {/* Header - Ya no es el único arrastrable */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDanger ? 'bg-red-600' : isWarning ? 'bg-amber-600' : 'bg-[#2e4b30]'
              }`} />
              <span className="font-semibold text-[#2e4b30] text-sm">
                Checkout Activo
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Evitar que dispare el arrastre
                handleDismiss();
              }}
              className="text-[#2e4b30] hover:text-[#2e4b30]/80 transition-colors"
              title="Ocultar temporalmente"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Timer */}
          <div className="mb-3 text-center">
            <div className={`text-2xl font-bold ${
              isDanger ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-[#2e4b30]'
            }`}>
              {formattedTime}
            </div>
            <div className="text-xs text-[#2e4b30] mt-1">
              Tiempo restante para completar el pago
            </div>
          </div>

          {/* Order Info */}
          <div className="mb-3 p-3 bg-white border border-[#2e4b30]/50 rounded">
            <div className="flex justify-between items-center">
              <span className="text-[#2e4b30] text-xs">Orden:</span>
              <span className="font-mono font-semibold text-[#2e4b30] text-xs">
                #{pendingOrder.id?.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[#2e4b30] text-xs">Total:</span>
              <span className="font-bold text-[#2e4b30]">
                ${typeof pendingOrder.total === 'number' ? pendingOrder.total.toFixed(2) : parseFloat(String(pendingOrder.total)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Warning Messages */}
          {isWarning && !isDanger && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded">
              <div className="flex items-center space-x-2 text-amber-800">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">¡Queda poco tiempo! Completa tu pago pronto.</span>
              </div>
            </div>
          )}

          {isDanger && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
              <div className="flex items-center space-x-2 text-red-800">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">¡Tiempo por agotarse! Tu orden expirará pronto.</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Evitar que dispare el arrastre
                goToCheckout();
              }}
              className={`flex-1 px-3 py-2 rounded font-medium text-sm text-white transition-colors ${
                isDanger ? 'bg-red-600 hover:bg-red-700' :
                isWarning ? 'bg-amber-600 hover:bg-amber-700' :
                'bg-[#2e4b30] hover:bg-[#2e4b30]/90'
              }`}
            >
              Ir al Checkout
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Evitar que dispare el arrastre
                handleCancel();
              }}
              disabled={cancelling}
              className="flex-1 px-3 py-2 bg-[#2e4b30]/20 text-[#2e4b30] rounded font-medium text-sm transition-colors hover:bg-[#2e4b30]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? 'Cancelando...' : 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
