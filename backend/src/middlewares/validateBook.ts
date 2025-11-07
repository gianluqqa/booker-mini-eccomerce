import { Request } from "express";
import { CreateBookDto, UpdateBookDto } from "../dto/BookDto";
import { UserRole } from "../enums/UserRole";

export const validateBook = (book: CreateBookDto, req: Request) => {
  const errors: string[] = [];

  // Validar que el usuario sea admin
  const authUser = (req as any).authUser as { id: string; role: UserRole } | undefined;
  if (!authUser || authUser.role !== UserRole.ADMIN) {
    errors.push("Only admin users can create books.");
  }

  // Title
  if (!book.title || typeof book.title !== "string" || book.title.trim().length < 2) {
    errors.push("Title is required and must contain at least 2 characters.");
  }

  // Author
  if (!book.author || typeof book.author !== "string" || book.author.trim().length < 2) {
    errors.push("Author is required and must contain at least 2 characters.");
  }

  // Price
  if (book.price === undefined || typeof book.price !== "number" || book.price <= 0) {
    errors.push("Price is required and must be a number greater than 0.");
  }

  // Stock
  if (book.stock === undefined || typeof book.stock !== "number" || book.stock < 0) {
    errors.push("Stock is required and cannot be negative.");
  }

  // Image (optional)
  if (book.image && typeof book.image !== "string") {
    errors.push("Image must be a valid URL string.");
  }

  // Genre (required)
  if (!book.genre || typeof book.genre !== "string" || book.genre.trim().length < 2) {
    errors.push("Genre is required and must contain at least 2 characters.");
  }

  // Intro (optional)
  if (book.intro !== undefined && typeof book.intro !== "string") {
    errors.push("Intro must be a string if provided.");
  }

  // Description (required)
  if (!book.description || typeof book.description !== "string" || book.description.trim().length < 10) {
    errors.push("Description is required and must contain at least 10 characters.");
  }

  return errors;
};

export const validateUpdateBook = (book: UpdateBookDto, req: Request) => {
  const errors: string[] = [];

  // Validar que el usuario sea admin
  const authUser = (req as any).authUser as { id: string; role: UserRole } | undefined;
  if (!authUser || authUser.role !== UserRole.ADMIN) {
    errors.push("Only admin users can update books.");
  }

  // Title
  if (book.title && (typeof book.title !== "string" || book.title.trim().length < 2)) {
    errors.push("Title must contain at least 2 characters.");
  }

  // Author
  if (book.author && (typeof book.author !== "string" || book.author.trim().length < 2)) {
    errors.push("Author must contain at least 2 characters.");
  }

  // Price
  if (book.price !== undefined && (typeof book.price !== "number" || book.price <= 0)) {
    errors.push("Price must be a number greater than 0.");
  }

  // Stock
  if (book.stock !== undefined && (typeof book.stock !== "number" || book.stock < 0)) {
    errors.push("Stock must be a number greater than or equal to 0.");
  }

  // Image (optional)
  if (book.image && typeof book.image !== "string") {
    errors.push("Image must be a valid URL string.");
  }

  // Genre (required)
  if (book.genre && (typeof book.genre !== "string" || book.genre.trim().length < 2)) {
    errors.push("Genre must contain at least 2 characters.");
  }

  // Intro (optional)
  if (book.intro && typeof book.intro !== "string") {
    errors.push("Intro must be a string if provided.");
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
    errors.push("Only admin users can delete books.");
  }

  return errors;
};