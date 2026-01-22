import { Router } from "express";
import {
  addBookToCartController,
  getUserCartController,
  updateCartItemQuantityController,
  removeBookFromCartController,
  clearCartController,
} from "../controllers/carts-controllers";
import { authenticateJWT } from "../middlewares/auth";
import { validateNoPendingOrder, checkPendingOrderStatus } from "../middlewares/validatePendingOrder";

const cartRoutes = Router();

// Todas las rutas requieren autenticación
cartRoutes.post("/add", authenticateJWT, validateNoPendingOrder, addBookToCartController); //? Añadir libro al carrito
cartRoutes.get("/", authenticateJWT, checkPendingOrderStatus, getUserCartController); //? Obtener carrito del usuario
cartRoutes.put("/:cartId", authenticateJWT, validateNoPendingOrder, updateCartItemQuantityController); //? Actualizar cantidad de un item
cartRoutes.delete("/:cartId", authenticateJWT, validateNoPendingOrder, removeBookFromCartController); //? Eliminar un item del carrito
cartRoutes.delete("/", authenticateJWT, validateNoPendingOrder, clearCartController); //? Limpiar todo el carrito

export default cartRoutes;
