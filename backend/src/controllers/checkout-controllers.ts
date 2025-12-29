import { Request, Response } from "express";
import { processCheckoutService, createStockReservationForCheckoutService } from "../services/checkout-services";

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

    const order = await processCheckoutService(authUser.id);

    return res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
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