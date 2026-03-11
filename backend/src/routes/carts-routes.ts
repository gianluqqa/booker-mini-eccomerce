import { Router } from "express";
import { addBookToCartController, getUserCartController, updateCartItemQuantityController, removeBookFromCartController, clearCartController } from "../controllers/carts-controllers";
import { authenticateJWT } from "../middlewares/auth";
import { validateNoPendingOrder, checkPendingOrderStatus } from "../middlewares/validatePendingOrder";

const cartRoutes = Router();

// Añadir libro al carrito
cartRoutes.post("/add", authenticateJWT, validateNoPendingOrder, addBookToCartController);

// Obtener carrito del usuario
cartRoutes.get("/", authenticateJWT, checkPendingOrderStatus, getUserCartController);

// Actualizar cantidad de un item del carrito
cartRoutes.put("/:cartId", authenticateJWT, validateNoPendingOrder, updateCartItemQuantityController);

// Eliminar un item del carrito
cartRoutes.delete("/:cartId", authenticateJWT, validateNoPendingOrder, removeBookFromCartController);

// Limpiar todo el carrito
cartRoutes.delete("/", authenticateJWT, validateNoPendingOrder, clearCartController);

export default cartRoutes;
