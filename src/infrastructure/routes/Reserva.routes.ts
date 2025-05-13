import { Router } from 'express';
import { ReservationController } from '../../app/controllers/ControleReserva';

const router = Router();

router.post('/', ReservationController.create);
router.get('/matter/:matterId', ReservationController.getByMatter);
router.post('/', ReservationController.create);
router.get('/', ReservationController.list);
router.delete('/:id', ReservationController.cancel);
router.patch('/:id/confirm', ReservationController.confirm);

export default router;