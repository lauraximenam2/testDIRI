// src/screens/DateTimeSelectionScreen.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; 
import Button from '../components/Button'; 
import { FiArrowLeft, FiCalendar, FiAlertCircle } from 'react-icons/fi';

// Interfaz para TimeSlot
interface TimeSlot {
  time: string;
  available: boolean;
}

const DateTimeSelectionScreen: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const courtName = location.state?.courtName || `Cancha ${courtId}`;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Formatear la fecha seleccionada para mostrarla al usuario
  const formattedSelectedDate = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  // Formatear la fecha para el input type="date" (YYYY-MM-DD)
  const isoDateString = selectedDate.toISOString().split('T')[0];

  // Cargar slots al cambiar la fecha o el courtId
  useEffect(() => {
    setLoadingSlots(true);
    setSelectedTimeSlot(null); // Resetear selección al cambiar fecha
    // --- Simulación de llamada API para obtener slots ---
    setTimeout(() => {
      const fetchedSlots: TimeSlot[] = [
        { time: "09:00 - 10:00", available: true }, { time: "10:00 - 11:00", available: true },
        { time: "11:00 - 12:00", available: false }, { time: "12:00 - 13:00", available: true },
        { time: "13:00 - 14:00", available: false }, { time: "16:00 - 17:00", available: true },
        { time: "17:00 - 18:00", available: true },
      ];
      setTimeSlots(fetchedSlots);
      setLoadingSlots(false);
    }, 300);
  }, [selectedDate, courtId]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value; // YYYY-MM-DD
    const [year, month, day] = dateValue.split('-').map(Number);
    const newDate = new Date(Date.UTC(year, month - 1, day)); 

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Comparar con UTC hoy

    if (newDate >= today) {
      setSelectedDate(newDate);
    } else {
      alert("No puedes seleccionar una fecha pasada.");
    }
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot.time === selectedTimeSlot ? null : slot.time); 
    }
  };

  return (
    // Contenedor principal de la pantalla
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header de la Pantalla */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm sm:p-4 h-14">
        <Button
          variant='ghost'
          size='small'
          onClick={() => navigate(-1)}
          className="!p-1.5 sm:!p-2 text-gray-600 hover:text-gray-900"
          aria-label="Volver"
        >
          <FiArrowLeft size={22} strokeWidth={2} />
        </Button>
        <h2 className="flex-grow text-lg font-semibold text-center text-gray-800 truncate sm:text-xl">
          Selecciona Fecha y Hora
        </h2>
        <div className="min-w-[40px] sm:min-w-[50px]"></div> 
      </header>

      {/* Contenido Principal */}
      <main className={`flex-grow p-4 sm:p-6 ${selectedTimeSlot ? 'pb-28 sm:pb-32' : 'pb-6'}`}>
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-center text-gray-700">
            Estás reservando para: <strong className="text-primary">{courtName}</strong>
          </p>

          {/* Selector de Fecha */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
            <label htmlFor="date-selector" className="flex items-center mb-2 text-sm font-medium text-gray-700">
              <FiCalendar size={18} className="mr-2 text-accent" />
              Selecciona una fecha:
            </label>
            <input
              id="date-selector"
              type="date"
              value={isoDateString}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]} // Mínimo hoy
              className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          {/* Selector de Horario */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
            <h3 className="mb-3 text-md font-semibold text-gray-700">
              Horarios disponibles para el <span className="text-primary">{formattedSelectedDate}</span>
            </h3>
            {loadingSlots && (
              <div className="flex items-center justify-center py-4 text-gray-500">
                <svg className="w-5 h-5 mr-2 animate-spin text-primary"  ></svg>
                Cargando horarios...
              </div>
            )}
            {!loadingSlots && timeSlots.length === 0 && (
              <div className="flex flex-col items-center py-4 text-center text-gray-500">
                <FiAlertCircle size={32} className="mb-2 text-gray-400"/>
                No hay horarios disponibles para este día.
              </div>
            )}
            {!loadingSlots && timeSlots.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTimeSlot === slot.time ? 'primary' : (slot.available ? 'outline' : 'ghost')}
                    onClick={() => handleTimeSelect(slot)}
                    disabled={!slot.available}
                    fullWidth
                    className={`py-2.5 sm:py-3 text-sm 
                                ${!slot.available ? 'text-gray-400 !border-gray-300 line-through !bg-gray-100' : ''}
                                ${selectedTimeSlot === slot.time ? 'ring-2 ring-offset-1 ring-primary-dark' : ''}`}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Resumen y Botón Continuarj */}
      {selectedTimeSlot && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-white border-t border-gray-200 shadow-top-md sm:p-6">
          <div className="flex flex-col items-center max-w-md mx-auto space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
            <p className="text-sm text-center text-gray-700 sm:text-left">
              Seleccionado: <strong className="text-primary">{formattedSelectedDate}</strong>
              <br className="sm:hidden" /> a las <strong className="text-primary">{selectedTimeSlot}</strong>
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate(`/courts/${courtId}/confirm`, { state: { courtName: courtName, date: isoDateString, time: selectedTimeSlot } })}
              className="w-full sm:w-auto shadow-md"
            >
              Continuar Reserva
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelectionScreen;