import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json());

// Rutas
app.use("/users", userRoutes);

export default app;
