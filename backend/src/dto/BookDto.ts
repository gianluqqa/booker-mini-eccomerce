// Estrucutra de datos para Book.
export interface BookDto {
  id?: string;
  title: string;
  image?: string;
  author: string;
  price: number;
  stock: number;
  genre: string;
  intro?: string;
  description: string;
}

// Estrucutra de datos para crear (POST) un nuevo Book.
export interface CreateBookDto {
  title: string;
  image?: string;
  author: string;
  price: number;
  stock: number;
  genre: string;
  intro?: string;
  description: string;
}
