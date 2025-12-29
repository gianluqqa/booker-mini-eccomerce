import { Router } from "express";
import { createPayment } from "../controllers/payments-controller";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

// Ruta protegida que requiere autenticación
router.post("/create-payment", authenticateJWT, createPayment); //? Crear preferencia de pago. (Route: POST http://localhost:5000/payments/create-payment)

export default router;

/*
========================================
POSTMAN EXAMPLES
========================================

URL: http://localhost:5000/payments/create-payment
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Body (JSON):
{
  "orderId": "uuid-de-la-orden",
  "paymentMethod": "mercadopago"
}

Response Expected:
{
  "success": true,
  "message": "Preferencia de pago creada exitosamente",
  "data": {
    "preferenceId": "pref-123456789",
    "initPoint": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=123456789",
    "sandboxInitPoint": "https://sandbox.mercadopago.com/checkout/v1/redirect?pref_id=123456789"
  }
}

Error Response (401):
{
  "success": false,
  "message": "No autorizado"
}

Error Response (400):
{
  "success": false,
  "message": "Datos de pago inválidos"
}

Error Response (500):
{
  "success": false,
  "message": "Error interno del servidor"
}

========================================
NOTES:
========================================
1. El JWT_TOKEN debe obtenerse del endpoint de login
2. El orderId debe ser un UUID válido de una orden existente
3. paymentMethod actualmente solo soporta "mercadopago"
4. La respuesta incluye URLs para redirigir al usuario a MercadoPago
*/
