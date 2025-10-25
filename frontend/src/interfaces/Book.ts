export interface IBook {
    id?: string;
    title: string;
    image?: string;
    author: string;
    price: number;
    stock: number;
    genre: string;
  }

  export interface IBookCardProps {
    book: IBook
  }