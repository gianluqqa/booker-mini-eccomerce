import { AppDataSource } from "../config/data-source";
import { Book } from "../entities/Book";

const booksData = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 10.99,
    stock: 100,
    image: "https://images.cdn2.buscalibre.com/fit-in/360x360/43/b3/43b37a982ff4b3fdefeb3fa969de1149.jpg",
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 12.99,
    stock: 85,
    image: "https://images.cdn1.buscalibre.com/fit-in/360x360/ab/54/ab54a82815e061d7fc8f22bcd22f2605.jpg",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 11.50,
    stock: 120,
    image: "https://images.cdn1.buscalibre.com/fit-in/360x360/f6/b6/f6b6a354bbc07e0791081e6e988e0efe.jpg",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 9.99,
    stock: 90,
    image: "https://images.cdn2.buscalibre.com/fit-in/360x360/65/13/65137ebf9c785c28053642d321c89209.jpg",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 13.25,
    stock: 75,
    image: "https://images.cdn1.buscalibre.com/fit-in/360x360/60/29/60297e36593e7322bdab153d11c5ed95.jpg",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    price: 15.99,
    stock: 60,
    image: "https://images.cdn3.buscalibre.com/fit-in/360x360/2c/c8/2cc8d8b40389605434add789a1fc055d.jpg",
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 14.99,
    stock: 200,
    image: "https://images.cdn3.buscalibre.com/fit-in/360x360/10/9d/109df8e47c0b36b888ea2be18a4ce3e5.jpg",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 12.75,
    stock: 95,
    image: "https://images.cdn1.buscalibre.com/fit-in/360x360/45/44/4544aa9e50feca33c58b1d4646f34b2f.jpg",
  },
  {
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    price: 11.99,
    stock: 110,
    image: "https://images.cdn1.buscalibre.com/fit-in/360x360/3e/b7/3eb7fa1d683c5ef60c2e6cc56ce8d40d.jpg",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 10.50,
    stock: 150,
    image: "https://images.cdn3.buscalibre.com/fit-in/360x360/7b/3d/7b3dced43f7cbbac894dd1fb1196041b.jpg",
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    price: 13.99,
    stock: 180,
    image: "https://images.cdn3.buscalibre.com/fit-in/360x360/09/2b/092be19c48bac23fb897b3d4696a3a09.jpg",
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    price: 11.75,
    stock: 95,
    image: "https://images.cdn2.buscalibre.com/fit-in/360x360/ec/fc/ecfc2c780d25a9841882ae4823bfabf9.jpg",
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    price: 12.25,
    stock: 80,
    image: "https://images.cdn1.buscalibre.com/fit-in/360x360/1f/1e/1f1ede0b04d8e6d02f804f97ac89e59d.jpg",
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    price: 14.50,
    stock: 160,
    image: "https://images.cdn1.buscalibre.com/fit-in/520x520/b8/38/be5fe97a07edbb2c5d6e6d755d70b707.jpg",
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    price: 13.25,
    stock: 70,
    image: "https://images.cdn2.buscalibre.com/fit-in/360x360/95/f6/95f60abf76ed2f6546c4eb694f221cb6.jpg",
  },
  {
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    price: 12.99,
    stock: 105,
    image: "https://images.cdn2.buscalibre.com/fit-in/520x520/76/64/7664588388ee26ead4557ab7a8af8bb0.jpg",
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    price: 11.99,
    stock: 140,
    image: "https://images.cdn3.buscalibre.com/fit-in/360x360/03/d4/03d441320c2eecb3bee3faaeea9b56ca.jpg",
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    price: 13.75,
    stock: 90,
    image: "https://images.cdn3.buscalibre.com/fit-in/360x360/4d/2c/4d2cb1fac874b84c30fcf0fd63fe4eba.jpg",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 12.50,
    stock: 85,
    image: "https://images.cdn2.buscalibre.com/fit-in/360x360/f3/5f/f35f34fddce312369d8246773a650ade.jpg",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    price: 14.99,
    stock: 75,
    image: "https://images.cdn1.buscalibre.com/fit-in/360x360/e1/5f/e15f89a3e8f60854c6dce67070944796.jpg",
  },
];

export const seedBooks = async () => {
  try {
    console.log("🌱 Iniciando seeding de libros...");
    
    // Verificar si ya existen libros
    const existingBooks = await AppDataSource.getRepository(Book).count();
    if (existingBooks > 0) {
      console.log(`📚 Ya existen ${existingBooks} libros en la base de datos. Saltando seeding.`);
      return;
    }

    // Crear libros
    const bookRepository = AppDataSource.getRepository(Book);
    const books = bookRepository.create(booksData);
    await bookRepository.save(books);

    console.log(`✅ Se han creado ${booksData.length} libros en la base de datos`);
  } catch (error) {
    console.error("❌ Error al hacer seeding de libros:", error);
    throw error;
  }
};

// Ejecutar seeding si se llama directamente
if (require.main === module) {
  AppDataSource.initialize()
    .then(async () => {
      await seedBooks();
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}
