import { Router } from 'express';
import {
    confirmarReserva,
    liberarMesa,
    getMesas,
    cadastrarGarcom,
    listarGarcons 
    
} from '../controllers/garcom.controller';

import { excluirGarcom } from '../controllers/gerente.controller';

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
router.delete('/garcons/:id', async (req, res) => {
    await excluirGarcom(req, res);
});

export default router;