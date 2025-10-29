import { Request, Response } from "express";
import { createBookService, getBooksService } from "../services/books-services";
import { validateBook } from "../routes/middlewares/validateBook";
import { AppDataSource } from "../config/data-source";
import { Genre } from "../entities/Genre";

//? Obtener todos los Books (GET).
export const getBooksController = async (req: Request, res: Response) => {
  try {
    const books = await getBooksService(req.query.q as string);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

//? Crear un nuevo Book (POST).
export const createBookController = async (req: Request, res: Response) => {
  try {
    // 🔹 Validar los campos del Book.
    const errors = validateBook(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    // 🔹 Validar que el género exista en la tabla Genre.
    const genreName = (req.body.genre as string).trim();
    const genreRepo = AppDataSource.getRepository(Genre);
    const genre = await genreRepo.findOne({ where: { name: genreName } });
    if (!genre) {
      return res.status(400).json({
        success: false,
        message: `Genre '${genreName}' is not valid.`,
      });
    }

    // 🔹 Crear el Book.
    const book = await createBookService(req.body);

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    // 🔹 Detectar errores controlados del servicio.
    const status = error.status || 500;
    const message = error.message || "Internal server error";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};
