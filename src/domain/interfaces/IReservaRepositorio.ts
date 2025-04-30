import { Reservation } from '../entities/reserva';

export interface IReservationRepository {
  create(reservation: Reservation): Promise<void>;
  findByTableAndDate(tableNumber: number, date: Date, time: string): Promise<Reservation | null>;
  findById(id: string): Promise<Reservation | null>;
  update(reservation: Reservation): Promise<void>;

  // Relatórios
  findByPeriod(start: Date, end: Date): Promise<Reservation[]>;
  findByTable(tableNumber: number): Promise<Reservation[]>;
  findByWaiterId(waiterId: string): Promise<Reservation[]>;
}
