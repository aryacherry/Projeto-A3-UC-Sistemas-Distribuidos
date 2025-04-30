export type ReservationStatus = 'PENDENTE' | 'CANCELADA' | 'CONFIRMADA';

export class Reservation {
  constructor(
    public readonly id: string,
    public clientName: string,
    public date: Date,
    public time: string,
    public tableNumber: number,
    public peopleCount: number,
    public status: ReservationStatus = 'PENDENTE'
  ) {}
}
