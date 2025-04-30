// src/infrastructure/routes/reservation.routes.ts
import { Router } from 'express';
import { ReservationController } from '../../app/controllers/ControleReserva';

const router = Router();

router.post('/', (req, res, next) => {
    ReservationController.create(req, res, next);
  });        // Criar reserva
router.delete('/:id', (req, res, next) => {
    ReservationController.cancel(req, res, next);
  });    // Cancelar reserva
router.patch('/:id/confirm', (req, res, next) => {
    ReservationController.confirm(req, res, next);
  });// Confirmar reserva

export default router;
