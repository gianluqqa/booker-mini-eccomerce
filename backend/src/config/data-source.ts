import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
import { Genre } from "../entities/Genre";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "glc2001luca2001",
  database: process.env.DB_NAME || "booker",
  synchronize: true, // solo para desarrollo
  //dropSchema: true,
  logging: false,
  uuidExtension: "uuid-ossp",
  entities: [User, Book, Order, OrderItem, Cart, Genre],
});
