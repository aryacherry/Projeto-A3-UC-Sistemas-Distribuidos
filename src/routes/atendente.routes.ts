import { Router } from 'express';
import { criarReserva, cancelarReserva } from '../controllers/atendente.controller';

const router = Router();

router.post('/reservas', async (req, res) => {
  await criarReserva(req, res);
});
router.delete('/reservas/:id', async (req, res) => {
  await cancelarReserva(req, res);
});

export default router;
