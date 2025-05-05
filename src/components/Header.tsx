import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import Button from './Button'; // Reutilizamos nuestro botón para el back
import { FiArrowLeft } from 'react-icons/fi'; // Icono para volver

interface HeaderProps {
  showBackButton?: boolean; // Para mostrar u ocultar la flecha de volver
  onBackClick?: () => void; // Acción personalizada al volver (opcional)
  rightContent?: React.ReactNode; // Contenido para la parte derecha (iconos, botones)
  className?: string; // Clases CSS adicionales
}

const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  onBackClick,
  rightContent,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1)
    }
  };

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.container}>
        {/* Sección Izquierda: Botón Volver */}
        <div className={styles.leftSection}>
          {showBackButton && (
            <Button
              variant="ghost"
              size="small"
              onClick={handleBack}
              className={styles.backButton}
              aria-label="Volver"
            >
              <FiArrowLeft size={22} />
            </Button>
          )}
        <div className={styles.centerSection}>
          <img
            src="/logo_tenis.png" 
            alt="Logo App Reserva Tenis"
            className={styles.logo}
          />
        </div>
        </div>



        {/* Sección Derecha: Contenido Personalizado */}
        <div className={styles.rightSection}>
          {rightContent}
        </div>
      </div>
    </header>
  );
};

export default Header;