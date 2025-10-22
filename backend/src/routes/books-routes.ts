import { Router } from "express";
import { createBookController, getBooksController } from "../controllers/books-controller";

const booksRoutes = Router();

booksRoutes.get("/", getBooksController);
booksRoutes.post("/", createBookController);

export default booksRoutes;