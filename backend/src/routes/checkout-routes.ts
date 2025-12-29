import { Router } from "express";
import { 
  processCheckoutController, 
  createStockReservationForCheckoutController,
  checkExistingReservationController 
} from "../controllers/checkout-controllers";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

//? Verificar si existe reserva activa (GET).
router.get("/reservation/check", authenticateJWT, checkExistingReservationController); // (Route: GET http://localhost:5000/checkout/reservation/check)

//? Crear reserva de stock para checkout (POST).
router.post("/reserve", authenticateJWT, createStockReservationForCheckoutController); // (Route: POST http://localhost:5000/checkout/reserve)

//? Procesar checkout y crear orden (POST).
router.post("/", authenticateJWT, processCheckoutController); // (Route: POST http://localhost:5000/checkout/)

export default router;

/*
========================================
POSTMAN EXAMPLES
========================================

1. VERIFICAR RESERVA ACTIVA
URL: http://localhost:5000/checkout/reservation/check
Method: GET
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Response Expected (200):
{
  "success": true,
  "message": "Reserva activa encontrada",
  "data": {
    "reservationId": "uuid-reserva",
    "items": [
      {
        "bookId": "uuid-libro",
        "title": "Título del libro",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "totalAmount": 59.98,
    "expiresAt": "2024-01-01T12:30:00.000Z",
    "totalMinutes": 10,
    "message": "Reserva activa"
  }
}

Response Expected (404):
{
  "success": false,
  "message": "No hay reserva activa"
}

========================================

2. CREAR RESERVA DE STOCK
URL: http://localhost:5000/checkout/reserve
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Body: No body required (usa el carrito del usuario)

Response Expected (201):
{
  "success": true,
  "message": "Reserva de stock creada exitosamente",
  "data": {
    "reservationId": "uuid-reserva",
    "items": [
      {
        "bookId": "uuid-libro",
        "title": "Título del libro",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "totalAmount": 59.98,
    "expiresAt": "2024-01-01T12:30:00.000Z",
    "totalMinutes": 10,
    "message": "Reserva activa"
  }
}

========================================

3. PROCESAR CHECKOUT
URL: http://localhost:5000/checkout/
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Body: No body required (usa el carrito y la reserva del usuario)

Response Expected (201):
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "id": "uuid-orden",
    "total": 59.98,
    "status": "PENDING",
    "createdAt": "2024-01-01T12:25:00.000Z",
    "items": [
      {
        "id": "uuid-item",
        "book": {
          "id": "uuid-libro",
          "title": "Título del libro",
          "author": "Autor",
          "price": 29.99
        },
        "quantity": 2,
        "price": 29.99,
        "unitPrice": 29.99,
        "totalPrice": 59.98
      }
    ]
  }
}

Error Response (400):
{
  "success": false,
  "message": "El carrito está vacío"
}

Error Response (400):
{
  "success": false,
  "message": "No hay reserva activa"
}

========================================
NOTES:
========================================
1. Todas las rutas requieren autenticación JWT
2. La reserva dura 10 minutos desde su creación
3. El checkout consume la reserva y convierte el carrito en orden
4. Los precios se calculan automáticamente del carrito
5. El stock se descuenta al procesar el checkout
*/