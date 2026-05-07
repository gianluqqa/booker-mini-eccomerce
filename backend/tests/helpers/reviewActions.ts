import request from "supertest";
import { Express } from "express";

export const getAllReviews = async (app: Express) => {
  return await request(app).get("/reviews");
};

export const createReview = async (app: Express, token: string | null, reviewData: any) => {
  const req = request(app).post("/reviews");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send(reviewData);
};

export const getReviewsByBook = async (app: Express, bookId: string) => {
  return await request(app).get(`/reviews/book/${bookId}`);
};

export const getUserReviews = async (app: Express, token: string | null) => {
  const req = request(app).get("/reviews/user");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const updateReview = async (app: Express, token: string | null, reviewId: string, updateData: any) => {
  const req = request(app).put(`/reviews/${reviewId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send(updateData);
};

export const deleteReview = async (app: Express, token: string | null, reviewId: string) => {
  const req = request(app).delete(`/reviews/${reviewId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};

export const getAllReviewsAdmin = async (app: Express, token: string | null, params: any = {}) => {
  const req = request(app).get("/reviews/admin/all");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.query(params).send();
};

export const deleteReviewAdmin = async (app: Express, token: string | null, reviewId: string) => {
  const req = request(app).delete(`/reviews/admin/${reviewId}`);
  if (token) req.set("Authorization", `Bearer ${token}`);
  return await req.send();
};
