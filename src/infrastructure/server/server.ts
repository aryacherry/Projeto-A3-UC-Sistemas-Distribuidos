import express from 'express';
import reservationRoutes from '../routes/Reserva.routes';
import reportRoutes from '../routes/Report.routes';

const app = express();
const port = 3000;

app.use(express.json());

// Rotas principais
app.use('/reservations', reservationRoutes);
app.use('/reports', reportRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API do Restaurante está no ar 🍽️');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
