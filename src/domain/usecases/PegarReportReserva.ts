// src/domain/usecases/GetReservationsReport.ts
import { IReservationRepository } from '../interfaces/IReservaRepositorio';
import { Reservation } from '../entities/reserva';

export class GetReservationsReport {
  constructor(private reservationRepo: IReservationRepository) {}

  async byPeriod(startDate: Date, endDate: Date): Promise<Reservation[]> {
    return this.reservationRepo.findByPeriod(startDate, endDate);
  }

  async byTable(tableNumber: number): Promise<Reservation[]> {
    return this.reservationRepo.findByTable(tableNumber);
  }

  async byWaiter(waiterId: string): Promise<Reservation[]> {
    return this.reservationRepo.findByWaiterId(waiterId); // Supondo que o garçom registre quem confirmou.
  }
}
