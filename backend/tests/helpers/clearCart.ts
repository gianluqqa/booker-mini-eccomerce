import request from "supertest";

/**
 * HELPER: clearCart
 * ----------------
 * Vacía completamente el carrito del usuario.
 * 
 * @param app Instancia de Express.
 * @param token Token del usuario.
 */
export const clearCart = async (app: any, token: string | null) => {
  const req = request(app).delete("/carts");

  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  return await req.send();
};
