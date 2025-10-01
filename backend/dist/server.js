import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Booker Backend funcionando ✅');
});
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
//# sourceMappingURL=server.js.map