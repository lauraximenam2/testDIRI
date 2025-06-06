// src/services/bookingService.ts
import { db, auth } from '../../firebase-config'; 
import {
  ref,
  push,
  get,
  update,
  serverTimestamp,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { Booking } from '../models/booking'; 
import { ScheduleSlotData } from '../models/court'; // Para actualizar el estado del slot

const bookingsRefPath = 'bookings';
const courtsRefPath = 'courts';


export const bookingService = {
  /**
   * Creamos una nueva reserva y actualiza el horario de la cancha.
   * Espera los datos esenciales de la reserva del cliente.
   * Asigna internamente id, status inicial y bookedAt.
   */

  createBooking: async (
bookingCoreData: Omit<Booking, 'id' | 'bookedAt' | 'status'>, courtId: any, dateISO: any, startTime: any  ): Promise<string> => {
    const bookingsNodeRef = ref(db, bookingsRefPath);
    const newBookingRef = push(bookingsNodeRef); // Firebase genera un ID único para la nueva reserva
    const newBookingId = newBookingRef.key;

    if (!newBookingId) {
      throw new Error("No se pudo generar un ID para la nueva reserva.");
    }

    // Construimos el objeto Booking completo que se guardará en Firebase
    const newBookingToSave: Booking = {
      ...bookingCoreData, // Contiene userId, courtId, courtName, date, startTime, endTime, totalPrice
      id: newBookingId,             // ID generado por Firebase
      status: 'Confirmada',         // Status inicial asignado por el servicio
      bookedAt: serverTimestamp() as any, // Timestamp del servidor asignado por el servicio
    };

    const updates: { [path: string]: any } = {};

    // 1. Preparamos la operación para guardar la nueva reserva
    updates[`${bookingsRefPath}/${newBookingId}`] = newBookingToSave;

    const slotPath = `${courtsRefPath}/${bookingCoreData.courtId}/schedules/${bookingCoreData.date}/${bookingCoreData.startTime}`;


    const updatedSlotData: Partial<ScheduleSlotData> = { 
      status: 'booked',
      userId: bookingCoreData.userId, // ID del usuario que reservó
      bookingId: newBookingId,        // ID de la reserva asociada
    };
    updates[slotPath] = updatedSlotData;

    try {
      await update(ref(db), updates);
      console.log('Reserva creada y horario actualizado. ID de Reserva:', newBookingId);
      return newBookingId;
    } catch (error) {
      console.error("Error creando reserva y actualizando horario:", error);
      throw error;
    }
  },

  /**
   * Obtenemos todas las reservas de un usuario específico.
   * Requiere un índice en Firebase en `bookings` por `userId`.
   */
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const bookingsNodeRef = ref(db, bookingsRefPath);

    const userBookingsQuery = query(bookingsNodeRef, orderByChild('userId'), equalTo(userId));

    try {
      const snapshot = await get(userBookingsQuery);
      if (snapshot.exists()) {
        const bookingsData = snapshot.val();
        const bookingsArray: Booking[] = Object.keys(bookingsData).map(key => {
          const booking = bookingsData[key];
          return {
            ...booking,
            id: key, 
            bookedAt: booking.bookedAt ? new Date(booking.bookedAt) : new Date() 
          } as Booking;
        });
        
        // Ordenamos por fecha de reserva y luego por hora de inicio (más antiguas primero)
        return bookingsArray.sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.startTime || '00:00'}`).getTime();
          const dateTimeB = new Date(`${b.date}T${b.startTime || '00:00'}`).getTime();
          return dateTimeA - dateTimeB;
        });
      }
      return [];
    } catch (error) {
      console.error(`Error obteniendo reservas para el usuario ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Obttenemos la próxima reserva confirmada de un usuario (o un número limitado de ellas).
   */
  getUpcomingUserBookings: async (userId: string, limit: number = 1): Promise<Booking[]> => {
    try {
      const allUserBookings = await bookingService.getUserBookings(userId);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const upcoming = allUserBookings
        .filter(b => {
          if (!b.date) return false;
          const bookingDate = new Date(b.date + 'T00:00:00Z'); 
          return b.status === 'Confirmada' && bookingDate >= today;
        })
        
        .slice(0, limit);

      return upcoming;
    } catch (error) {
      console.error(`Error obteniendo próximas reservas para el usuario ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Obtenemos una reserva específica por su ID.
   */
  getBookingById: async (bookingId: string): Promise<Booking | null> => {
    const bookingSpecificRef = ref(db, `${bookingsRefPath}/${bookingId}`);
    try {
      const snapshot = await get(bookingSpecificRef);
      if (snapshot.exists()) {
        const bookingData = snapshot.val();
        return {
          ...bookingData,
          id: snapshot.key, 
          bookedAt: bookingData.bookedAt ? new Date(bookingData.bookedAt) : new Date()
        } as Booking;
      }
      return null;
    } catch (error) {
      console.error(`Error obteniendo reserva ${bookingId}:`, error);
      throw error;
    }
  },

  /**
   * Cancelamos una reserva y liberamos el slot de horario en la cancha.
   */
  cancelBooking: async (
    bookingId: string,
    userId: string, // Para verificar que el usuario es el dueño
    courtId: string,
    dateISO: string, // YYYY-MM-DD
    startTime: string // HH:MM
  ): Promise<void> => {
    const bookingSpecificRef = ref(db, `${bookingsRefPath}/${bookingId}`);
    
    // Validamos primero con auth si el usuario actual es el que se pasa
    if (!auth.currentUser || auth.currentUser.uid !== userId) {
        throw new Error("Acción no autorizada. El usuario no coincide.");
    }

    try {
      const bookingSnapshot = await get(bookingSpecificRef);
      if (!bookingSnapshot.exists()) {
        throw new Error("Reserva no encontrada.");
      }

      const bookingData = bookingSnapshot.val() as Booking;
      if (bookingData.userId !== userId) {
        throw new Error("No autorizado para cancelar esta reserva (el dueño no coincide).");
      }
      if (bookingData.status === 'Cancelada' || bookingData.status === 'Completada') {
        console.log(`La reserva ${bookingId} ya está ${bookingData.status}. No se requiere acción.`);
        return;
      }

      const updates: { [path: string]: any } = {};
      // 1. Actualizar el estado de la reserva
      updates[`${bookingsRefPath}/${bookingId}/status`] = 'Cancelada';

      // 2. Liberar el slot de horario en la cancha
      const slotPath = `${courtsRefPath}/${courtId}/schedules/${dateISO}/${startTime}`;
      
      const freedSlotData: Partial<ScheduleSlotData> = {
        status: 'available',
        userId: null,
        bookingId: null, 
      };
      updates[slotPath] = freedSlotData;

      await update(ref(db), updates);
      console.log(`Reserva ${bookingId} cancelada y horario liberado.`);
    } catch (error) {
      console.error(`Error cancelando reserva ${bookingId}:`, error);
      throw error;
    }
  },

   
};