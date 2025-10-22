import { BookDto } from "../dto/BookDto";
import { booksArray } from "../utils/BooksArray";

export const getBooksService = async (query?: string): Promise<BookDto[]> => {
  try {
    // Si no hay búsqueda, devolvemos todo el array
    if (!query) return booksArray;

    // Normalizamos la búsqueda (por si viene en mayúsculas/minúsculas)
    const lowerQuery = query.toLowerCase();

    // Filtramos por coincidencia en título o autor
    const filteredBooks = booksArray.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery)
    );

    return filteredBooks;
  } catch (error) {
    console.error("Error getting books:", error);
    throw new Error("Could not get books");
  }
};
