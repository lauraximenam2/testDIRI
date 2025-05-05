import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.css';
import { FiHome, FiCalendar, FiUser } from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Inicio' },
  { path: '/bookings', icon: FiCalendar, label: 'Reservas' },
  { path: '/profile', icon: FiUser, label: 'Perfil' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();


  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return isActive ? `${styles.link} ${styles.activeLink}` : styles.link;
  };

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path} className={getNavLinkClass}>
          <item.icon size={22} strokeWidth={1.5} /> 
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;