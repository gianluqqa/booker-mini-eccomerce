import { Request } from "express";
import { CreateBookDto, UpdateBookDto } from "../dto/BookDto";
import { UserRole } from "../enums/UserRole";

export const validateBook = (book: CreateBookDto, req: Request) => {
  const errors: string[] = [];

  // Validar que el usuario sea admin
  const authUser = (req as any).authUser as { id: string; role: UserRole } | undefined;
  if (!authUser || authUser.role !== UserRole.ADMIN) {
    errors.push("Solo los usuarios administradores pueden crear libros.");
  }

  // Title
  if (!book.title || typeof book.title !== "string" || book.title.trim().length < 2) {
    errors.push("El título es requerido y debe contener al menos 2 caracteres.");
  }

  // Author
  if (!book.author || typeof book.author !== "string" || book.author.trim().length < 2) {
    errors.push("El autor es requerido y debe contener al menos 2 caracteres.");
  }

  // Price
  if (book.price === undefined || typeof book.price !== "number" || book.price <= 0) {
    errors.push("El precio es requerido y debe ser un número mayor que 0.");
  }

  // Stock
  if (book.stock === undefined || typeof book.stock !== "number" || book.stock < 0) {
    errors.push("El stock es requerido y no puede ser negativo.");
  }

  // Image (optional)
  if (book.image && typeof book.image !== "string") {
    errors.push("La imagen debe ser una URL válida.");
  }

  // Genre (required)
  if (!book.genre || typeof book.genre !== "string" || book.genre.trim().length < 2) {
    errors.push("El género es requerido y debe contener al menos 2 caracteres.");
  }

  // Intro (optional)
  if (book.intro !== undefined && typeof book.intro !== "string") {
    errors.push("La introducción debe ser una cadena de texto si se proporciona.");
  }

  // Description (required)
  if (!book.description || typeof book.description !== "string" || book.description.trim().length < 10) {
    errors.push("La descripción es requerida y debe contener al menos 10 caracteres.");
  }

  return errors;
};

export const validateUpdateBook = (book: UpdateBookDto, req: Request) => {
  const errors: string[] = [];

  // Validar que el usuario sea admin
  const authUser = (req as any).authUser as { id: string; role: UserRole } | undefined;
  if (!authUser || authUser.role !== UserRole.ADMIN) {
    errors.push("Solo los usuarios administradores pueden actualizar libros.");
  }

  // Title
  if (book.title && (typeof book.title !== "string" || book.title.trim().length < 2)) {
    errors.push("El título debe contener al menos 2 caracteres.");
  }

  // Author
  if (book.author && (typeof book.author !== "string" || book.author.trim().length < 2)) {
    errors.push("El autor debe contener al menos 2 caracteres.");
  }

  // Price
  if (book.price !== undefined && (typeof book.price !== "number" || book.price <= 0)) {
    errors.push("El precio debe ser un número mayor que 0.");
  }

  // Stock
  if (book.stock !== undefined && (typeof book.stock !== "number" || book.stock < 0)) {
    errors.push("El stock debe ser un número mayor o igual a 0.");
  }

  // Image (optional)
  if (book.image && typeof book.image !== "string") {
    errors.push("La imagen debe ser una URL válida.");
  }

  // Genre (required)
  if (book.genre && (typeof book.genre !== "string" || book.genre.trim().length < 2)) {
    errors.push("El género debe contener al menos 2 caracteres.");
  }

  // Intro (optional)
  if (book.intro && typeof book.intro !== "string") {
    errors.push("La introducción debe ser una cadena de texto si se proporciona.");
  }

  // Description (required)
  if (book.description && (typeof book.description !== "string" || book.description.trim().length < 10)) {
    errors.push("Description must contain at least 10 characters.");
  }

  return errors;
};

export const validateDeleteBook = (req: Request) => {
  const errors: string[] = [];

  // Validar que el usuario sea admin
  const authUser = (req as any).authUser as { id: string; role: UserRole } | undefined;
  if (!authUser || authUser.role !== UserRole.ADMIN) {
    errors.push("Solo los usuarios administradores pueden eliminar libros.");
  }

  return errors;
};