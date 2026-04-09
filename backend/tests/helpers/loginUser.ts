import request from "supertest";

/**
 * HELPER: loginUser
 * ----------------
 * Realiza el login de un usuario y devuelve la respuesta.
 * 
 * @param app Instancia de Express.
 * @param credentials Objeto con email y password (opcional, usa default).
 */
export const loginUser = async (app: any, credentials: { email: string; password?: string }) => {
  return await request(app)
    .post("/users/login")
    .send({
      email: credentials.email,
      password: credentials.password || "Password123!"
    });
};
