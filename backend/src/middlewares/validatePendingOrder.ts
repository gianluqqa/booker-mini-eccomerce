import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderStatus } from "../enums/OrderStatus";
import { PendingOrderResponse } from "../dto/PendingOrderDto";

export const validateNoPendingOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = (req as any).authUser as { id: string; role: string } | undefined;
    
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const orderRepository = AppDataSource.getRepository(Order);
    
    // Buscar órdenes pendientes del usuario
    const pendingOrder = await orderRepository.findOne({
      where: {
        user: { id: authUser.id },
        status: OrderStatus.PENDING
      },
      relations: ["user", "items"]
    });

    console.log('🔍 Middleware validateNoPendingOrder - Usuario:', authUser.id);
    console.log('🔍 Buscando órdenes PENDING...');
    console.log('🔍 Orden encontrada:', pendingOrder ? {
      id: pendingOrder.id,
      status: pendingOrder.status,
      total: pendingOrder.total
    } : 'Ninguna');

    if (pendingOrder) {
      const pendingOrderData: PendingOrderResponse = {
        id: pendingOrder.id,
        total: pendingOrder.total,
        createdAt: pendingOrder.createdAt,
        expiresAt: pendingOrder.expiresAt || undefined,
        itemsCount: pendingOrder.items?.length || 0,
        message: "Tienes una orden pendiente en proceso",
        actionRequired: "Debes confirmar o cancelar tu orden pendiente antes de poder modificar el carrito"
      };

      return res.status(409).json({
        success: false,
        message: "Tienes una orden pendiente en proceso",
        data: pendingOrderData
      });
    }

    next();
  } catch (error) {
    console.error("Error en validateNoPendingOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al validar órdenes pendientes",
    });
  }
};

export const checkPendingOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = (req as any).authUser as { id: string; role: string } | undefined;
    
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const orderRepository = AppDataSource.getRepository(Order);
    
    // Buscar órdenes pendientes del usuario
    const pendingOrder = await orderRepository.findOne({
      where: {
        user: { id: authUser.id },
        status: OrderStatus.PENDING
      },
      relations: ["user", "items"]
    });

    console.log('🔍 Middleware checkPendingOrderStatus - Usuario:', authUser.id);
    console.log('🔍 Buscando órdenes PENDING...');
    console.log('🔍 Orden encontrada:', pendingOrder ? {
      id: pendingOrder.id,
      status: pendingOrder.status,
      total: pendingOrder.total
    } : 'Ninguna');

    // Agregar información de orden pendiente al request para que los controladores puedan usarla
    (req as any).pendingOrder = pendingOrder;

    next();
  } catch (error) {
    console.error("Error en checkPendingOrderStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al verificar estado de órdenes",
    });
  }
};
