import { Request, Response } from "express";
import { createBookService, getBooksService, getBookByIdService, updateBookService, deleteBookService } from "../services/books-services";
import { validateBook, validateUpdateBook, validateDeleteBook } from "../middlewares/validateBook";
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

//? Obtener un Book por ID (GET).
export const getBookByIdController = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const book = await getBookByIdService(bookId);
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";
    res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Crear un nuevo Book (POST).
export const createBookController = async (req: Request, res: Response) => {
  try {
    // 🔹 Validar los campos del Book y el rol de admin.
    const errors = validateBook(req.body, req);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
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
        message: `El género '${genreName}' no es válido.`,
      });
    }

    // 🔹 Crear el Book.
    const book = await createBookService(req.body);

    return res.status(201).json({
      success: true,
      message: "Libro creado exitosamente",
      data: book,
    });
  } catch (error: any) {
    // 🔹 Detectar errores controlados del servicio.
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Actualizar un Book (PUT).
export const updateBookController = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    
    // 🔹 Validar los campos del Book y el rol de admin.
    const updateData = { ...req.body, id: bookId };
    const errors = validateUpdateBook(updateData, req);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors,
      });
    }

    const book = await updateBookService(updateData);
    res.status(200).json({
      success: true,
      message: "Libro actualizado exitosamente",
      data: book,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";
    res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Eliminar un Book (DELETE).
export const deleteBookController = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;

    // 🔹 Validar el rol de admin.
    const errors = validateDeleteBook(req);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors,
      });
    }

    await deleteBookService(bookId);
    res.status(200).json({
      success: true,
      message: "Libro eliminado exitosamente",
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";
    res.status(status).json({
      success: false,
      message,
    });
  }
};
