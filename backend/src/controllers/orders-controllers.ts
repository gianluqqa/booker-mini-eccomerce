import { Request, Response } from "express";
import { createOrderService, getOrderByIdService, getUserOrdersService, getUserPendingOrdersService } from "../services/orders-services";

//? Crear una nueva orden (POST).
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as { id: string } | undefined;
    
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const { items } = req.body;

    // Validación básica de entrada
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un ítem para la orden",
      });
    }

    // Validar estructura de items
    for (const item of items) {
      if (!item.bookId || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Cada ítem debe tener bookId y quantity",
        });
      }

      if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: "La cantidad debe ser un número entero positivo",
        });
      }
    }

    const order = await createOrderService(authUser.id, { items });

    return res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
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

    const orders = await getUserPendingOrdersService(authUser.id);

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