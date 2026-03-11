import { Router } from "express";
import { createBookController, getBooksController, getBookByIdController, updateBookController, deleteBookController } from "../controllers/books-controllers";
import { getAllGenresController } from "../controllers/genres-controllers";
import { authenticateJWT, requireAdmin } from "../middlewares/auth";

const booksRoutes = Router();

// Obtener todos los libros
booksRoutes.get("/", getBooksController); 

// Obtener todos los géneros
booksRoutes.get("/genres", getAllGenresController);

// Obtener un libro por ID
booksRoutes.get("/:id", getBookByIdController); 

// Crear un nuevo libro (requiere admin)
booksRoutes.post("/", authenticateJWT, requireAdmin, createBookController);

// Actualizar un libro (requiere admin)
booksRoutes.put("/:id", authenticateJWT, requireAdmin, updateBookController);

// Eliminar un libro (requiere admin)
booksRoutes.delete("/:id", authenticateJWT, requireAdmin, deleteBookController);

export default booksRoutes;