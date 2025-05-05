/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './DateTimeSelectionScreen.module.css';
import inputStyles from '../styles/shared/Input.module.css';
import cardStyles from '../styles/shared/Card.module.css';
import Button from '../components/Button';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';

// Simulación de datos de slots
interface TimeSlot {
  time: string; // Ej: "09:00 - 10:00"
  available: boolean;
}

const DateTimeSelectionScreen: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener courtName si se pasó
  const courtName = location.state?.courtName || `Cancha ${courtId}`; // Nombre fallback

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Cargar slots al cambiar la fecha o el courtId
  useEffect(() => {
    setLoadingSlots(true);
    setSelectedTimeSlot(null); // Reset selección al cambiar fecha
    console.log(`Cargando slots para cancha ${courtId} en fecha ${selectedDate.toISOString().split('T')[0]}`);
    // --- Simulación de llamada API para obtener slots ---
    setTimeout(() => {
      // La disponibilidad dependería de la fecha real
      const fetchedSlots: TimeSlot[] = [
        { time: "09:00 - 10:00", available: true },
        { time: "10:00 - 11:00", available: true },
        { time: "11:00 - 12:00", available: false },
        { time: "12:00 - 13:00", available: true },
        { time: "13:00 - 14:00", available: false },
        { time: "16:00 - 17:00", available: true },
        { time: "17:00 - 18:00", available: true },
      ];
      setTimeSlots(fetchedSlots);
      setLoadingSlots(false);
    }, 300);
  }, [selectedDate, courtId]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Asegurarse que la fecha no sea pasada y manejar zona horaria
    const dateValue = event.target.value;
    const [year, month, day] = dateValue.split('-').map(Number);
    const newDate = new Date(year, month - 1, day); // Mes es 0-indexed
    const today = new Date();
    today.setHours(0,0,0,0); // Comparar solo fechas

    if (newDate >= today) {
        setSelectedDate(newDate);
    } else {
        // Opcional: mostrar mensaje de error o no hacer nada
        console.warn("No se pueden seleccionar fechas pasadas");
    }
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot.time);
    }
  };

  const formattedDate = selectedDate.toLocaleDateString('es-ES', {
     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
   const isoDateString = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD

   return (
    <div className="page-container">
      <header className={styles.header}>
         <Button variant='ghost' size='small' onClick={() => navigate(-1)} className={styles.headerButton} aria-label="Volver">
            <FiArrowLeft size={20} /> {/* <--- Icono React */}
        </Button>
        <h2>Selecciona Fecha y Hora</h2>
        <div style={{ width: '40px' }}></div>
      </header>

      <main className="main-content">
        <p className={styles.courtInfo}>Estás reservando: <strong>{courtName}</strong></p>

        <div className={styles.dateSelector}>
           <FiCalendar size={20} aria-hidden="true" /> {/* <--- Icono React */}
           <input
                type="date" value={isoDateString} onChange={handleDateChange}
                className={`${inputStyles.input} ${styles.dateInput}`}
                min={new Date().toISOString().split('T')[0]}
            />
        </div>

        {/* Selector de Horario */}
        <div className={styles.timeSlotsSection}>
          <h3>Horarios disponibles para el {formattedDate}</h3>
          {loadingSlots && <p>Cargando horarios...</p>}
          {!loadingSlots && timeSlots.length === 0 && <p>No hay horarios disponibles para este día.</p>}
          {!loadingSlots && timeSlots.length > 0 && (
            <div className={styles.timeGrid}>
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTimeSlot === slot.time ? 'primary' : 'outline'}
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  className={styles.timeSlotButton}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Resumen y Botón Continuar (fijo abajo) */}
        {selectedTimeSlot && (
          <div className={styles.summaryFooter}>
             <div className={styles.summaryContent}>
                <p>Seleccionado: <strong>{formattedDate}</strong> a las <strong>{selectedTimeSlot}</strong></p>
                 <Button
                    variant="primary"
                    size="large"
                    onClick={() => navigate(`/courts/${courtId}/confirm`, { state: { courtName: courtName, date: isoDateString, time: selectedTimeSlot } })}
                  >
                    Continuar Reserva
                </Button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DateTimeSelectionScreen;