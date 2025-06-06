// src/models/court.ts
export interface ScheduleSlotData {
  status: 'available' | 'booked' | 'maintenance' | string; 
  userId?: string | null; // Quién reservó, si está 'booked'
  bookingId?: string | null; // ID de la reserva asociada
}

export interface DailyScheduleData {
  [time: string]: ScheduleSlotData;
}

export interface Court {
  id?: string;
  name: string;
  location: string;
  surface: string;
  img?: string;
  hourlyRate?: number;
  
//Horarios disponibles
  schedules?: {
    [dateISO: string]: DailyScheduleData;
  };

  tempAvailabilitySummary?: string; 
  isGenerallyAvailableOnSelectedDate?: boolean; // Para filtrar en CourtListScreen
}