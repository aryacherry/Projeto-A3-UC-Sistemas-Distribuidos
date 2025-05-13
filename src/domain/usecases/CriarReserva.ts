// src/domain/usecases/CriarReserva.ts
import { IReservationRepository } from '../interfaces/IReservaRepositorio';
import { Reservation } from '../entities/reserva';
import { randomUUID } from 'crypto';

type CreateReservationRequest = {
    date: string;
    time: string;
    tableNumber: number;
    peopleCount: number;
    responsibleName: string;
    matterId?: string; // Adicionando a propriedade opcional
};

export class CreateReservation {
    constructor(private reservationRepo: IReservationRepository) {}

    async execute(request: CreateReservationRequest): Promise<void> {
        const existing = await this.reservationRepo.findByTableAndDate(
            request.tableNumber,
            new Date(request.date),
            request.time
        );

        if (existing) {
            throw new Error('Mesa já reservada para essa data e horário.');
        }

        const reservation = new Reservation(
            randomUUID(),
            request.responsibleName,
            new Date(request.date),
            request.time,
            request.tableNumber,
            request.peopleCount,
            'PENDENTE',
            request.matterId
        );

        await this.reservationRepo.create(reservation);
    }
}