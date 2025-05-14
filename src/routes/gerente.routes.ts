import { Router } from 'express';
import {
  relatorioPorPeriodo,
  relatorioPorMesa,
  relatorioPorGarcom,
  cadastrarGarcom,
  listarGarcons,
  excluirGarcom
} from '../controllers/gerente.controller';

const router = Router();

// GET /gerente/relatorio/periodo?inicio=YYYY-MM-DD&fim=YYYY-MM-DD&status=reservada|confirmada|cancelada
router.get('/relatorio/periodo', async (req, res) => {
  // Agora aceita consultas sem status específico
  await relatorioPorPeriodo(req, res);
});

// GET /gerente/relatorio/mesa/1
router.get('/relatorio/mesa/:numero', async (req, res) => {
  await relatorioPorMesa(req, res);
});

// GET /gerente/relatorio/garcom/Carlos
router.get('/relatorio/garcom/:nome', async (req, res) => {
  await relatorioPorGarcom(req, res);
});

router.post('/garcons', async (req, res) => {
  await cadastrarGarcom(req, res);
});

router.delete('/garcons/:id', async (req, res) => {
  await excluirGarcom(req, res);
});
router.get('/garcons', listarGarcons);

export default router;
