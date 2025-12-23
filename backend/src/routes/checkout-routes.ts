import { Router } from "express";
import { processCheckoutController } from "../controllers/checkout-controllers";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

//? Procesar checkout y crear orden (POST).
router.post("/", authenticateJWT, processCheckoutController);

export default router;