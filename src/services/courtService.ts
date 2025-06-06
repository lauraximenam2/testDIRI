// src/services/courtService.ts
import { db } from '../../firebase-config'; 
import {
  ref,
  get,
  push,
  set,
  onValue,
  off
} from 'firebase/database';
import type { Court, DailyScheduleData, ScheduleSlotData } from '../models/court'; 

const courtsRefPath = 'courts';

export const courtService = {
  /**
   * Escucha cambios en todas las canchas y calcula un resumen de disponibilidad
   * para una fecha específica proporcionada.
   * @param selectedDateISO Fecha en formato YYYY-MM-DD para la cual calcular la disponibilidad.
   * @param callback Función a llamar con la lista de canchas (con info de disponibilidad).
   * @param onError Función a llamar si ocurre un error al escuchar los datos.
   * @returns Una función para desuscribirse del listener de Firebase.
   */

  
  onCourtsAndSchedulesChange: (
    selectedDateISO: string,
    callback: (courtsWithAvailability: Court[]) => void,
    onError: (error: Error) => void
  ): (() => void) => {
    const courtsNodeRef = ref(db, courtsRefPath);

    const listener = onValue(
      courtsNodeRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const courtsData = snapshot.val();
          const courtsArray: Court[] = Object.keys(courtsData).map(key => {
            
            const courtFromDB = courtsData[key];
            const court: Court = {
              id: key,
              name: courtFromDB.name || 'Nombre no disponible',
              location: courtFromDB.location || 'Ubicación no disponible',
              surface: courtFromDB.surface || 'Superficie no especificada',
              img: courtFromDB.img,
              hourlyRate: courtFromDB.hourlyRate,
              schedules: courtFromDB.schedules, 
            
            };

            let availableSlotsCount = 0;
            // Accedemos al schedule del día específico y asegurarse de que es del tipo correcto
            const dailySchedule: DailyScheduleData | undefined = court.schedules?.[selectedDateISO];

            if (dailySchedule) {
              availableSlotsCount = Object.values(dailySchedule).filter(
                (slot: ScheduleSlotData) => slot.status === 'available'
              ).length;
            }

            court.tempAvailabilitySummary = `${availableSlotsCount} horario${availableSlotsCount !== 1 ? 's' : ''} libre${availableSlotsCount !== 1 ? 's' : ''}`;
            court.isGenerallyAvailableOnSelectedDate = availableSlotsCount > 0;
            
            return court;
          });
          callback(courtsArray);
        } else {
          callback([]); // No hay canchas o el nodo no existe
        }
      },
      (error) => { 
        console.error("Firebase onValue error en onCourtsAndSchedulesChange:", error);
        onError(new Error("Error al leer datos de canchas en tiempo real.")); 
      }
    );

    // Devolver la función para desuscribirse
    return () => off(courtsNodeRef, 'value', listener);
  },

  /**
   * Obtenemos los horarios específicos para una cancha y una fecha dada.
   */
  getCourtScheduleForDate: async (courtId: string, dateISO: string): Promise<DailyScheduleData | null> => {
    const scheduleRef = ref(db, `${courtsRefPath}/${courtId}/schedules/${dateISO}`);
    try {
      const snapshot = await get(scheduleRef);
      return snapshot.exists() ? snapshot.val() as DailyScheduleData : null;
    } catch (error) {
      console.error(`Error obteniendo horarios para cancha ${courtId} en fecha ${dateISO}:`, error);
      throw error; 
    }
  },

  /** Esto no lo implementamos ya que no tenemos rol de admin para crear canchas, pero agregamos un poco la lógica para futuras mjoras
   * Añadimos una nueva cancha a la base de datos.
   * Los campos calculados como tempAvailabilitySummary no se guardan.
   */
  addCourt: async (courtData: Omit<Court, 'id' | 'tempAvailabilitySummary' | 'isGenerallyAvailableOnSelectedDate'>): Promise<string> => {
    const courtsNodeRef = ref(db, courtsRefPath);
    const newCourtRef = push(courtsNodeRef); // Firebase genera un ID único
    try {
      await set(newCourtRef, courtData);
      return newCourtRef.key!; // Devuelve el ID generado
    } catch (error) {
      console.error("Error añadiendo cancha:", error);
      throw error;
    }
  },

  /**
   * Busca canchas por nombre 
   */
  findCourtsByName: async (nameQuery: string): Promise<Court[]> => {
    const courtsNodeRef = ref(db, courtsRefPath);
    try {
      const snapshot = await get(courtsNodeRef);
      if (snapshot.exists()) {
        const courtsData = snapshot.val();
        const allCourts = Object.keys(courtsData).map(key => ({
          id: key,
          ...courtsData[key]
        } as Court));
        
        if (!nameQuery.trim()) { // Si la búsqueda está vacía, devolver todos
          return allCourts;
        }

        const lowerCaseQuery = nameQuery.toLowerCase();
        return allCourts.filter(court =>
          court.name.toLowerCase().includes(lowerCaseQuery) ||
          (court.location && court.location.toLowerCase().includes(lowerCaseQuery))
        );
      }
      return [];
    } catch (error) {
      console.error("Error buscando canchas por nombre:", error);
      throw error;
    }
  },
};