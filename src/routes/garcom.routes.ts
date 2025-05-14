import { Router } from 'express';
import {
    confirmarReserva,
    liberarMesa,
    getMesas,
    cadastrarGarcom,
    listarGarcons
} from '../controllers/garcom.controller';

const router = Router();


router.put('/reservas/:id/confirmar', async (req, res) => {
    await confirmarReserva(req, res);
});
router.put('/mesas/:numero_mesa/liberar', liberarMesa);
router.get('/mesas', getMesas);

router.post('/garcons', async (req, res) => {
    await cadastrarGarcom(req, res);
});
router.get('/garcons', listarGarcons);

export default router;