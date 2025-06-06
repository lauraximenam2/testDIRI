import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { FiLogOut, FiUser, FiList, FiLogIn, FiUserPlus, FiGlobe } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { useAuthContext } from '../contexts/AuthContext';
import { useLanguageContext } from '../contexts/LanguageContext'; 
import { FormattedMessage, useIntl } from 'react-intl'; 

interface NavItemProps {
  to: string;
  labelId: string; // ID del mensaje para FormattedMessage
  icon?: React.ElementType;
  show?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, labelId, icon: Icon, show = true }) => {
  if (!show) return null;

  return (
    <li>
      <Link
        to={to}
        className="flex items-center px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-150 ease-in-out sm:px-4"
      >
        {Icon && <Icon size={18} className="mr-1.5 hidden sm:inline" />}
        <FormattedMessage id={labelId} /> 
      </Link>
    </li>
  );
};

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const { locale, changeLanguage } = useLanguageContext(); 
  const intl = useIntl(); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    changeLanguage(newLocale); // Llamamos a la función del contexto para cambiar el idioma
  };

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-3 h-16 sm:h-14">
        <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center space-x-2 text-xl font-semibold hover:text-gray-300 transition-colors">
          <img src="/logo_tenis.png" alt="Logo Reserva Tenis" className="h-8 w-auto sm:h-9" />
          <span className="hidden sm:inline">
            <FormattedMessage id="app.title" defaultMessage="ReservaTenis" /> {/* Título de la App */}
          </span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ul className="flex items-center space-x-1 sm:space-x-2">
            <NavItem to="/courts" labelId="nav.courts" />
            <NavItem to="/bookings" labelId="nav.myBookings" icon={FiList} show={!!currentUser} />
            <NavItem to="/login" labelId="nav.login" icon={FiLogIn} show={!currentUser} />
            <NavItem to="/register" labelId="nav.register" icon={FiUserPlus} show={!currentUser} />
          </ul>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <FiGlobe size={18} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hidden sm:block pointer-events-none" />
              <select
                value={locale}
                onChange={handleLanguageChange}
                className="py-2 pl-3 pr-7 text-sm text-white bg-gray-700 border border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary hover:border-gray-500 sm:pl-8"
                aria-label={intl.formatMessage({ id: "header.selectLanguage" })}
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </div>

            {currentUser && (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigate('/profile')}
                  variant="ghost"
                  size="small"
                  className="!p-2 text-gray-300 hover:!bg-gray-700 hover:!text-white rounded-full"
                  aria-label={intl.formatMessage({ id: "nav.profile" })}
                >
                  <FiUser size={20} />
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="small"
                  className="!border-red-600 !text-red-400 hover:!bg-red-600 hover:!text-white !px-2 sm:!px-3"
                  aria-label={intl.formatMessage({ id: "nav.logout" })}
                >
                  <FiLogOut size={18} className="hidden sm:inline sm:mr-1.5" />
                  <span className="hidden sm:inline">
                    <FormattedMessage id="nav.logout" />
                  </span>
                  <FiLogOut size={18} className="sm:hidden" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;