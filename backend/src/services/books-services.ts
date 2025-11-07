import { AppDataSource } from "../config/data-source";
import { Book } from "../entities/Book";
import { BookDto, CreateBookDto, UpdateBookDto } from "../dto/BookDto";


//? Obtener todos los Books (GET).
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


//? Obtener un Book por ID (GET).
export const getBookByIdService = async (id: string): Promise<BookDto> => {
  const bookRepository = AppDataSource.getRepository(Book);

  try {
    const book = await bookRepository.findOne({ where: { id } });
    
    if (!book) {
      throw { status: 404, message: "Book not found" };
    }

    return {
      id: book.id?.toString(),
      title: book.title,
      author: book.author,
      price: Number(book.price),
      stock: book.stock,
      image: book.image || "",
      genre: book.genre,
      intro: book.intro,
      description: book.description,
    };
  } catch (error: any) {
    console.error("Error getting book by id:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Could not get book" };
  }
};

//? Crear un nuevo Book (POST).
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

//? Actualizar un Book (PUT).
export const updateBookService = async (book: UpdateBookDto): Promise<BookDto> => {
  const bookRepository = AppDataSource.getRepository(Book);

  try {
    const existingBook = await bookRepository.findOne({ where: { id: book.id } });
    if (!existingBook) {
      throw { status: 404, message: "Book not found" };
    }

    // Extraer id y actualizar solo los campos definidos
    const { id, ...updateData } = book;
    Object.assign(existingBook, updateData);
    await bookRepository.save(existingBook);

    return {
      id: existingBook.id?.toString(),
      title: existingBook.title,
      author: existingBook.author,
      price: Number(existingBook.price),
      stock: existingBook.stock,
      image: existingBook.image || "",
      genre: existingBook.genre,
      intro: existingBook.intro,
      description: existingBook.description,
    };
  } catch (error: any) {
    console.error("Error updating book:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Could not update book" };
  }
};

//? Eliminar un Book (DELETE).
export const deleteBookService = async (id: string): Promise<void> => {
  const bookRepository = AppDataSource.getRepository(Book);

  try {
    const existingBook = await bookRepository.findOne({ where: { id } });
    if (!existingBook) {
      throw { status: 404, message: "Book not found" };
    }

    await bookRepository.remove(existingBook);
  } catch (error: any) {
    console.error("Error deleting book:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Could not delete book" };
  }
};