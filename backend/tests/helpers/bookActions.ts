import { AppDataSource } from "../../src/config/data-source";
import { Book } from "../../src/entities/Book";

/**
 * ACCIONES: Libros
 * ----------------
 */

export const createTestBook = async (bookData: {
  title: string;
  author?: string;
  price: number;
  stock: number;
  genre?: string;
  description?: string;
}) => {
  const bookRepository = AppDataSource.getRepository(Book);
  const book = bookRepository.create({
    author: "Default Author",
    genre: "Default Genre",
    description: "Default Description",
    ...bookData,
  });
  return await bookRepository.save(book);
};
