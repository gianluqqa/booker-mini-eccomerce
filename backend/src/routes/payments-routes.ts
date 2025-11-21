import { Router } from "express";
import { createPayment } from "../controllers/payments-controller";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

// Ruta protegida que requiere autenticación
router.post("/create-payment", authenticateJWT, createPayment); //? Crear preferencia de pago. (Route: POST http://localhost:5000/payments/create-payment)

export default router;
