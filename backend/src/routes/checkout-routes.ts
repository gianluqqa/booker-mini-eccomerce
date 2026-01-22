import { Router } from "express";
import { processCheckoutController, createStockReservationForCheckoutController, cancelCheckoutController } from "../controllers/checkout-controllers";
import { authenticateJWT } from "../middlewares/auth";
import { validateNoPendingOrder } from "../middlewares/validatePendingOrder";

const router = Router();

//? Crear reserva de stock para checkout (POST).
router.post("/reserve", authenticateJWT, validateNoPendingOrder, createStockReservationForCheckoutController);

//? Cancelar checkout y liberar reserva de stock (DELETE).
router.delete("/cancel", authenticateJWT, cancelCheckoutController);

//? Procesar checkout y crear orden (POST).
router.post("/", authenticateJWT, processCheckoutController);

export default router;