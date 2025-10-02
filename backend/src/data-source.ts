import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "glc2001luca2001",
    database: "tu_base",
    synchronize: true, // solo para desarrollo
    logging: true,
    entities: [User],
});
