import request from "supertest";

/**
 * AYUDA: updateCart
 * -----------------
 * Sirve para actualizar la cantidad de un item que ya está en el carrito.
 * 
 * @param app Instancia de Express.
 * @param token Token del usuario.
 * @param cartId El UUID del item en el carrito (lo obtienes al agregarlo).
 * @param quantity La nueva cantidad total (ej: 5).
 */
export const updateCart = async (
  app: any,
  token: string | null,
  cartId: string,
  quantity: any
) => {
  const req = request(app).put(`/carts/${cartId}`);

  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  return await req.send({ quantity });
};
