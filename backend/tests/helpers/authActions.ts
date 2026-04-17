import request from "supertest";

/**
 * ACCIONES: Autenticación
 * ----------------------
 */

export const loginUser = async (app: any, credentials: { email: string; password?: string }) => {
  return await request(app)
    .post("/users/login")
    .send({
      email: credentials.email,
      password: credentials.password || "Password123!"
    });
};
