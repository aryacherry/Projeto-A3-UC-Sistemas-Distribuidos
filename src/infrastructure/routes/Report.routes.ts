// src/infrastructure/routes/report.routes.ts
import { Router } from 'express';
import { ReportController } from '../../app/controllers/ControleReport';



const router = Router();


router.get('/period', async (req, res, next) => {
  try {
    await ReportController.byPeriod(req, res, next);
  } catch (error) {
    next(error);
  }
}); // Relatório por Período
router.get('/table/:tableNumber', async (req, res, next) => {
  try {
    await ReportController.byTable(req, res, next);
  } catch (error) {
    next(error);
  }
});
// Relatório por Mesa
router.get('/waiter/:waiterId', async (req, res, next) => {
  try {
    await ReportController.byWaiter(req, res, next);
  } catch (error) {
    next(error);
  }
}); // Relatório por Garçom



export default router;
