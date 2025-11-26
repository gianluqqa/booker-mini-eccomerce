// src/routes/order-routes.ts
import { Router } from "express";
import { createOrderController, getOrderByIdController, getUserOrdersController, getUserPendingOrdersController } from "../controllers/orders-controllers";
import { authenticateJWT } from "../middlewares/auth";

const orderRoutes = Router();

// Ruta para crear una nueva orden
orderRoutes.post("/", authenticateJWT, createOrderController);

// Ruta para obtener todas las órdenes confirmadas del usuario
orderRoutes.get("/", authenticateJWT, getUserOrdersController);

// Ruta para obtener todas las órdenes pendientes del usuario
orderRoutes.get("/pending", authenticateJWT, getUserPendingOrdersController);

// Ruta para obtener los detalles de una orden por ID
orderRoutes.get("/:id", authenticateJWT, getOrderByIdController);

export default orderRoutes;