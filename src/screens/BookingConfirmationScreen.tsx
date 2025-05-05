/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './BookingConfirmationScreen.module.css';
import cardStyles from '../styles/shared/Card.module.css';
import Button from '../components/Button';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const BookingConfirmationScreen: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener datos pasados desde la pantalla anterior
  const { courtName, date, time } = location.state || { courtName: `Cancha ${courtId}`, date: 'N/A', time: 'N/A' };

  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulación de datos de reserva (el precio vendría de la API o cálculo)
  const bookingDetails = {
    court: courtName,
    date: new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: time,
    duration: '1 hora', // Asumido
    price: '€15.00', // Simulado
  };

  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    setError(null);
    console.log('Confirmando reserva:', bookingDetails);
    // --- Simulación de llamada API para confirmar ---
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay API
      // Simular éxito o error
      const success = Math.random() > 0.1; // 90% de éxito simulado

      if (success) {
          console.log('Reserva confirmada exitosamente!');
          // Navegar a "Mis Reservas" o mostrar mensaje de éxito
          navigate('/bookings', { state: { bookingConfirmed: true, details: bookingDetails } });
      } else {
          throw new Error('No se pudo confirmar la reserva. Inténtalo de nuevo.');
      }
    } catch (err: any) {
      console.error("Error al confirmar:", err);
      setError(err.message || 'Ocurrió un error inesperado.');
      setIsConfirming(false);
    }
    // setIsConfirming(false); // Se hace en el catch o después de navegar
  };

  return (
    <div className="page-container">
      <header className={styles.header}>
        <Button variant='ghost' size='small' onClick={() => navigate(-1)} className={styles.headerButton} disabled={isConfirming} aria-label="Cancelar">
           <FiArrowLeft size={20} /> {/* <--- Icono React */}
           <span className={styles.cancelText}>Cancelar</span>
        </Button>
        <h2>Confirma tu Reserva</h2>
        {/* Espaciador ajustado al texto "Cancelar" */}
        <div style={{ minWidth: '90px' }}></div>
      </header>

      <main className="main-content">
        <div className={styles.confirmationBox}>
           <FiCheckCircle size={48} className={styles.icon} aria-label="Éxito"/> {/* <--- Icono React */}
           <h3>Revisa los detalles:</h3>

           <div className={`${cardStyles.card} ${styles.detailsCard}`}>

             <p><strong>Cancha:</strong> {bookingDetails.court}</p>
             <p><strong>Fecha:</strong> {bookingDetails.date}</p>
             <p><strong>Hora:</strong> {bookingDetails.time}</p>
             <p><strong>Duración:</strong> {bookingDetails.duration}</p>
             <p className={styles.price}><strong>Precio Total:</strong> {bookingDetails.price}</p>
           
           </div>

           {error && <p className={styles.errorMessage}>{error}</p>}

           {/* Campo opcional para notas */}
           {/* <textarea placeholder="Añadir notas (opcional)" className={inputStyles.textarea}></textarea> */}

           <Button
             variant="primary"
             size="large"
             fullWidth
             onClick={handleConfirmBooking}
             disabled={isConfirming}
             className={styles.confirmButton}
           >
             {isConfirming ? 'Confirmando...' : 'Confirmar Reserva'}
           </Button>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmationScreen;