import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import userRoutes from "./routes/users-routes";
import booksRoutes from "./routes/books-routes";
import cartRoutes from "./routes/carts-routes";
import paymentRoutes from "./routes/payments-routes";
import orderRoutes from "./routes/orders-routes";
import checkoutRoutes from "./routes/checkout-routes";

dotenv.config();

export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Endpoint raíz
app.get("/", (req, res) => {
  res.send("Booker Backend funcionando ✅");
});

// Rutas
app.use("/users", userRoutes);
app.use("/books", booksRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/checkout", checkoutRoutes);

const PORT = process.env.PORT || 5000;

// Inicializar TypeORM antes de levantar el servidor
AppDataSource.initialize()
  .then(() => {
    console.log("✅ DB conectada y sincronizada");

    // Solo levanta el servidor si la DB se conectó
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error al conectar DB", err);
  });
