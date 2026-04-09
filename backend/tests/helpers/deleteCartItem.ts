import request from "supertest";

/**
 * HELPER: deleteCartItem
 * ---------------------
 * Elimina un ítem específico del carrito mediante su cartId.
 * 
 * @param app Instancia de Express.
 * @param token Token del usuario.
 * @param cartId El UUID del item en el carrito.
 */
export const deleteCartItem = async (app: any, token: string | null, cartId: string) => {
  const req = request(app).delete(`/carts/${cartId}`);

  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  return await req.send();
};
