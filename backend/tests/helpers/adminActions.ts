import request from "supertest";

// =======================
// ADMINISTRACIÓN: USUARIOS
// =======================

export const getAllUsersAdmin = async (app: any, token: string | null) => {
  const req = request(app).get("/users");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const getUserByIdAdmin = async (app: any, token: string | null, userId: string) => {
  const req = request(app).get(`/users/${userId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const deleteUserAdmin = async (app: any, token: string | null, userId: string) => {
  const req = request(app).delete(`/users/${userId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const deleteAllUsersAdmin = async (app: any, token: string | null) => {
  const req = request(app).delete("/users");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

// =======================
// ADMINISTRACIÓN: REVIEWS
// =======================

export const getAllReviewsAdmin = async (app: any, token: string | null) => {
  const req = request(app).get("/reviews/admin/all");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const deleteReviewAdmin = async (app: any, token: string | null, reviewId: string) => {
  const req = request(app).delete(`/reviews/admin/${reviewId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

// =======================
// ADMINISTRACIÓN: ÓRDENES
// =======================

// Nota: getAllOrdersAdmin y cancelOrderAdmin están en orderActions.ts por compatibilidad con tests anteriores, 
// pero agregaremos los métodos de "limpieza masiva" aquí.

export const clearAllOrdersAdmin = async (app: any, token: string | null) => {
  const req = request(app).delete("/orders/admin/clear-all");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const clearCancelledOrdersAdmin = async (app: any, token: string | null) => {
  const req = request(app).delete("/orders/admin/clear-cancelled");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

// =======================
// ADMINISTRACIÓN: LIBROS
// =======================

export const createBookAdmin = async (app: any, token: string | null, bookData: any) => {
  const req = request(app).post("/books");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send(bookData);
};

export const updateBookAdmin = async (app: any, token: string | null, bookId: string, bookData: any) => {
  const req = request(app).put(`/books/${bookId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send(bookData);
};

export const deleteBookAdmin = async (app: any, token: string | null, bookId: string) => {
  const req = request(app).delete(`/books/${bookId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};
