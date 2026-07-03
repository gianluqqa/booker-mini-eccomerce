# Checkout Module - Plan de Tests (18 Casos)

## Reglas Globales del Contrato
- **Éxito (200, 201):** `{ "success": true, "message": string, "data": { ... } }`
- **Error (400, 401, 409):** `{ "success": false, "message": string }`
- **Validación (400):** Incluye array `errors: string[]`

---

## Escenarios Detallados

### Reserva de Stock (POST /checkout/reserve)
1. **debe crear reserva de stock exitosamente**
   - Setup: Agregar libro al carrito
   - Request: `{}`
   - Response: `201`, `{ "success": true, "message": "Reserva de stock creada exitosamente", "data": { "id": UUID, "expiresAt": Date } }`
2. **debe fallar si usuario no está autenticado**
   - Setup: Sin JWT
   - Request: `{}`
   - Response: `401`, `{ "success": false, "message": "No autorizado" }`
3. **debe fallar si ya existe orden pendiente**
   - Setup: Crear reserva previa
   - Request: `{}`
   - Response: `409`, `{ "success": false, "message": "Ya existe una orden pendiente" }`
4. **debe fallar si carrito está vacío**
   - Setup: Sin items en carrito
   - Request: `{}`
   - Response: `400`, `{ "success": false, "message": "El carrito está vacío" }`
5. **debe fallar si no hay stock suficiente**
   - Setup: Agregar más cantidad que stock disponible
   - Request: `{}`
   - Response: `400`, `{ "success": false, "message": "Stock insuficiente" }`

### Procesamiento de Checkout (POST /checkout/)
6. **debe crear orden pendiente sin pago**
   - Setup: Agregar al carrito + reservar stock
   - Request: `{}`
   - Response: `201`, `{ "success": true, "message": "Orden pendiente creada exitosamente", "data": { "status": "PENDING" } }`
7. **debe procesar pago exitosamente**
   - Setup: Agregar al carrito + reservar stock
   - Request: `{ "cardNumber": "4111111111111111", "cardName": "Test User", "expiryDate": "12/30", "cvv": "123" }`
   - Response: `201`, `{ "success": true, "message": "Pago procesado exitosamente", "data": { "status": "PAID" } }`
8. **debe fallar con datos de pago inválidos**
   - Setup: Agregar al carrito + reservar stock
   - Request: `{ "cardNumber": "invalid", "expiryDate": "invalid" }`
   - Response: `400`, `{ "success": false, "message": "Datos de pago inválidos" }`
9. **debe fallar si no hay reserva activa**
   - Setup: Sin reserva previa
   - Request: `{ "cardNumber": "4111111111111111", "cardName": "Test User", "expiryDate": "12/30", "cvv": "123" }`
   - Response: `400`, `{ "success": false, "message": "No hay una reserva activa" }`

### Procesamiento de Pago (POST /checkout/pay)
10. **debe procesar pago de orden pendiente existente**
    - Setup: Crear orden PENDING previamente
    - Request: `{ "cardNumber": "4111111111111111", "cardName": "Test User", "expiryDate": "12/30", "cvv": "123" }`
    - Response: `201`, `{ "success": true, "message": "Pago procesado exitosamente", "data": { "status": "PAID" } }`
11. **debe fallar si no hay orden pendiente**
    - Setup: Sin orden PENDING
    - Request: `{ "cardNumber": "4111111111111111", "cardName": "Test User", "expiryDate": "12/30", "cvv": "123" }`
    - Response: `400`, `{ "success": false, "message": "No hay una orden pendiente" }`

### Cancelación de Checkout (DELETE /checkout/cancel)
12. **debe cancelar checkout y liberar stock**
    - Setup: Agregar al carrito + reservar stock
    - Request: `{}`
    - Response: `200`, `{ "success": true, "message": "Orden cancelada y stock devuelto exitosamente", "data": { "orderId": UUID, "reservationId": UUID } }`
13. **debe fallar si no hay checkout activo**
    - Setup: Sin checkout activo
    - Request: `{}`
    - Response: `400`, `{ "success": false, "message": "No hay un checkout activo" }`
14. **debe fallar si usuario no está autenticado**
    - Setup: Sin JWT
    - Request: `{}`
    - Response: `401`, `{ "success": false, "message": "No autorizado" }`

### Integración y Edge Cases
15. **debe manejar reserva expirada**
    - Setup: Crear reserva + simular expiración
    - Request: `{}`
    - Response: `400`, `{ "success": false, "message": "La reserva ha expirado" }`
16. **debe manejar concurrencia de reservas**
    - Setup: Simular múltiples usuarios reservando mismo stock
    - Request: Operaciones concurrentes
    - Response: Manejo correcto de concurrencia
17. **debe calcular total correctamente con múltiples items**
    - Setup: Agregar múltiples libros con diferentes precios
    - Request: `{}`
    - Response: `201`, `{ "success": true, "data": { "totalAmount": 79.97 } }`
18. **debe actualizar stock después de pago exitoso**
    - Setup: Proceso completo de compra
    - Request: `{ "cardNumber": "4111111111111111", "cardName": "Test User", "expiryDate": "12/30", "cvv": "123" }`
    - Response: `201`, `{ "success": true, "data": { "status": "PAID" } }`
    - Verify: Stock actualizado en BD

---

## Nota de Automatización
Cada caso debe ser implementado en `checkout.test.ts`. Los tests deben verificar tanto el status code como la estructura completa de la respuesta.
