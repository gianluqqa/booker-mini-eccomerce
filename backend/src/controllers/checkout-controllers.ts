import { Request, Response } from "express";
import { processCheckoutService, createStockReservationForCheckoutService, cancelCheckoutService } from "../services/checkout-services";

//? Crear reserva de stock para checkout (POST).
export const createStockReservationForCheckoutController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const reservation = await createStockReservationForCheckoutService(authUser.id);

    return res.status(201).json({
      success: true,
      message: "Reserva de stock creada exitosamente",
      data: reservation,
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

//? Cancelar checkout y liberar reserva de stock (DELETE).
export const cancelCheckoutController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const result = await cancelCheckoutService(authUser.id);

    return res.status(200).json({
      success: true,
      message: "Orden cancelada y stock devuelto exitosamente",
      data: {
        orderId: result.orderId,
        reservationId: result.reservationId,
      },
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

//? Procesar checkout y crear orden (POST).
export const processCheckoutController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // Recibir datos de pago del frontend
    const paymentData = req.body;

    const order = await processCheckoutService(authUser.id, paymentData);

    // Diferenciar mensaje según la acción realizada
    const message = paymentData && paymentData.cardNumber 
      ? "Pago procesado exitosamente" 
      : "Orden pendiente creada exitosamente";

    return res.status(201).json({
      success: true,
      message,
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