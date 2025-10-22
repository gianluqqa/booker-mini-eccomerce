// Estrucutra de datos para Book.
export interface BookDto {
  id: string;
  title: string;
  image?: string;
  author: string;
  price: number;
  stock: number;
}

// Estrucutra de datos para crear (POST) un nuevo Book.
export interface CreateBookDto {
  title: string;
  image?: string;
  author: string;
  price: number;
  stock: number;
}
