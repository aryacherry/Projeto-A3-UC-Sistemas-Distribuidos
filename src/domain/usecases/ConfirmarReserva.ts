// src/domain/usecases/ConfirmReservation.ts
import { IReservationRepository } from '../interfaces/IReservaRepositorio';

export class ConfirmReservation {
  constructor(private reservationRepo: IReservationRepository) {}

  async execute(reservationId: string): Promise<void> {
    const reservation = await this.reservationRepo.findById(reservationId);
    if (!reservation) {
      throw new Error('Reserva não encontrada.');
    }

    if (reservation.status !== 'PENDENTE') {
      throw new Error('A reserva não pode ser confirmada pois não está pendente.');
    }

    reservation.status = 'CONFIRMADA';
    await this.reservationRepo.update(reservation);
  }
}
