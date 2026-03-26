import { Request, Response } from "express";
import { getOrderByIdService, getUserOrdersService, getUserPendingOrdersService, getAllOrdersService, cancelPaidOrderService, clearAllOrdersService, clearCancelledOrdersService } from "../services/orders-services";

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

    const order = await getOrderByIdService(id, authUser.id);

    return res.json({
      success: true,
      data: order,
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
      data: orders,
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

    const orders = await getUserPendingOrdersService(authUser.id);

    // Devolver la primera orden PENDING como array para mantener consistencia con frontend
    const pendingOrder = orders && orders.length > 0 ? orders[0] : null;

    return res.json({
      success: true,
      data: pendingOrder ? [pendingOrder] : [],
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

//? Obtener todas las órdenes de todos los usuarios (solo administradores).
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersService();

    return res.json({
      success: true,
      data: orders,
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

//? Cancelar una orden pagada (solo para administradores).
export const cancelPaidOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await cancelPaidOrderService(id);

    return res.json({
      success: true,
      message: "Orden cancelada exitosamente",
      data: order,
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

//? Limpiar todas las órdenes de la base de datos (solo para administradores).
export const clearAllOrdersController = async (req: Request, res: Response) => {
  try {
    const result = await clearAllOrdersService();

    return res.json({
      success: true,
      message: "Todas las órdenes han sido eliminadas exitosamente",
      data: result,
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

//? Limpiar todas las órdenes canceladas de la base de datos (solo para administradores).
export const clearCancelledOrdersController = async (req: Request, res: Response) => {
  try {
    const result = await clearCancelledOrdersService();

    return res.json({
      success: true,
      message: "Todas las órdenes canceladas han sido eliminadas exitosamente",
      data: result,
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