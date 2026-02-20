// src/routes/order-routes.ts
import { Router } from "express";
import { getOrderByIdController, getUserOrdersController, getUserPendingOrdersController, getAllOrdersController, cancelPaidOrderController, clearAllOrdersController, clearCancelledOrdersController } from "../controllers/orders-controllers";
import { authenticateJWT, requireAdmin } from "../middlewares/auth";

const orderRoutes = Router();

//? Obtener todas las órdenes confirmadas del usuario
orderRoutes.get("/", authenticateJWT, getUserOrdersController);

//? Obtener todas las órdenes pendientes del usuario
orderRoutes.get("/pending", authenticateJWT, getUserPendingOrdersController);

//? Obtener los detalles de una orden por ID
orderRoutes.get("/:id", authenticateJWT, getOrderByIdController);

//? Obtener todas las órdenes de todos los usuarios (solo administradores)
orderRoutes.get("/admin/all", authenticateJWT, requireAdmin, getAllOrdersController);

//? Cancelar una orden pagada (solo administradores)
orderRoutes.patch("/admin/:id/cancel", authenticateJWT, requireAdmin, cancelPaidOrderController);

//? Limpiar todas las órdenes de la base de datos (solo administradores)
orderRoutes.delete("/admin/clear-all", authenticateJWT, requireAdmin, clearAllOrdersController);

//? Limpiar todas las órdenes canceladas de la base de datos (solo administradores)
orderRoutes.delete("/admin/clear-cancelled", authenticateJWT, requireAdmin, clearCancelledOrdersController);

export default orderRoutes;