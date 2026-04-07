import { AppDataSource } from "../../src/config/data-source";
import { Book } from "../../src/entities/Book";

export const createTestBook = async (bookData: Partial<Book> = {}) => {
  const bookRepository = AppDataSource.getRepository(Book);
  
  const defaultBookData = {
    title: "Test Book",
    author: "Test Author",
    price: 19.99,
    stock: 10,
    description: "Test book description",
    genre: "Fiction",
    isbn: `test-isbn-${Date.now()}`,
    publicationDate: new Date(),
    ...bookData
  };

  const book = bookRepository.create(defaultBookData);
  return await bookRepository.save(book);
};
