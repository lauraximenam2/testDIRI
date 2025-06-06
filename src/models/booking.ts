export interface Booking {
  id?: string;
  userId: string; // ID del usuario que reserva
  courtId: string; // ID de la cancha reservada
  courtName: string; 
  date: string; // Formato YYYY-MM-DD
  startTime: string; 
  endTime: string;   
  status: 'Confirmada' | 'Completada' | 'Cancelada'; // Estado de la reserva
  totalPrice?: number;
  bookedAt: Date; // Hora de cuándo se hizo la reserva
}