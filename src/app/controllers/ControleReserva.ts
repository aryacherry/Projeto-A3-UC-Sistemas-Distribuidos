import { NextFunction, Request, Response } from 'express';
import { CreateReservation } from '../../domain/usecases/CriarReserva';
import { CancelReservation } from '../../domain/usecases/CancelarReserva';
import { ConfirmReservation } from '../../domain/usecases/ConfirmarReserva';
import { ReservationRepository } from '../../infrastructure/database/repositorio/ReservaRepositorio';

const reservationRepo = new ReservationRepository();

export class ReservationController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, time, tableNumber, peopleCount, responsibleName } = req.body;

      const usecase = new CreateReservation(reservationRepo);
      await usecase.execute({ date, time, tableNumber, peopleCount, responsibleName });

      return res.status(201).json({ message: 'Reserva criada com sucesso.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const usecase = new CancelReservation(reservationRepo);
      await usecase.execute(id);

      return res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const usecase = new ConfirmReservation(reservationRepo);
      await usecase.execute(id);

      return res.status(200).json({ message: 'Reserva confirmada com sucesso.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
