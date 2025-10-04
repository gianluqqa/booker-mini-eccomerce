import express from "express";
import userRoutes from "./routes/userRoutes"; 

const app = express();
app.use(express.json());

// Rutas
app.use("/users", userRoutes);
app.get("/ping", (req, res) => res.send("pong"));
