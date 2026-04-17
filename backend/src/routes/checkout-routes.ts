import { Router } from "express";
import { processCheckoutController, createStockReservationForCheckoutController, cancelCheckoutController } from "../controllers/checkout-controllers";
import { authenticateJWT } from "../middlewares/auth";
import { validateNoPendingOrder } from "../middlewares/validatePendingOrder";
import { validateCheckout } from "../middlewares/validateCheckout";

const router = Router();

// Crear reserva de stock para checkout
router.post("/reserve", authenticateJWT, validateNoPendingOrder, createStockReservationForCheckoutController);

// Cancelar checkout y liberar reserva de stock
router.delete("/cancel", authenticateJWT, cancelCheckoutController);

// Crear nueva orden PENDING (solo si no existe una orden pendiente)
router.post("/", authenticateJWT, validateNoPendingOrder, validateCheckout, processCheckoutController);

// Procesar pago de orden PENDING existente
router.post("/pay", authenticateJWT, validateCheckout, processCheckoutController);

export default router;