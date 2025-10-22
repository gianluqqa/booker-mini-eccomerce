import { BookDto } from "../dto/BookDto";

export const validateBook = (book: BookDto) => {
  const errors: string[] = [];

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

  return errors;
};
