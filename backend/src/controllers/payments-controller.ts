import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";

export const createPayment = async (req: Request, res: Response) => {
  try {
    // Verificar autenticación
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // Obtener orderId del body
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId es requerido",
      });
    }

    // Obtener la orden de la base de datos
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: orderId },
      relations: ["user", "items", "items.book"],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    // Verificar que la orden pertenezca al usuario autenticado
    if (order.user.id !== authUser.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a esta orden",
      });
    }

    // Verificar que la orden tenga items
    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La orden no tiene items",
      });
    }

    // Respuesta temporal - sistema de pagos desactivado
    return res.status(503).json({
      success: false,
      message: "Sistema de pagos temporalmente desactivado",
      data: {
        orderId: orderId,
        total: order.total,
        items: order.items.length,
      },
    });
  } catch (error: any) {
    console.error("Error en procesamiento de pago:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error procesando pago",
    });
  }
};
