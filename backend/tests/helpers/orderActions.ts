import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { Order } from "../../src/entities/Order";
import { OrderStatus } from "../../src/enums/OrderStatus";

/**
 * ACCIONES: Órdenes
 * ----------------
 */

export const cleanUserPendingOrders = async (userId: string) => {
  const orderRepository = AppDataSource.getRepository(Order);
  try {
    const result = await orderRepository.delete({
      user: { id: userId },
      status: OrderStatus.PENDING
    });
    // console.log(`\x1b[32m✅ Usuario ${userId} no tiene órdenes pendientes\x1b[0m`);
    return result;
  } catch (error) {
    console.error(`❌ Error limpiando órdenes pendientes para el usuario ${userId}:`, error);
    throw error;
  }
};

export const getUserOrders = async (app: any, token: string | null) => {
  const req = request(app).get("/orders");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const getUserPendingOrders = async (app: any, token: string | null) => {
  const req = request(app).get("/orders/pending");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const getOrderById = async (app: any, token: string | null, orderId: string) => {
  const req = request(app).get(`/orders/${orderId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const getAllOrdersAdmin = async (app: any, token: string | null) => {
  const req = request(app).get("/orders/admin/all");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const cancelOrderAdmin = async (app: any, token: string | null, orderId: string) => {
  const req = request(app).patch(`/orders/admin/${orderId}/cancel`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};
