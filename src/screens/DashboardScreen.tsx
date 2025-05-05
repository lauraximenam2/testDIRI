import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardScreen.module.css';
import cardStyles from '../styles/shared/Card.module.css';
import Button from '../components/Button';
import { FiUser, FiCalendar, FiClock, FiBell } from 'react-icons/fi';
import Header from '../components/Header';

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const upcomingBooking = { // Simulado
    id: '123',
    courtName: 'Cancha Central',
    date: '2024-08-15',
    time: '10:00',
  };
  const popularCourts = [ // Simulado
      { id: 2, name: 'Pista Rápida 1'},
      { id: 3, name: 'Cancha de Tierra Batida'},
  ];

  const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="page-container">
      <Header
        showBackButton={false} 
        rightContent={ 
          <>
            <Button variant='ghost' size='small' aria-label="Notificaciones">
              <FiBell size={20} />
            </Button>
            <Button variant='ghost' size='small' onClick={() => navigate('/profile')} aria-label="Perfil">
              <FiUser size={20} />
            </Button>
          </>
        }
      />

      <main className="main-content">
        <section className={styles.quickActions}>
          <Button variant="primary" size="large" fullWidth onClick={() => navigate('/courts')}>
            Reservar una Cancha
          </Button>
        </section>

        {upcomingBooking && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tu Próxima Reserva</h2>
            <div className={`${cardStyles.card} ${cardStyles.cardClickable} ${styles.bookingCard}`} onClick={() => navigate(`/bookings/${upcomingBooking.id}`)}>
              <h3>{upcomingBooking.courtName}</h3>
              <div className={styles.bookingDetails}>
                 <FiCalendar size={16} aria-hidden="true"/> {/* <--- Icono React */}
                 <span>{formatDate(upcomingBooking.date)}</span>
              </div>
               <div className={styles.bookingDetails}>
                 <FiClock size={16} aria-hidden="true"/> {/* <--- Icono React */}
                 <span>{upcomingBooking.time}</span>
              </div>
              <Button variant='link' className={styles.detailsLink}>Ver Detalles</Button>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Canchas Populares</h2>
          <div className={styles.popularCourtsGrid}>
            {popularCourts.map(court => (
                 <div key={court.id} className={`${cardStyles.card} ${cardStyles.cardClickable}`} onClick={() => navigate(`/courts/${court.id}/booking`)}>
                    <h4 className={styles.popularCourtName}>{court.name}</h4>
                    <Button variant='link' size='small'>Ver Horarios</Button>
                 </div>
            ))}
             {popularCourts.length === 0 && <p>No hay canchas populares disponibles.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardScreen;