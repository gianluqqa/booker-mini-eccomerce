import { Router } from "express";
import { createBookController, getBooksController, getBookByIdController, updateBookController, deleteBookController } from "../controllers/books-controllers";
import { getAllGenresController } from "../controllers/genres-controllers";

const booksRoutes = Router();

import { authenticateJWT, requireAdmin } from "../middlewares/auth";

booksRoutes.get("/", getBooksController); //? Obtener todos los libros.
booksRoutes.get("/genres", getAllGenresController); //? Obtener todos los géneros.
booksRoutes.get("/:id", getBookByIdController); //? Obtener un libro por ID.
booksRoutes.post("/", authenticateJWT, requireAdmin, createBookController); //? Crear un nuevo libro.
booksRoutes.put("/:id", authenticateJWT, requireAdmin, updateBookController); //? Actualizar un libro.
booksRoutes.delete("/:id", authenticateJWT, requireAdmin, deleteBookController); //? Eliminar un libro.

export default booksRoutes;