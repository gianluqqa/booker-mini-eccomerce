import express from "express";
import { AppDataSource } from "./config/data-source";


const app = express();
app.use(express.json());

// Rutas
app.use("/users",);

export default app;
