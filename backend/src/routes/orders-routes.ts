// src/routes/order-routes.ts
import { Router } from "express";
import { createOrder, getOrderById } from "../controllers/orders-controllers";
import { authenticateJWT } from "../middlewares/auth";

const orderRoutes = Router();

// Ruta para crear una nueva orden
orderRoutes.post("/", authenticateJWT, createOrder);

// Ruta para obtener los detalles de una orden por ID
orderRoutes.get("/:id", authenticateJWT, getOrderById);

export default orderRoutes;