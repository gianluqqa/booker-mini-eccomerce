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
cartRoutes.post("/add", authenticateJWT, addBookToCartController); //? Añadir libro al carrito
cartRoutes.get("/", authenticateJWT, getUserCartController); //? Obtener carrito del usuario
cartRoutes.put("/:cartId", authenticateJWT, updateCartItemQuantityController); //? Actualizar cantidad de un item
cartRoutes.delete("/:cartId", authenticateJWT, removeBookFromCartController); //? Eliminar un item del carrito
cartRoutes.delete("/", authenticateJWT, clearCartController); //? Limpiar todo el carrito

export default cartRoutes;
