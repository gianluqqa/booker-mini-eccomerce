// Estructura de datos para Book (respuesta del backend)
export interface IBook {
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

// Estructura de datos para crear (POST) un nuevo Book
export interface ICreateBook {
  title: string;
  image?: string;
  author: string;
  price: number;
  stock: number;
  genre: string;
  intro?: string;
  description: string;
}

// Estructura de datos para actualizar (PUT) un Book
export interface IUpdateBook {
  id: string;
  title?: string;
  image?: string;
  author?: string;
  price?: number;
  stock?: number;
  genre?: string;
  intro?: string;
  description?: string;
}

export interface IBookCardProps {
  book: IBook;
}