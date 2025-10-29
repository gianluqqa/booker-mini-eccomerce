import { Router } from "express";
import { createBookController, getBooksController } from "../controllers/books-controller";
import { getAllGenresController } from "../controllers/genres-controller";

const booksRoutes = Router();

booksRoutes.get("/", getBooksController);
booksRoutes.post("/", createBookController);
booksRoutes.get("/genres", getAllGenresController);

export default booksRoutes;