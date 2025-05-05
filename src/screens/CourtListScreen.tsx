/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CourtListScreen.module.css';
import cardStyles from '../styles/shared/Card.module.css';
import inputStyles from '../styles/shared/Input.module.css';
import Button from '../components/Button';
import { FiArrowLeft, FiFilter, FiMapPin, FiTag, FiClock, FiDollarSign, FiInfo } from 'react-icons/fi';

// Interfaz para el tipo de dato de Cancha
interface Court {
  id: number;
  name: string;
  location: string;
  surface: string;
  availability: string; // Podría ser número de slots o precio
  img: string;
}

const CourtListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [showFilters, setShowFilters] = useState(false); // Estado para modal/panel de filtros

  // Simulación de carga de datos
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const fetchedCourts: Court[] = [
        { id: 1, name: "Cancha Central", location: "Club Principal", surface: "Tierra Batida", availability: "5 horarios", img: "/placeholder-court1.jpg" },
        { id: 2, name: "Pista Rápida 1", location: "Anexo Norte", surface: "Dura", availability: "Desde €15/hora", img: "/placeholder-court2.jpg" },
        { id: 3, name: "Pista Césped", location: "Club Principal", surface: "Césped Sintético", availability: "3 horarios", img: "/placeholder-court3.jpg" },
        { id: 4, name: "Indoor 1", location: "Pabellón Cubierto", surface: "Indoor", availability: "Desde €20/hora", img: "/placeholder-court4.jpg" },
      ];
      setCourts(fetchedCourts);
      setLoading(false);
    }, 500);
  }, [selectedDate]);

  // Determina qué icono usar para disponibilidad
  const getAvailabilityIcon = (availabilityText: string) => {
      if (availabilityText.toLowerCase().includes('hora')) {
          return <FiDollarSign size={14} aria-hidden="true" />;
      } else if (availabilityText.toLowerCase().includes('horario')) {
           return <FiClock size={14} aria-hidden="true" />;
      }
      return <FiInfo size={14} aria-hidden="true" />; // Icono por defecto
  }

  return (
    <div className="page-container">
      <header className={styles.header}>
        <Button variant='ghost' size='small' onClick={() => navigate(-1)} className={styles.headerButton} aria-label="Volver">
            <FiArrowLeft size={20} /> {/* <--- Icono React */}
        </Button>
        <h2>Canchas Disponibles</h2>
        <Button variant='ghost' size='small' onClick={() => setShowFilters(!showFilters)} className={styles.headerButton} aria-label="Filtros">
            <FiFilter size={20} /> {/* <--- Icono React */}
            <span className={styles.filterText}>Filtro</span> {/* Texto opcional */}
        </Button>
      </header>

      {/* Área de Filtros */}
      <div className={styles.filterArea}>
        <label htmlFor="date-filter" className={styles.dateLabel}>Fecha:</label>
        <input
          id="date-filter" type="date" value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`${inputStyles.input} ${styles.dateInput}`}
          min={new Date().toISOString().substring(0, 10)}
        />
      </div>

      <main className={`main-content ${styles.listContent}`}>
        {loading && <p className={styles.loadingMessage}>Cargando canchas...</p>}
        {/* ... Mensaje sin resultados ... */}
        {!loading && courts.map(court => (
          <div key={court.id} className={`${cardStyles.card} ${styles.courtCard}`}>
            <img src={court.img} alt={court.name} className={styles.courtImage}/>
            <div className={styles.courtInfo}>
              <h3>{court.name}</h3>
              <p className={styles.courtDetail}>
                <FiMapPin size={14} aria-hidden="true"/> {/* <--- Icono React */}
                 {court.location}
              </p>
              <p className={styles.courtDetail}>
                <FiTag size={14} aria-hidden="true"/> {/* <--- Icono React */}
                 {court.surface}
              </p>
              <p className={`${styles.courtDetail} ${styles.availability}`}>
                {getAvailabilityIcon(court.availability)} {/* <--- Icono dinámico */}
                {court.availability}
              </p>
            </div>
            <Button
                variant="secondary" size="small" className={styles.viewButton}
                onClick={() => navigate(`/courts/${court.id}/booking`, { state: { courtName: court.name } })}
             >
                Ver Horarios
            </Button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default CourtListScreen;