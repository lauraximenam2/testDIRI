import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Court } from '../../models/court'; 
import { courtService } from '../../services/courtService'; 
import logger from '../../services/logging'; 

// 1. Defininmos la interfaz para el estado de este slice
export interface CourtsState {
  allCourts: Court[]; // Canchas con datos de disponibilidad para la fecha seleccionada
  selectedDate: string; // YYYY-MM-DD
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'listening';
  error: string | null;
  filterSurface: string;
  searchTerm: string;
  showOnlyAvailable: boolean;
}

// 2. Definimos el estado inicial
const initialState: CourtsState = {
  allCourts: [],
  selectedDate: new Date().toISOString().substring(0, 10), // Fecha actual por defecto
  status: 'idle',
  error: null,
  filterSurface: '',
  searchTerm: '',
  showOnlyAvailable: false,
};

// 3. Thunk para manejar la suscripción en tiempo real

let unsubscribeFromCourts: (() => void) | null = null;

export const listenToCourtsByDate = createAsyncThunk<
  Court[], 
  string, 
  { rejectValue: string } 
>(
  'courts/listenByDate',
  async (selectedDate, { dispatch, rejectWithValue }) => {
    logger.info(`courtsSlice: Iniciando escucha para canchas en fecha: ${selectedDate  }`, { bookingData: {} as Omit<any, "id" | "bookedAt" | "status"> });

    // Cancelar cualquier suscripción anterior
    if (unsubscribeFromCourts) {
      logger.debug("courtsSlice: Desuscribiendo de escucha anterior.", { state: null });
      unsubscribeFromCourts();
      unsubscribeFromCourts = null;
    }

    return new Promise<Court[]>((resolve, reject) => {
      unsubscribeFromCourts = courtService.onCourtsAndSchedulesChange(
        selectedDate,
        (courtsWithAvailability) => {
          logger.debug(`courtsSlice: Datos de canchas recibidos para ${selectedDate}`, { state: { courtsCount: courtsWithAvailability.length } });
          // Despachamos una acción síncrona para actualizar el store con los datos recibidos
          dispatch(courtsDataReceived(courtsWithAvailability));
        },
        (fetchError) => {
          logger.error(`courtsSlice: Error al escuchar canchas para ${selectedDate}: ${fetchError.message}`, fetchError);
          reject(rejectWithValue(fetchError.message || 'Error al cargar canchas'));
        }
      );

      resolve([]); // Indica que el listener se estableció. El estado 'status' del slice se manejará
    });
  }
);


// 4. Creamos el slice
const courtsSlice = createSlice({
  name: "courts",
  initialState,
  reducers: {
    // Acción síncrona para actualizar la fecha seleccionada
    setSelectedDate: (state, action: PayloadAction<string>) => {
      logger.debug(`courtsSlice: setSelectedDate action, nueva fecha: ${action.payload}`, { state: state });
      state.selectedDate = action.payload;

    },
    // Acción para actualizar los datos de las canchas cuando el listener los emite
    courtsDataReceived: (state, action: PayloadAction<Court[]>) => {
      state.allCourts = action.payload;
      state.status = 'listening'; 
      state.error = null;
    },
    // Acciones para los filtros del cliente
    setCourtFilterSurface: (state, action: PayloadAction<string>) => {
      state.filterSurface = action.payload;
    },
    setCourtSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCourtShowOnlyAvailable: (state, action: PayloadAction<boolean>) => {
      state.showOnlyAvailable = action.payload;
    },
    clearCourtFilters: (state) => {
        state.filterSurface = '';
        state.searchTerm = '';
        state.showOnlyAvailable = false;
        logger.info("courtsSlice: Filtros de canchas limpiados.", { bookingData: {} as Omit<any, "id" | "bookedAt" | "status"> });
    },
    // Acción para limpiar el estado al desmontar o cuando sea necesario
    cleanupCourtsListener: (state) => {
      if (unsubscribeFromCourts) {
        logger.info("courtsSlice: Limpiando y desuscribiendo del listener de canchas.", { bookingData: {} as Omit<any, "id" | "bookedAt" | "status"> });
        unsubscribeFromCourts();
        unsubscribeFromCourts = null;
      }

      state.status = 'idle';
      state.allCourts = [];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(listenToCourtsByDate.pending, (state) => {
        logger.debug("courtsSlice: listenToCourtsByDate.pending - Configurando listener...", { state });
        state.status = 'loading'; // Indica que se está estableciendo el listener
        state.error = null;
        state.allCourts = []; 
      })
      .addCase(listenToCourtsByDate.fulfilled, (state, action) => {
        logger.info(`courtsSlice: listenToCourtsByDate.fulfilled - Listener para fecha ${state.selectedDate} establecido.`, { bookingData: {} as Omit<any, "id" | "bookedAt" | "status"> });
        state.status = 'listening'; 
        // Los datos se actualizarán a través de `courtsDataReceived`
      })
      .addCase(listenToCourtsByDate.rejected, (state, action) => {
        logger.error(
          `courtsSlice: listenToCourtsByDate.rejected - Error: ${action.payload || action.error.message}`,
          new Error(String(action.payload || action.error.message))
        );
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Error desconocido';
        state.allCourts = [];
      });
  }
});

// 5. Exportamos las acciones y el reducer
export const {
  setSelectedDate,
  courtsDataReceived,
  setCourtFilterSurface,
  setCourtSearchTerm,
  setCourtShowOnlyAvailable,
  clearCourtFilters,
  cleanupCourtsListener
} = courtsSlice.actions;

export default courtsSlice.reducer;