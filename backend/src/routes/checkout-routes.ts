import { Router } from "express";
import { processCheckoutController, createStockReservationForCheckoutController } from "../controllers/checkout-controllers";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

//? Crear reserva de stock para checkout (POST).
router.post("/reserve", authenticateJWT, createStockReservationForCheckoutController);

//? Procesar checkout y crear orden (POST).
router.post("/", authenticateJWT, processCheckoutController);

export default router;