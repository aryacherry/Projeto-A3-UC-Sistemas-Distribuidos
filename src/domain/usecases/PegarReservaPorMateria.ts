
import { IReservationRepository } from "../interfaces/IReservaRepositorio";
import { Reservation } from "../entities/reserva"; 

export class GetReservationsByMatter {
    constructor(private reservationRepo: IReservationRepository) {}

    async execute(matterId: string): Promise<Reservation[]> {
        if (!matterId) {
            throw new Error("ID da matéria não fornecido");
        }
        
        try {
            const reservations = await this.reservationRepo.findByMatterId(matterId);
            
            if (!reservations || reservations.length === 0) {
                throw new Error("Nenhuma reserva encontrada para esta matéria");
            }
            
            return reservations;
        } catch (error) {
            console.error("Erro ao buscar reservas por matéria:", error);
            throw new Error("Falha ao recuperar reservas por matéria");
        }
    }
}