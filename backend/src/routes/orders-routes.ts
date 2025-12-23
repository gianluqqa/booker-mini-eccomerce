// src/routes/order-routes.ts
import { Router } from "express";
import { getOrderByIdController, getUserOrdersController, getUserPendingOrdersController } from "../controllers/orders-controllers";
import { authenticateJWT } from "../middlewares/auth";

const orderRoutes = Router();

//? Obtener todas las órdenes confirmadas del usuario
orderRoutes.get("/", authenticateJWT, getUserOrdersController);

//? Obtener todas las órdenes pendientes del usuario
orderRoutes.get("/pending", authenticateJWT, getUserPendingOrdersController);

//? Obtener los detalles de una orden por ID
orderRoutes.get("/:id", authenticateJWT, getOrderByIdController);

export default orderRoutes;