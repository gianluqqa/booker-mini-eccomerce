import { Router } from "express";
import {
  addBookToCartController,
  getUserCartController,
  updateCartItemQuantityController,
  removeBookFromCartController,
  clearCartController,
} from "../controllers/carts-controllers";
import { authenticateJWT } from "../middlewares/auth";

const cartRoutes = Router();

// Todas las rutas requieren autenticación
cartRoutes.post("/add", authenticateJWT, addBookToCartController); //? Añadir libro al carrito (Route: POST http://localhost:5000/carts/add)
cartRoutes.get("/", authenticateJWT, getUserCartController); //? Obtener carrito del usuario (Route: GET http://localhost:5000/carts/)
cartRoutes.put("/:cartId", authenticateJWT, updateCartItemQuantityController); //? Actualizar cantidad de un item (Route: PUT http://localhost:5000/carts/:cartId)
cartRoutes.delete("/:cartId", authenticateJWT, removeBookFromCartController); //? Eliminar un item del carrito (Route: DELETE http://localhost:5000/carts/:cartId)
cartRoutes.delete("/", authenticateJWT, clearCartController); //? Limpiar todo el carrito (Route: DELETE http://localhost:5000/carts/)

export default cartRoutes;

/*
========================================
POSTMAN EXAMPLES
========================================

1. AÑADIR LIBRO AL CARRITO
URL: http://localhost:5000/carts/add
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Body (JSON):
{
  "bookId": "uuid-libro",
  "quantity": 2
}

Response Expected (201):
{
  "success": true,
  "message": "Libro añadido al carrito exitosamente",
  "data": {
    "id": "uuid-cart-item",
    "book": {
      "id": "uuid-libro",
      "title": "Título del libro",
      "author": "Autor",
      "price": 29.99,
      "stock": 10
    },
    "quantity": 2,
    "price": 59.98
  }
}

Error Response (400):
{
  "success": false,
  "message": "Stock insuficiente para el libro: Título del libro"
}

========================================

2. OBTENER CARRITO DEL USUARIO
URL: http://localhost:5000/carts/
Method: GET
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Response Expected (200):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid-cart-item",
        "book": {
          "id": "uuid-libro",
          "title": "Título del libro",
          "author": "Autor",
          "price": 29.99,
          "stock": 8
        },
        "quantity": 2,
        "price": 59.98
      },
      {
        "id": "uuid-cart-item-2",
        "book": {
          "id": "uuid-libro-2",
          "title": "Otro libro",
          "author": "Otro autor",
          "price": 19.99,
          "stock": 15
        },
        "quantity": 1,
        "price": 19.99
      }
    ],
    "total": 79.97
  }
}

Response Expected (200):
{
  "success": true,
  "data": {
    "items": [],
    "total": 0
  }
}

========================================

3. ACTUALIZAR CANTIDAD DE ITEM
URL: http://localhost:5000/carts/uuid-cart-item
Method: PUT
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Body (JSON):
{
  "quantity": 3
}

Response Expected (200):
{
  "success": true,
  "message": "Cantidad actualizada exitosamente",
  "data": {
    "id": "uuid-cart-item",
    "book": {
      "id": "uuid-libro",
      "title": "Título del libro",
      "author": "Autor",
      "price": 29.99,
      "stock": 10
    },
    "quantity": 3,
    "price": 89.97
  }
}

Error Response (400):
{
  "success": false,
  "message": "Stock insuficiente para el libro: Título del libro"
}

Error Response (400):
{
  "success": false,
  "message": "La cantidad debe ser al menos 1"
}

========================================

4. ELIMINAR ITEM DEL CARRITO
URL: http://localhost:5000/carts/uuid-cart-item
Method: DELETE
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Response Expected (200):
{
  "success": true,
  "message": "Item eliminado del carrito exitosamente"
}

Error Response (404):
{
  "success": false,
  "message": "Item no encontrado en el carrito"
}

========================================

5. LIMPIAR TODO EL CARRITO
URL: http://localhost:5000/carts/
Method: DELETE
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Response Expected (200):
{
  "success": true,
  "message": "Carrito limpiado exitosamente"
}

========================================

NOTES:
========================================
1. Todas las rutas requieren autenticación JWT
2. El bookId debe ser un UUID válido de un libro existente
3. El stock se valida antes de agregar o actualizar items
4. El precio se calcula automáticamente (precio_unitario * cantidad)
5. El carrito está asociado al usuario autenticado
6. Si el stock es 0, el libro no se puede agregar al carrito
*/
