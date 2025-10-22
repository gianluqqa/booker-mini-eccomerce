import { Router } from "express";
import { getBooksController } from "../controllers/books-controller";

const booksRoutes = Router();

booksRoutes.get("/", getBooksController);

export default booksRoutes;