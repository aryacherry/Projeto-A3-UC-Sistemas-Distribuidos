// src/domain/usecases/CancelReservation.ts
import { IReservationRepository } from '../interfaces/IReservaRepositorio';

export class CancelReservation {
  constructor(private reservationRepo: IReservationRepository) {}

  async execute(reservationId: string): Promise<void> {
    const reservation = await this.reservationRepo.findById(reservationId);
    if (!reservation) {
      throw new Error('Reserva não encontrada.');
    }

    if (reservation.status !== 'PENDENTE') {
      throw new Error('Apenas reservas pendentes podem ser canceladas.');
    }

    reservation.status = 'CANCELADA';
    await this.reservationRepo.update(reservation);
  }
}
