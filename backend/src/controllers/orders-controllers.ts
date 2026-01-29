import { Request, Response } from "express";
import { getOrderByIdService, getUserOrdersService, getUserPendingOrdersService } from "../services/orders-services";

//? Obtener una orden por ID (GET).
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authUser = (req as any).authUser as { id: string } | undefined;

    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de orden es requerido",
      });
    }

    const order = await getOrderByIdService(id, authUser.id);

    return res.json({
      success: true,
      order,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Obtener todas las órdenes confirmadas del usuario (GET).
export const getUserOrdersController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as { id: string } | undefined;

    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const orders = await getUserOrdersService(authUser.id);

    return res.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Obtener todas las órdenes pendientes del usuario (GET).
export const getUserPendingOrdersController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as { id: string } | undefined;

    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    console.log('🔍 [BACKEND] getUserPendingOrdersController - Buscando órdenes PENDING para usuario:', authUser.id);

    const orders = await getUserPendingOrdersService(authUser.id);

    // Devolver la primera orden PENDING o null
    const pendingOrder = orders && orders.length > 0 ? orders[0] : null;

    console.log('📋 [BACKEND] getUserPendingOrdersController - Órdenes encontradas:', orders?.length || 0);
    console.log('📋 [BACKEND] getUserPendingOrdersController - Orden PENDING:', pendingOrder ? {
      id: pendingOrder.id,
      status: pendingOrder.status,
      expiresAt: pendingOrder.expiresAt
    } : 'Ninguna');

    return res.json({
      success: true,
      data: pendingOrder, 
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    console.error('❌ [BACKEND] Error en getUserPendingOrdersController:', error);

    return res.status(status).json({
      success: false,
      message,
    });
  }
};