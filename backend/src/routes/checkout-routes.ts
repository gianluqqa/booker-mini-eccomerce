import { Router } from "express";
import { processCheckoutController, createStockReservationForCheckoutController, cancelCheckoutController } from "../controllers/checkout-controllers";
import { authenticateJWT } from "../middlewares/auth";
import { validateNoPendingOrder } from "../middlewares/validatePendingOrder";

const router = Router();

//? Crear reserva de stock para checkout (POST).
router.post("/reserve", authenticateJWT, validateNoPendingOrder, createStockReservationForCheckoutController);

//? Cancelar checkout y liberar reserva de stock (DELETE).
router.delete("/cancel", authenticateJWT, cancelCheckoutController);

//? Crear nueva orden PENDING (POST) - Solo si no existe orden PENDING
router.post("/", authenticateJWT, validateNoPendingOrder, processCheckoutController);

//? Procesar pago de orden PENDING existente (POST) - Permite si ya existe orden PENDING
router.post("/pay", authenticateJWT, processCheckoutController);

export default router;