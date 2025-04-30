import { IReservationRepository } from '../../../domain/interfaces/IReservaRepositorio';
import { Reservation, ReservationStatus } from '../../../domain/entities/reserva';
import { db } from '../db';

export class ReservationRepository implements IReservationRepository {
  async create(reservation: Reservation): Promise<void> {
    await db.query(
      `INSERT INTO reservations (id, client_name, date, time, table_number, people_count, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        reservation.id,
        reservation.clientName,
        reservation.date,
        reservation.time,
        reservation.tableNumber,
        reservation.peopleCount,
        reservation.status,
      ]
    );
  }

  async findByTableAndDate(tableNumber: number, date: Date, time: string): Promise<Reservation | null> {
    const result = await db.query(
      `SELECT * FROM reservations WHERE table_number = $1 AND date = $2 AND time = $3 AND status = 'PENDENTE'`,
      [tableNumber, date, time]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new Reservation(
      row.id,
      row.client_name,
      row.date,
      row.time,
      row.table_number,
      row.people_count,
      row.status as ReservationStatus
    );
  }

  async findById(id: string): Promise<Reservation | null> {
    // implementação ou placeholder temporário
    return null;
  }

  async update(reservation: Reservation): Promise<void> {
    // implementação ou placeholder
  }

  async findByPeriod(start: Date, end: Date): Promise<Reservation[]> {
    return [];
  }

  async findByTable(tableNumber: number): Promise<Reservation[]> {
    return [];
  }

  async findByWaiterId(waiterId: string): Promise<Reservation[]> {
    return [];
  }
}
