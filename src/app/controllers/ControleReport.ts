import { NextFunction, Request, Response } from 'express';
import { GetReservationsReport } from '../../domain/usecases/PegarReportReserva';
import { ReservationRepository } from '../../infrastructure/database/repositorio/ReservaRepositorio';

const reservationRepo = new ReservationRepository();

export class ReportController {
  static async byPeriod(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end } = req.query;
      const usecase = new GetReservationsReport(reservationRepo);
      const data = await usecase.byPeriod(new Date(start as string), new Date(end as string));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async byTable(req: Request, res: Response, next: NextFunction) {
    try {
      const { tableNumber } = req.params;
      const usecase = new GetReservationsReport(reservationRepo);
      const data = await usecase.byTable(parseInt(tableNumber));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async byWaiter(req: Request, res: Response, next: NextFunction) {
    try {
      const { waiterId } = req.params;
      const usecase = new GetReservationsReport(reservationRepo);
      const data = await usecase.byWaiter(waiterId);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
