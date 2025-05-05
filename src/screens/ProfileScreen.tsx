import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProfileScreen.module.css';
import cardStyles from '../styles/shared/Card.module.css';
import Button from '../components/Button';
import {
    FiUser, FiEdit2, FiCalendar, FiLock, FiSettings,
    FiHelpCircle, FiChevronRight, FiLogOut // Añadir más si es necesario
} from 'react-icons/fi';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  // Simulación de datos de usuario (vendrían de Auth Context/API)
  const user = {
    name: "Carlos Santana",
    email: "carlos.s@email.com",
    avatar: "/placeholder-avatar.png" // O null si no hay avatar
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      console.log('Cerrando sesión...');
      // --- Lógica de Logout ---
      // Limpiar tokens, estado global de autenticación, etc.
      navigate('/login');
    }
  };

  // Opciones del menú de perfil
  const profileOptions = [
    { label: 'Mis Reservas', path: '/bookings', icon: FiCalendar },
    { label: 'Editar Perfil', path: '/profile/edit', icon: FiEdit2 },
    { label: 'Cambiar Contraseña', path: '/profile/change-password', icon: FiLock },
    { label: 'Ajustes', path: '/settings', icon: FiSettings }, 
    { label: 'Ayuda y Soporte', path: '/help', icon: FiHelpCircle },
  ];

  return (
    <div className="page-container">
      <header className={styles.header}> <h2>Mi Perfil</h2> </header>

      <main className="main-content">
        <section className={`${cardStyles.card} ${styles.userInfoCard}`}>
          <div className={styles.avatarContainer}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className={styles.avatar} />
            ) : (
              <div className={`${styles.avatar} ${styles.avatarPlaceholder}`}>
                <FiUser size={30} /> {/* <--- Icono React */}
              </div>
            )}
          </div>
          <div className={styles.userInfoText}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
           <Button variant='ghost' size='small' className={styles.editButton} onClick={() => navigate('/profile/edit')} aria-label="Editar perfil">
                <FiEdit2 size={16}/> {/* <--- Icono React */}
                <span className={styles.editText}>Editar</span>
            </Button>
        </section>

        <nav className={styles.optionsList}>
          {profileOptions.map((option) => {
            const Icon = option.icon; // Obtener el componente Icono
            return (
              <Link key={option.path} to={option.path} className={styles.optionItem}>
                <span className={styles.optionIcon}>
                  <Icon size={20} aria-hidden="true"/> {/* <--- Icono React */}
                </span>
                <span className={styles.optionLabel}>{option.label}</span>
                <span className={styles.optionChevron}>
                  <FiChevronRight size={18} aria-hidden="true"/> {/* <--- Icono React */}
                </span>
              </Link>
            );
           })}
        </nav>

        <div className={styles.logoutSection}>
          <Button variant="error" fullWidth onClick={handleLogout}>
             <FiLogOut size={16} /> {/* <--- Icono React */}
             Cerrar Sesión
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;