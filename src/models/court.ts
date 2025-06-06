// src/models/court.ts
export interface ScheduleSlotData {
  status: 'available' | 'booked' | 'maintenance' | string; // 'unavailable', etc.
  userId?: string | null; // Quién reservó, si está 'booked'
  bookingId?: string | null; // ID de la reserva asociada
}

export interface DailyScheduleData {
  [time: string]: ScheduleSlotData; // Clave es "HH:MM" (ej. "09:00")
}

export interface Court {
  id?: string;
  name: string;
  location: string;
  surface: string;
  img?: string;
  hourlyRate?: number;
  
  // Este es el nodo que guardarías en Firebase para los horarios
  // Es un objeto donde la clave es la fecha 'YYYY-MM-DD'
  schedules?: {
    [dateISO: string]: DailyScheduleData;
  };

  // Campos que podrías añadir en el cliente después de procesar los schedules para la UI
  // No se guardan directamente así en Firebase, sino que se calculan
  tempAvailabilitySummary?: string; // Ej: "5 horarios libres hoy"
  isGenerallyAvailableOnSelectedDate?: boolean; // Para filtrar en CourtListScreen
}