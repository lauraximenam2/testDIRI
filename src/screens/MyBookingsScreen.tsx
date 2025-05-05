/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './MyBookingsScreen.module.css';
import cardStyles from '../styles/shared/Card.module.css';
import Button from '../components/Button';
import { FiCheckCircle, FiXCircle, FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi';

// Interfaz para Reserva
interface Booking {
  id: string;
  courtName: string;
  date: string; // Formato YYYY-MM-DD
  time: string;
  status: 'Confirmada' | 'Completada' | 'Cancelada';
}

const MyBookingsScreen: React.FC = () => {
  const location = useLocation(); // Para mostrar mensaje de confirmación
  const navigate = useNavigate();
  const [view, setView] = useState<'upcoming' | 'history'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);

  // Mensaje de confirmación si venimos de confirmar reserva
  useEffect(() => {
    if (location.state?.bookingConfirmed) {
      setShowConfirmationMsg(true);
      // Ocultar mensaje después de unos segundos
      const timer = setTimeout(() => setShowConfirmationMsg(false), 5000);
      // Limpiar estado para no mostrarlo si se navega de nuevo
      window.history.replaceState({}, document.title) // Limpia el state de location
      return () => clearTimeout(timer);
    }
  }, [location.state]);


  // Simulación carga de reservas
  useEffect(() => {
    setLoading(true);
    console.log(`Cargando reservas: ${view}`);
    // --- Simular llamada API ---
    setTimeout(() => {
      const allBookings: Booking[] = [
        { id: '123', courtName: 'Cancha Central', date: '2024-08-15', time: '10:00', status: 'Confirmada' },
         { id: '124', courtName: 'Pista Rápida 1', date: '2024-08-20', time: '16:00', status: 'Confirmada' },
        { id: '101', courtName: 'Pista Rápida 1', date: '2024-08-10', time: '15:00', status: 'Completada' },
        { id: '98', courtName: 'Cancha Central', date: '2024-08-05', time: '09:00', status: 'Cancelada' },
         { id: '95', courtName: 'Indoor 1', date: '2024-07-28', time: '19:00', status: 'Completada' },
      ];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = allBookings.filter(b => {
          const bookingDate = new Date(b.date);
          if (view === 'upcoming') {
              // Próximas: Confirmadas y fecha >= hoy
              return b.status === 'Confirmada' && bookingDate >= today;
          } else {
              // Historial: Completadas, Canceladas o fecha < hoy
              return b.status !== 'Confirmada' || bookingDate < today;
          }
      });

      // Ordenar: Próximas por fecha ascendente, Historial por fecha descendente
       filtered.sort((a, b) => {
           const dateA = new Date(a.date).getTime();
           const dateB = new Date(b.date).getTime();
           return view === 'upcoming' ? dateA - dateB : dateB - dateA;
       });


      setBookings(filtered);
      setLoading(false);
    }, 500);
  }, [view]); // Recargar al cambiar de vista

  const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para cancelar (simulada)
  const handleCancelBooking = (id: string) => {
      if (window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
          console.log("Cancelando reserva:", id);
          // --- Llamada API para cancelar ---
          // Actualizar estado local (simulado)
          //setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelada' } : b).filter(b => view === 'upcoming' ? b.status === 'Confirmada' : true));
      }
  };

  const getStatusInfo = (status: Booking['status']): { icon: React.ElementType, style: string, label: string } => {
    switch (status) {
      case 'Confirmada': return { icon: FiCheckCircle, style: styles.statusConfirmed, label: 'Confirmada' };
      case 'Completada': return { icon: FiCheckCircle, style: styles.statusCompleted, label: 'Completada' }; // Podría ser otro icono
      case 'Cancelada': return { icon: FiXCircle, style: styles.statusCancelled, label: 'Cancelada' };
      default: return { icon: FiAlertCircle, style: styles.statusUnknown, label: 'Desconocido'}; // Estado inesperado
    }
  };

  return (
    <div className="page-container">
      <header className={styles.header}>
        <h2>Mis Reservas</h2>
      </header>

      {/* Pestañas */}
      <div className={styles.tabs}>
        <Button
            variant={view === 'upcoming' ? 'primary' : 'ghost'}
            onClick={() => setView('upcoming')}
            className={styles.tabButton}
         >
            Próximas
         </Button>
        <Button
            variant={view === 'history' ? 'primary' : 'ghost'}
            onClick={() => setView('history')}
            className={styles.tabButton}
        >
            Historial
        </Button>
      </div>

       {/* Mensaje de confirmación */}
       {showConfirmationMsg && (
        <div className={styles.confirmationMessage}>
            <FiCheckCircle size={18} aria-hidden="true"/> {/* <--- Icono React */}
            ¡Tu reserva ha sido confirmada con éxito!
        </div>
       )}

      <main className="main-content">
        {loading && <p className={styles.message}>Cargando reservas...</p>}
        {!loading && bookings.length === 0 && (
          <div className={styles.emptyState}>
            <Button variant="secondary" onClick={() => navigate('/courts')}>
            
              Reservar Ahora
            </Button>
          </div>
        )}
        {!loading && bookings.map(booking => {
          const statusInfo = getStatusInfo(booking.status);
          return (
            <div key={booking.id} className={`${cardStyles.card} ${styles.bookingCard}`}>
              <div className={styles.cardHeader}>
                   <h3>{booking.courtName}</h3>
                   <span className={`${styles.statusBadge} ${statusInfo.style}`}>
                      {/* Icono de Estado */}
                      <statusInfo.icon size={14} aria-hidden="true" />
                      {statusInfo.label}
                   </span>
              </div>
              <p className={styles.dateTime}>
                <FiCalendar size={14} aria-hidden="true"/> {/* <--- Icono React */}
                {formatDate(booking.date)} -
                <FiClock size={14} aria-hidden="true" style={{marginLeft: '8px'}}/> {/* <--- Icono React */}
                {booking.time}
              </p>
              <div className={styles.cardActions}>
                   {booking.status === 'Confirmada' && view === 'upcoming' && (
                      <Button variant="error" size="small" onClick={() => handleCancelBooking(booking.id)}>
                          Cancelar Reserva
                      </Button>
                   )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default MyBookingsScreen;