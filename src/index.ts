import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import atendenteRoutes from './routes/atendente.routes';
import garcomRoutes from './routes/garcom.routes';
import gerenteRoutes from './routes/gerente.routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Rotas
app.use('/atendente', atendenteRoutes);
app.use('/garcom', garcomRoutes);
app.use('/gerente', gerenteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
