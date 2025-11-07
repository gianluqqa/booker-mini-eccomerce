import { Router } from "express";
import { createBookController, getBooksController, getBookByIdController, updateBookController, deleteBookController } from "../controllers/books-controller";
import { getAllGenresController } from "../controllers/genres-controller";

const booksRoutes = Router();

import { authenticateJWT, requireAdmin } from "../middlewares/auth";

booksRoutes.get("/", getBooksController);
booksRoutes.get("/genres", getAllGenresController);
booksRoutes.get("/:id", getBookByIdController);
booksRoutes.post("/", authenticateJWT, requireAdmin, createBookController);
booksRoutes.put("/:id", authenticateJWT, requireAdmin, updateBookController);
booksRoutes.delete("/:id", authenticateJWT, requireAdmin, deleteBookController);

export default booksRoutes;