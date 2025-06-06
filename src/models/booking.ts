export interface Booking {
  id?: string;
  userId: string; // ID del usuario que reserva
  courtId: string; // ID de la cancha reservada
  courtName: string; // Para fácil visualización
  date: string; // Formato YYYY-MM-DD
  startTime: string; // Ej: "10:00"
  endTime: string;   // Ej: "11:00"
  status: 'Confirmada' | 'Completada' | 'Cancelada'; // Estado de la reserva
  totalPrice?: number;
  bookedAt: Date; // Timestamp de cuándo se hizo la reserva
}