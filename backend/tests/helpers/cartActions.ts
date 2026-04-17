import request from "supertest";

/**
 * ACCIONES: Carrito
 * ----------------
 */

export const addToCart = async (app: any, token: string | null, payload: { bookId?: any; quantity?: any }) => {
  const req = request(app).post("/carts/add");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send(payload);
};

export const getCart = async (app: any, token: string | null) => {
  const req = request(app).get("/carts");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const updateCart = async (app: any, token: string | null, cartId: string, quantity: number) => {
  const req = request(app).put(`/carts/${cartId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send({ quantity });
};

export const deleteCartItem = async (app: any, token: string | null, cartId: string) => {
  const req = request(app).delete(`/carts/${cartId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const clearCart = async (app: any, token: string | null) => {
  const req = request(app).delete("/carts");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};
