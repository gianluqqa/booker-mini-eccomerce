import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "../enums/ErrorCodes";

/**
 * Middleware para validar los datos de pago en el checkout.
 */
export const validateCheckout = (req: Request, res: Response, next: NextFunction) => {
  const { cardNumber, cardName, expiryDate, cvc } = req.body;
  const errors: string[] = [];

  // Solo validamos si se enviaron datos de pago (para soportar PENDING sin pago inicial)
  const hasPaymentData = req.body && Object.keys(req.body).length > 0;

  if (hasPaymentData) {
    // 1. Validar número de tarjeta (16 dígitos)
    const cleanCardNumber = cardNumber ? cardNumber.toString().replace(/\s/g, "").replace(/-/g, "") : "";
    if (!cardNumber || !/^\d{16}$/.test(cleanCardNumber)) {
      errors.push("El número de tarjeta debe tener 16 dígitos");
    }

    // 2. Validar nombre
    if (!cardName || cardName.trim().length < 3) {
      errors.push("El nombre en la tarjeta es obligatorio");
    }

    // 3. Validar fecha de vencimiento (MM/YY)
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      errors.push("La fecha de vencimiento debe tener el formato MM/YY");
    } else {
      const [month, year] = expiryDate.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100; // Tomamos los últimos 2 dígitos
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        errors.push("Mes de vencimiento inválido");
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push("La tarjeta está vencida o el año es inferior al actual");
      }
    }

    // 4. Validar CVC (3 o 4 dígitos)
    if (!cvc || !/^\d{3,4}$/.test(cvc.toString())) {
      errors.push("El CVC debe tener 3 o 4 dígitos");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Datos de pago inválidos",
      code: ErrorCodes.PAYMENT_DATA_INVALID,
      errors,
    });
  }

  next();
};
