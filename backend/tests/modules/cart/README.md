# 🛒 Tests del Módulo Carts - Plan de Automatización (50 Casos)

## 📋 **Reglas Globales del Contrato**
- **Éxito (200):** Siempre incluye `{ "success": true, "message"?: string, "data": { ... } }`.
- **Error (400, 401, 404, 409):** Siempre incluye `{ "success": false, "message": string }`.
- **Validación (400):** Incluye además un array `errors: string[]`.

---

## 🧪 **Escenarios Detallados**

### 📦 **POST /carts/add - Agregar al Carrito**
1. **debe agregar libro al carrito exitosamente**
   - Request: `{ "bookId": UUID, "quantity": 2 }`
   - Response: `200`, `{ "success": true, "message": "Libro agregado al carrito exitosamente", "data": { "id": UUID, "book": { ... }, "quantity": 2 } }`
2. **debe agregar libro sin cantidad (usa defecto = 1)**
   - Request: `{ "bookId": UUID }`
   - Response: `200`, `{ "success": true, "data": { "quantity": 1 } }`
3. **debe acumular cantidad si libro ya existe en carrito**
   - Acción: POST q=1 -> POST q=2.
   - Response: `200`, `{ "success": true, "data": { "quantity": 3 } }`
4. **debe rechazar agregar sin autenticación (401)**
   - Response: `401`, `{ "success": false, "message": "No autorizado: se requiere un token de autenticación" }`
5. **debe rechazar agregar con token inválido**
   - Response: `401`, `{ "success": false, "message": "No autorizado: token inválido o expirado" }`
6. **debe rechazar si falta el bookId**
   - Response: `400`, `{ "success": false, "message": "Error de validación", "errors": ["bookId es requerido"] }`
7. **debe rechazar si el bookId no es un UUID válido**
   - Response: `400`, `{ "success": false, "message": "Error de validación", "errors": ["bookId debe ser un UUID válido"] }`
8. **debe rechazar si el libro no existe en la base de datos**
   - Response: `404`, `{ "success": false, "message": "Libro no encontrado" }`
9. **debe rechazar si la cantidad es menor a 1**
   - Response: `400`, `{ "success": false, "message": "Error de validación", "errors": ["La cantidad debe ser un número entero positivo"] }`
10. **debe rechazar si la cantidad no es un número entero**
    - Response: `400`, `{ "success": false, "message": "Error de validación", "errors": ["La cantidad debe ser un número entero positivo"] }`
11. **debe rechazar si la cantidad supera el stock disponible**
    - Response: `409`, `{ "success": false, "message": "Stock insuficiente para el libro solicitado" }`
12. **debe rechazar si el usuario tiene una orden pendiente**
    - Response: `409`, `{ "success": false, "message": "Tienes una orden pendiente en proceso" }`
13. **debe permitir agregar un libro que tiene stock exacto disponible**
    - Request: `quantity` igual al stock. Response: `200`.
14. **debe devolver la estructura del libro completa dentro del data**
    - Verificar: `data.book` tiene `id`, `title`, `price`.
15. **debe generar un ID único para el item del carrito**
    - Verificar: `data.id` es un UUID válido.

### 📋 **GET /carts/ - Obtener Carrito**
16. **debe retornar un carrito vacío para usuarios sin items**
    - Response: `200`, `{ "success": true, "data": { "items": [] } }`
17. **debe listar todos los items agregados previamente**
    - Response: `200`, `{ "success": true, "data": { "items": [ ... ] } }`
18. **debe calcular correctamente el total de items en el carrito**
    - Verificar: Suma de cantidades en el frontend o si el backend provee `itemsCount`.
19. **debe incluir la sección pendingOrder si existe una orden activa**
    - Verificar: `data.pendingOrder` no es nulo y tiene `id`, `total`.
20. **debe retornar 401 si no se envía token**
    - Response: `401`, `{ "success": false }`
21. **debe persistir los items tras múltiples llamadas al GET**
    - Verificar: Los datos no cambian entre llamadas.
22. **debe reflejar cambios inmediatos tras un ADD exitoso**
    - Acción: POST -> GET. Verificar el nuevo item.
23. **debe ordenar los items por fecha de creación (opcional según implementación)**

### ✏️ **PUT /carts/:cartId - Actualizar Cantidad**
24. **debe incrementar la cantidad exitosamente**
    - Request: `{ "quantity": 5 }`. Response: `200`.
25. **debe decrementar la cantidad exitosamente**
    - Request: `{ "quantity": 1 }`. Response: `200`.
26. **debe rechazar si el cartId es inválido**
    - Response: `400`, `{ "success": false, "message": "cartId debe ser un UUID válido" }`
27. **debe rechazar si el item no existe o no pertenece al usuario**
    - Response: `404`, `{ "success": false, "message": "Item del carrito no encontrado" }`
28. **debe rechazar si la nueva cantidad supera el stock**
    - Response: `409`, `{ "success": false, "message": "Stock insuficiente para el libro solicitado" }`
29. **debe rechazar si la cantidad es 0 o negativa**
    - Response: `400`, `{ "success": false, "message": "Error de validación" }`
30. **debe rechazar si hay una orden pendiente**
    - Response: `409`, `{ "success": false, "message": "Tienes una orden pendiente en proceso" }`
31. **debe confirmar la actualización con un mensaje de éxito**
    - Response: `200`, `{ "message": "Item del carrito actualizado exitosamente" }`
32. **debe actualizar el precio total del item en la respuesta**
    - Verificar estructura de `data` devuelta.
33. **debe retornar 401 si no hay autenticación**

### 🗑️ **DELETE /carts/:cartId - Eliminar Item**
34. **debe eliminar un item específico exitosamente**
    - Response: `200`, `{ "success": true, "message": "Libro eliminado del carrito exitosamente" }`
35. **debe retornar el ID del item eliminado en el data**
    - Response: `200`, `{ "data": { "id": UUID } }`
36. **debe rechazar si el item no existe**
    - Response: `404`, `{ "success": false, "message": "Item del carrito no encontrado" }`
37. **debe rechazar si no pertenece al usuario autenticado**
    - Response: `404`.
38. **debe rechazar si hay una orden pendiente**
    - Response: `409`, `{ "success": false }`

### 🧹 **DELETE /carts/ - Vaciar Carrito**
39. **debe eliminar todos los items del carrito satisfactoriamente**
    - Response: `200`, `{ "success": true, "message": "Carrito vaciado exitosamente" }`
40. **debe informar la cantidad de items eliminados**
    - Response: `200`, `{ "data": { "count": X } }`
41. **debe funcionar correctamente incluso si el carrito ya está vacío**
    - Response: `200`, `{ "data": { "count": 0 } }`
42. **debe rechazar si hay una orden pendiente**
    - Response: `409`.
43. **debe dejar el carrito en un estado que el GET devuelva una lista vacía**

### 🔄 **Escenarios Cruzados y Lógica de Negocio**
44. **debe mantener el carrito separado entre distintos usuarios (Aislamiento)**
    - El User A no debe ver ni poder borrar items del User B.
45. **debe validar stock dinámicamente si el stock del libro cambia externamente**
    - Si el stock baja a 5 y el carrito tiene 8, el GET o UPDATE debe mostrar el conflicto.
46. **debe manejar correctamente cambios de precio en el catálogo**
    - El carrito debe mostrar el precio actual del libro, no el de cuando se agregó.
47. **debe persistir el carrito tras un cierre de sesión y nuevo login**
48. **debe rechazar cualquier modificación (ADD, PUT, DELETE) si hay orden pendiente**
    - Prueba transversal de los 3 métodos con 409.
49. **debe permitir re-agregar un libro después de haber vaciado el carrito**
50. **debe garantizar que el total del carrito sea la suma de subtotales válida**

---

## 🎯 **Nota de Automatización**
Cada uno de estos casos debe ser implementado en la suite de `cart.test.ts`. Para los casos de error 400, el test debe verificar el contenido del array `errors`.
