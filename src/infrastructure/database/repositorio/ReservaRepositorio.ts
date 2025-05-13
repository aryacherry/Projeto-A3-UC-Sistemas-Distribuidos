import { db } from '../db';
import { IReservationRepository } from '../../../domain/interfaces/IReservaRepositorio';
import { Reservation, ReservationStatus } from '../../../domain/entities/reserva';

export class ReservationRepository implements IReservationRepository {
  
  async create(reservation: Reservation): Promise<void> {
    const query = `
      INSERT INTO reservations (
        id, client_name, date, time, 
        table_number, people_count, status, matter_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
      reservation.id,
      reservation.clientName,
      reservation.date,
      reservation.time,
      reservation.tableNumber,
      reservation.peopleCount,
      reservation.status,
      reservation.matterId || null
    ];

    await db.query(query, values);
  }

  async findByTableAndDate(tableNumber: number, date: Date, time: string): Promise<Reservation | null> {
    const result = await db.query(
      `SELECT * FROM reservations 
       WHERE table_number = $1 AND date = $2 AND time = $3 
       AND status != 'CANCELADA'`,
      [tableNumber, date, time]
    );
    return result.rows[0] ? this.mapToReservation(result.rows[0]) : null;
  }

    async findById(id: string): Promise<Reservation | null> {
        const result = await db.query(
            `SELECT * FROM reservations WHERE id = $1`,
            [id]
        );
        return result.rows.length ? this.mapToReservation(result.rows[0]) : null;
    }

    async update(reservation: Reservation): Promise<void> {
        await db.query(
            `UPDATE reservations 
             SET client_name = $2, date = $3, time = $4, table_number = $5, 
                 people_count = $6, status = $7, matter_id = $8
             WHERE id = $1`,
            [
                reservation.id,
                reservation.clientName,
                reservation.date,
                reservation.time,
                reservation.tableNumber,
                reservation.peopleCount,
                reservation.status,
                reservation.matterId || null
            ]
        );
    }

    async findAll(): Promise<Reservation[]> {
        const result = await db.query(
            `SELECT * FROM reservations ORDER BY date, time`
        );
        return result.rows.map(row => this.mapToReservation(row));
    }

    async findByPeriod(start: Date, end: Date): Promise<Reservation[]> {
        const result = await db.query(
            `SELECT * FROM reservations 
             WHERE date BETWEEN $1 AND $2 
             ORDER BY date, time`,
            [start, end]
        );
        return result.rows.map(row => this.mapToReservation(row));
    }

    async findByTable(tableNumber: number): Promise<Reservation[]> {
        const result = await db.query(
            `SELECT * FROM reservations 
             WHERE table_number = $1 
             ORDER BY date, time`,
            [tableNumber]
        );
        return result.rows.map(row => this.mapToReservation(row));
    }

    async findByWaiterId(waiterId: string): Promise<Reservation[]> {
        const result = await db.query(
            `SELECT * FROM reservations 
             WHERE waiter_id = $1 
             ORDER BY date, time`,
            [waiterId]
        );
        return result.rows.map(row => this.mapToReservation(row));
    }

    async findByMatterId(matterId: string): Promise<Reservation[]> {
      const result = await db.query(
          `SELECT * FROM reservations 
           WHERE matter_id = $1 
           ORDER BY date, time`,
          [matterId]
      );
      return result.rows.map(row => this.mapToReservation(row));
  }

  private mapToReservation(row: any): Reservation {
    return new Reservation(
      row.id,
      row.client_name,
      new Date(row.date),
      row.time,
      row.table_number,
      row.people_count,
      row.status as ReservationStatus,
      row.matter_id
    );

    async function verifyDatabaseStructure(): Promise<void> {
      const requiredColumns = [
        { name: 'id', type: 'character varying' },
        { name: 'client_name', type: 'character varying' },
        { name: 'date', type: 'date' },
        { name: 'time', type: 'character varying' },
        { name: 'table_number', type: 'integer' },
        { name: 'people_count', type: 'integer' },
        { name: 'status', type: 'character varying' },
        { name: 'created_at', type: 'timestamp without time zone' }
      ];
    
      try {
        const result = await db.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'reservations'
        `);
    
        const missingColumns = requiredColumns.filter(rc => 
          !result.rows.some((r: any) => 
            r.column_name === rc.name && r.data_type === rc.type
          )
        );
    
        if (missingColumns.length > 0) {
          throw new Error(`Colunas faltando: ${missingColumns.map(c => c.name).join(', ')}`);
        }
    
        console.log('✅ Estrutura do banco de dados verificada com sucesso');
      } catch (error) {
        console.error('❌ Problema na estrutura do banco de dados:', error);
        throw error;
      }
    }
    
    // Chame esta função quando iniciar a aplicação
    verifyDatabaseStructure();
  }
  
}
  