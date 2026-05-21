import request from "supertest";
import { Express } from "express";

/**
 * ACCIONES: Favoritos
 * -------------------
 */

export const toggleFavorite = async (app: Express, token: string | null, userId: string, bookId: string) => {
  const req = request(app).post(`/users/${userId}/favorites/${bookId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const getUserFavorites = async (app: Express, token: string | null, userId: string) => {
  const req = request(app).get(`/users/${userId}/favorites`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};
