import { AppDataSource } from "../../src/config/data-source";
import { Book } from "../../src/entities/Book";

const booksData = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 10.99,
    stock: 100,
    image:
      "https://images.cdn2.buscalibre.com/fit-in/360x360/43/b3/43b37a982ff4b3fdefeb3fa969de1149.jpg",
    genre: "Classic Literature",
    description:
      "A story about the mysterious millionaire Jay Gatsby and his obsessive love for Daisy Buchanan, set in the Roaring Twenties on Long Island.",
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 12.99,
    stock: 85,
    image:
      "https://images.cdn1.buscalibre.com/fit-in/360x360/ab/54/ab54a82815e061d7fc8f22bcd22f2605.jpg",
    genre: "Dystopian Fiction",
    description:
      "A dystopian novel set in a totalitarian society where the Party, led by Big Brother, has complete control over every aspect of human life.",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 11.5,
    stock: 120,
    image:
      "https://images.cdn1.buscalibre.com/fit-in/360x360/f6/b6/f6b6a354bbc07e0791081e6e988e0efe.jpg",
    genre: "Classic Literature",
    description:
      "A novel about racial injustice in a small Southern town, seen through the eyes of a young girl named Scout Finch.",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 9.99,
    stock: 90,
    image:
      "https://images.cdn2.buscalibre.com/fit-in/360x360/65/13/65137ebf9c785c28053642d321c89209.jpg",
    genre: "Romance",
    description:
      "A romantic novel that charts the emotional development of Elizabeth Bennet, who learns the error of making hasty judgments.",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 13.25,
    stock: 75,
    image:
      "https://images.cdn1.buscalibre.com/fit-in/360x360/60/29/60297e36593e7322bdab153d11c5ed95.jpg",
    genre: "Coming-of-Age",
    description:
      "A story about teenage angst and alienation, narrated by the cynical and disillusioned Holden Caulfield.",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    price: 15.99,
    stock: 60,
    image:
      "https://images.cdn3.buscalibre.com/fit-in/360x360/2c/c8/2cc8d8b40389605434add789a1fc055d.jpg",
    genre: "Fantasy",
    description:
      "An epic high-fantasy novel that follows the quest of the hobbit Frodo Baggins to destroy the One Ring and defeat the Dark Lord Sauron.",
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 14.99,
    stock: 200,
    image:
      "https://images.cdn3.buscalibre.com/fit-in/360x360/10/9d/109df8e47c0b36b888ea2be18a4ce3e5.jpg",
    genre: "Fantasy",
    description:
      "The first novel in the Harry Potter series, introducing a young wizard, Harry Potter, and his adventures at Hogwarts School of Witchcraft and Wizardry.",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 12.75,
    stock: 95,
    image:
      "https://images.cdn1.buscalibre.com/fit-in/360x360/45/44/4544aa9e50feca33c58b1d4646f34b2f.jpg",
    genre: "Fantasy",
    description:
      "A fantasy novel about the hobbit Bilbo Baggins, who is swept into an epic quest to reclaim a lost Dwarf Kingdom from the fearsome dragon Smaug.",
  },
  {
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    price: 11.99,
    stock: 110,
    image:
      "https://images.cdn1.buscalibre.com/fit-in/360x360/3e/b7/3eb7fa1d683c5ef60c2e6cc56ce8d40d.jpg",
    genre: "Fantasy",
    description:
      "A story of four siblings who discover the magical world of Narnia, ruled by the evil White Witch, and their quest to free it with the help of the lion Aslan.",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 10.5,
    stock: 150,
    image:
      "https://images.cdn3.buscalibre.com/fit-in/360x360/7b/3d/7b3dced43f7cbbac894dd1fb1196041b.jpg",
    genre: "Philosophical Fiction",
    description:
      "A philosophical novel about a young Andalusian shepherd named Santiago who journeys to the pyramids of Egypt in search of a treasure.",
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    price: 13.99,
    stock: 180,
    image:
      "https://images.cdn3.buscalibre.com/fit-in/360x360/09/2b/092be19c48bac23fb897b3d4696a3a09.jpg",
    genre: "Thriller",
    description:
      "A thriller that follows symbologist Robert Langdon and cryptologist Sophie Neveu as they investigate a murder in the Louvre Museum and uncover a battle between the Priory of Sion and Opus Dei.",
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    price: 11.75,
    stock: 95,
    image:
      "https://images.cdn2.buscalibre.com/fit-in/360x360/ec/fc/ecfc2c780d25a9841882ae4823bfabf9.jpg",
    genre: "Literary Fiction",
    description:
      "A powerful story of friendship, betrayal, and redemption set against the tumultuous backdrop of modern Afghanistan.",
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    price: 12.25,
    stock: 80,
    image:
      "https://images.cdn1.buscalibre.com/fit-in/360x360/1f/1e/1f1ede0b04d8e6d02f804f97ac89e59d.jpg",
    genre: "Historical Fiction",
    description:
      "A historical novel set in Nazi Germany, narrated by Death, about a young girl who finds solace by stealing books and sharing them with others.",
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    price: 14.5,
    stock: 160,
    image:
      "https://images.cdn1.buscalibre.com/fit-in/520x520/b8/38/be5fe97a07edbb2c5d6e6d755d70b707.jpg",
    genre: "Dystopian Fiction",
    description:
      "A dystopian novel where teenagers are forced to compete in a televised fight to the death in a post-apocalyptic nation.",
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    price: 13.25,
    stock: 70,
    image:
      "https://images.cdn2.buscalibre.com/fit-in/360x360/95/f6/95f60abf76ed2f6546c4eb694f221cb6.jpg",
    genre: "Crime Thriller",
    description:
      "A psychological thriller in which a disgraced journalist and a troubled but brilliant computer hacker investigate a 40-year-old mystery.",
  },
  {
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    price: 12.99,
    stock: 105,
    image:
      "https://images.cdn2.buscalibre.com/fit-in/520x520/76/64/7664588388ee26ead4557ab7a8af8bb0.jpg",
    genre: "Dystopian Fiction",
    description:
      "A dystopian novel set in a patriarchal, totalitarian society where fertile women, called 'Handmaids,' are forced into child-bearing servitude.",
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    price: 11.99,
    stock: 140,
    image:
      "https://images.cdn3.buscalibre.com/fit-in/360x360/03/d4/03d441320c2eecb3bee3faaeea9b56ca.jpg",
    genre: "Young Adult Romance",
    description:
      "A heart-wrenching novel about two teenagers with cancer who fall in love, exploring the beauty and tragedy of life and loss.",
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    price: 13.75,
    stock: 90,
    image:
      "https://images.cdn3.buscalibre.com/fit-in/360x360/4d/2c/4d2cb1fac874b84c30fcf0fd63fe4eba.jpg",
    genre: "Science Fiction",
    description:
      "A science fiction novel about an astronaut stranded on Mars who must use his ingenuity to survive.",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 12.5,
    stock: 85,
    image:
      "https://images.cdn2.buscalibre.com/fit-in/360x360/f3/5f/f35f34fddce312369d8246773a650ade.jpg",
    genre: "Psychological Thriller",
    description:
      "A shocking psychological thriller of a woman's act of violence against her husband—and of the therapist obsessed with uncovering her motive.",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    price: 14.99,
    stock: 75,
    image:
      "https://images.cdn1.buscalibre.com/fit-in/360x360/e1/5f/e15f89a3e8f60854c6dce67070944796.jpg",
    genre: "Memoir",
    description:
      "A memoir by Tara Westover, who, after a sheltered upbringing in a survivalist family, educates herself and earns a PhD from Cambridge University.",
  },
];

export const seedBooks = async () => {
  try {
    console.log("🌱 Iniciando seeding de libros...");

    // Verificar si ya existen libros
    const existingBooks = await AppDataSource.getRepository(Book).count();
    if (existingBooks > 0) {
      console.log(
        `📚 Ya existen ${existingBooks} libros en la base de datos. Saltando seeding.`
      );
      return;
    }

    // Crear libros
    const bookRepository = AppDataSource.getRepository(Book);
    const preparedData = booksData.map((b) => ({
      ...b,
      genre: (b as any).genre ?? "General",
      description: (b as any).description ?? `${b.title} by ${b.author}`,
      intro: (b as any).intro ?? undefined,
    }));

    const books = bookRepository.create(preparedData);
    await bookRepository.save(books);

    console.log(
      `✅ Se han creado ${booksData.length} libros en la base de datos`
    );
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
