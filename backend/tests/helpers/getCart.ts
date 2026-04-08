import request from "supertest";

/**
 * AYUDA: getCart
 * ----------------
 * Sirve para consultar el contenido actual del carrito de un usuario.
 * 
 * @param app Instancia de la aplicación (Express).
 * @param token Token de seguridad del usuario.
 */
export const getCart = async (
  app: any,
  token: string | null
) => {
  const req = request(app).get("/carts");

  // Si hay token, lo agregamos para que el servidor sepa quién está pidiendo el carrito
  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  // Devolvemos la respuesta (status codes, body, etc)
  return await req;
};
