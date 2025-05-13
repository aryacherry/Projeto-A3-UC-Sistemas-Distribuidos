import { Request, Response } from 'express';
import { CreateReservation } from '../../domain/usecases/CriarReserva';
import { CancelReservation } from '../../domain/usecases/CancelarReserva';
import { ConfirmReservation } from '../../domain/usecases/ConfirmarReserva';
import { ReservationRepository } from '../../infrastructure/database/repositorio/ReservaRepositorio';
import { GetReservationsByMatter } from '../../domain/usecases/PegarReservaPorMateria';

const reservationRepo = new ReservationRepository();

export class ReservationController {
  static async create(req: Request, res: Response) {
      try {
          const { date, time, tableNumber, peopleCount, responsibleName, matterId } = req.body;

          const usecase = new CreateReservation(reservationRepo);
          await usecase.execute({ 
              date, 
              time, 
              tableNumber: Number(tableNumber), 
              peopleCount: Number(peopleCount), 
              responsibleName,
              matterId
          });

          res.status(201).json({ 
              success: true,
              message: 'Reserva criada com sucesso.' 
          });
      } catch (error: any) {
          res.status(400).json({ 
              success: false,
              error: error.message 
          });
      }
  }

  static async getByMatter(req: Request, res: Response) {
      try {
          const { matterId } = req.params;
          const usecase = new GetReservationsByMatter(reservationRepo);
          const reservations = await usecase.execute(matterId);

          res.status(200).json({
              success: true,
              data: reservations
          });
      } catch (error: any) {
          res.status(400).json({
              success: false,
              error: error.message
          });
      }
  }
  
    static async cancel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const usecase = new CancelReservation(reservationRepo);
            await usecase.execute(id);
            
            res.status(200).json({ 
                success: true,
                message: 'Reserva cancelada com sucesso.' 
            });
        } catch (error: any) {
            res.status(400).json({ 
                success: false,
                error: error.message 
            });
        }
    }

    static async confirm(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const usecase = new ConfirmReservation(reservationRepo);
            await usecase.execute(id);
            
            res.status(200).json({ 
                success: true,
                message: 'Reserva confirmada com sucesso.' 
            });
        } catch (error: any) {
            res.status(400).json({ 
                success: false,
                error: error.message 
            });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const reservations = await reservationRepo.findAll();
            res.status(200).json({
                success: true,
                data: reservations
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}