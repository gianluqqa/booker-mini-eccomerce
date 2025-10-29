import { AppDataSource } from "../config/data-source";
import { Book } from "../entities/Book";
import { BookDto, CreateBookDto } from "../dto/BookDto";

export const getBooksService = async (query?: string): Promise<BookDto[]> => {
  try {
    const bookRepository = AppDataSource.getRepository(Book);

    let queryBuilder = bookRepository.createQueryBuilder("book");

    // Si hay búsqueda, agregamos filtros
    if (query) {
      const lowerQuery = query.toLowerCase();
      queryBuilder = queryBuilder.where(
        "LOWER(book.title) LIKE :query OR LOWER(book.author) LIKE :query",
        { query: `%${lowerQuery}%` }
      );
    }

    const books = await queryBuilder.getMany();

    // Convertir entidades a DTOs
    const booksResponse: BookDto[] = books.map((book) => ({
      id: book.id?.toString(),
      title: book.title,
      author: book.author,
      price: Number(book.price),
      stock: book.stock,
      image: book.image || "",
      genre: book.genre,
      intro: book.intro,
      description: book.description,
    }));

    return booksResponse;
  } catch (error) {
    console.error("Error getting books:", error);
    throw new Error("Could not get books");
  }
};

export const createBookService = async (book: CreateBookDto): Promise<BookDto> => {
  const bookRepository = AppDataSource.getRepository(Book);

  try {
    //Verificar si el Book ya existe por título y autor.
    const existingBook = await bookRepository.findOne({
      where: { title: book.title, author: book.author },
    });

    if (existingBook) {
      throw { status: 409, message: "Book already exists" };
    }

    const newBook = bookRepository.create(book);

    await bookRepository.save(newBook);

    const createdBookResponse: BookDto = {
      id: newBook.id?.toString(),
      title: newBook.title,
      author: newBook.author,
      price: Number(newBook.price),
      stock: newBook.stock,
      image: newBook.image || "",
      genre: newBook.genre,
      intro: newBook.intro,
      description: newBook.description,
    };

    return createdBookResponse;
  } catch (error: any) {
    console.error("Error creating book:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw { status: 500, message: "Could not create book" };
  }
};
