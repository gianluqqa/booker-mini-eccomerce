import request from "supertest";

/**
 * AYUDA: addToCart
 * -----------------
 * Sirve para simular que un usuario agrega un libro al carrito.
 * 
 * @param app Instancia de la aplicación (Express).
 * @param token Token de seguridad (Bearer). Pasar 'null' si quieres probar errores de login.
 * @param payload Objeto con { bookId: "id", quantity: 2 }. 
 *                Nota: quantity es opcional, el sistema usa 1 por defecto.
 */
export const addToCart = async (
  app: any,
  token: string | null,
  payload: { bookId?: any; quantity?: any }
) => {
  const req = request(app).post("/carts/add");

  // Si enviamos un token, lo ponemos en la cabecera (Header) de autorización
  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  // Enviamos los datos y devolvemos la respuesta para que el test la analice
  return await req.send(payload);
};
