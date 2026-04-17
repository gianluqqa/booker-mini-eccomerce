import request from "supertest";

/**
 * ACCIONES: Checkout
 * -----------------
 * Funciones para interactuar con los endpoints de checkout.
 */

export const reserveStock = async (app: any, token: string | null) => {
  const req = request(app).post("/checkout/reserve");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send({});
};

export const cancelCheckout = async (app: any, token: string | null) => {
  const req = request(app).delete("/checkout/cancel");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send({});
};

export const processCheckout = async (app: any, token: string | null, paymentData?: any) => {
  const req = request(app).post("/checkout");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send(paymentData || {});
};

export const payOrder = async (app: any, token: string | null, paymentData: any) => {
  const req = request(app).post("/checkout/pay");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send(paymentData);
};
