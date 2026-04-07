# 🛒 Tests del Módulo Carts - Especificación Completa

## 📋 **Contrato API del Módulo Carts**

### 🎯 **Endpoints Disponibles:**
- **POST /carts/add** - Agregar libro al carrito
- **GET /carts/** - Obtener carrito del usuario  
- **PUT /carts/:cartId** - Actualizar cantidad de item
- **DELETE /carts/:cartId** - Eliminar item específico
- **DELETE /carts/** - Vaciar todo el carrito

### 🔒 **Middleware Aplicado:**
- **authenticateJWT** - Todos los endpoints requieren autenticación (401 si falla)
- **validateNoPendingOrder** - Bloquea si hay órdenes PENDING (409 si existe)

---

## 🧪 **Tests Especificados por Endpoint**

### 📦 **POST /carts/add - Agregar Libro al Carrito**

#### ✅ **Casos Exitosos (200):**
1. **debe agregar libro al carrito exitosamente**
   - Request: `{ "bookId": string, "quantity": number }`
   - Response: `{ "success": true, "message": "Libro agregado al carrito exitosamente", "data": CartItemDto }`
   - Verificar: status 200, data tiene id, book, quantity

2. **debe agregar libro sin cantidad (usa defecto = 1)**
   - Request: `{ "bookId": string }`
   - Response: `{ "success": true, "data": { "quantity": 1 } }`

3. **debe acumular cantidad si libro ya existe en carrito**
   - Agregar el mismo libro dos veces y verificar que las cantidades se sumen en el mismo registro.

#### ❌ **Casos de Error (400, 401, 404, 409):**
4. **debe rechazar agregar sin autenticación (401)**
   - Response: `{ "success": false, "message": "No autorizado: se requiere un token de autenticación" }`

5. **debe rechazar agregar sin bookId (400)**
   - Response: `{ "success": false, "message": "Error de validación", "errors": ["bookId es requerido"] }`

6. **debe rechazar con cantidad inválida (400)**
   - Request con cantidad negativa o cero.
   - Response: `{ "success": false, "message": "Error de validación", "errors": ["La cantidad debe ser un número entero positivo"] }`

7. **debe rechazar con stock insuficiente (409)**
   - Response: `{ "success": false, "message": "Stock insuficiente para el libro solicitado" }`

8. **debe rechazar si existe orden pendiente (409)**
   - Middleware `validateNoPendingOrder` bloquea la acción.
   - Response: `{ "success": false, "message": "Tienes una orden pendiente en proceso" }`

---

### 📋 **GET /carts/ - Obtener Carrito del Usuario**

#### ✅ **Casos Exitosos (200):**
9. **debe obtener carrito con items**
   - Response: `{ "success": true, "data": { "items": [], "totalItems": number, "totalPrice": number } }`

10. **debe incluir información de orden pendiente si existe**
    - `data.pendingOrder` debe contener id, total y estado.

---

### ✏️ **PUT /carts/:cartId - Actualizar Cantidad**

#### ✅ **Casos Exitosos (200):**
11. **debe actualizar cantidad válida**
    - Request: `{ "quantity": number }`
    - Response: `{ "success": true, "message": "Item del carrito actualizado exitosamente", "data": CartItemDto }`

#### ❌ **Casos de Error (400, 404, 409):**
12. **debe rechazar actualizar con stock insuficiente (409)**
    - Response: `{ "success": false, "message": "Stock insuficiente para el libro solicitado" }`

---

### 🗑️ **DELETE /carts/:cartId - Eliminar Item Específico**

#### ✅ **Casos Exitosos (200):**
13. **debe eliminar item existente**
    - Response: `{ "success": true, "message": "Libro eliminado del carrito exitosamente", "data": { "id": cartId } }`

---

### 🧹 **DELETE /carts/ - Vaciar Carrito Completo**

#### ✅ **Casos Exitosos (200):**
14. **debe vaciar carrito con items**
    - Response: `{ "success": true, "message": "Carrito vaciado exitosamente", "data": { "count": number } }`

---

## 🎯 **Nota para Automatización**
Asegúrate de usar siempre la base `/carts/`. Todos los errores de validación de campos devuelven un arreglo `errors` dentro del cuerpo de la respuesta.
