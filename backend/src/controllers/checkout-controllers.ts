import { Request, Response } from "express";
import { processCheckoutService, createStockReservationForCheckoutService } from "../services/checkout-services";
import { AppDataSource } from "../config/data-source";
import { StockReservation } from "../entities/StockReservation";

//? Verificar si existe reserva activa (GET).
export const checkExistingReservationController = async (req: Request, res: Response) => {
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

    const stockReservationRepository = AppDataSource.getRepository(StockReservation);
    const reservation = await stockReservationRepository.findOne({
      where: { userId: authUser.id },
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "No hay reserva activa",
      });
    }

    // Verificar que no haya expirado
    const now = new Date();
    if (reservation.expiresAt <= now) {
      // Eliminar reserva expirada
      await stockReservationRepository.remove(reservation);
      return res.status(404).json({
        success: false,
        message: "No hay reserva activa",
      });
    }

    // Parsear items desde JSON
    let reservationItems;
    try {
      reservationItems = JSON.parse(reservation.itemsJson);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al procesar la reserva",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reserva activa encontrada",
      data: {
        reservationId: reservation.id,
        items: reservationItems,
        totalAmount: reservation.totalAmount,
        expiresAt: reservation.expiresAt,
        totalMinutes: 10,
        message: "Reserva activa",
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