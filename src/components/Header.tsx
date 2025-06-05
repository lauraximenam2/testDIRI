// src/components/Header.tsx
import React from 'react'; // Quitamos useState si setLocale no se usa aquí
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button'; // Tu componente Button
import { FiLogOut, FiUser, FiList, FiLogIn, FiUserPlus, FiGlobe } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config'; // Asegúrate que la ruta sea correcta
import { useAuthContext } from '../contexts/AuthContext'; // Usar el contexto real

// Simulación de FormattedMessage (si no usas react-intl, puedes quitarla o implementarla)
const FormattedMessage: React.FC<{ id: string; defaultMessage: string }> = ({ defaultMessage }) => <>{defaultMessage}</>;


const useLanguage = () => {
  const [locale, setLocale] = React.useState('es');
  return { locale, setLocale }; 
};

// Interfaz para los items de navegación, si la necesitas
interface NavItemProps {
  to: string;
  labelId: string;
  defaultLabel: string;
  icon?: React.ElementType;
  show?: boolean; // Prop para controlar la visibilidad
}

const NavItem: React.FC<NavItemProps> = ({ to, labelId, defaultLabel, icon: Icon, show = true }) => {
  if (!show) return null; // No renderizar si show es false

  return (
    <li>
      <Link
        to={to}
        className="flex items-center px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-150 ease-in-out sm:px-4"
      >
        {Icon && <Icon size={18} className="mr-1.5 hidden sm:inline" />}
        <FormattedMessage id={labelId} defaultMessage={defaultLabel} />
      </Link>
    </li>
  );
};


// Definimos HeaderProps vacío si este Header no va a recibir props especiales de las páginas
interface HeaderProps {
  // Si en el futuro necesitas pasarle props, las defines aquí.
  // Por ahora, como es un header global autocontenido, puede estar vacío.
}

const Header: React.FC<HeaderProps> = (/* No se desestructuran props aquí si no hay */) => {
  const { currentUser } = useAuthContext(); // Obtener currentUser del contexto
  const navigate = useNavigate();
  const { locale, setLocale } = useLanguage(); // Usar setLocale

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Podrías mostrar un mensaje de error al usuario
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    setLocale(newLocale); // Actualizar el estado del idioma
    // Aquí también deberías llamar a la lógica real de cambio de idioma de tu app
    console.log('Idioma cambiado a:', newLocale);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-30"> {/* Aumentado z-index */}
      <div className="container mx-auto flex flex-wrap items-center justify-between p-3 h-16 sm:h-14"> {/* Altura consistente */}
        {/* Logo y Nombre de la App */}
        <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center space-x-2 text-xl font-semibold hover:text-gray-300 transition-colors">
          <img src="/logo_tenis.png" alt="Logo Reserva Tenis" className="h-8 w-auto sm:h-9" /> {/* Ruta a tu logo */}
          <span className="hidden sm:inline">ReservaTenis</span> {/* Nombre de la App */}
        </Link>

        {/* Contenedor para todos los elementos de la derecha */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Menú de navegación principal */}
          <ul className="flex items-center space-x-1 sm:space-x-2">
            {/* <NavItem to="/" labelId="nav.home" defaultLabel="Inicio" /> */} {/* El logo ya lleva a inicio/dashboard */}
            <NavItem to="/courts" labelId="nav.courts" defaultLabel="Canchas" /> {/* Enlace a todas las canchas (público o protegido según tu lógica) */}
            <NavItem to="/bookings" labelId="nav.myBookings" defaultLabel="Mis Reservas" icon={FiList} show={!!currentUser} />
            <NavItem to="/login" labelId="nav.login" defaultLabel="Login" icon={FiLogIn} show={!currentUser} />
            <NavItem to="/register" labelId="nav.register" defaultLabel="Registro" icon={FiUserPlus} show={!currentUser} />
          </ul>

          {/* Selector de Idioma y Acciones de Usuario */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <FiGlobe size={18} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hidden sm:block pointer-events-none" />
              <select
                value={locale}
                onChange={handleLanguageChange}
                className="py-2 pl-3 pr-7 text-sm text-white bg-gray-700 border border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary hover:border-gray-500 sm:pl-8"
                aria-label="Seleccionar idioma"
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </div>

            {currentUser && (
              <div className="flex items-center space-x-2">
                {/* Saludo opcional si hay espacio */}
                {/* <span className="hidden lg:inline text-sm text-gray-300">
                  Hola, {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span> */}
                <Button
                  onClick={() => navigate('/profile')}
                  variant="ghost"
                  size="small"
                  className="!p-2 text-gray-300 hover:!bg-gray-700 hover:!text-white rounded-full" // Botón redondo
                  aria-label="Mi Perfil"
                >
                  <FiUser size={20} />
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="small"
                  className="!border-red-600 !text-red-400 hover:!bg-red-600 hover:!text-white !px-2 sm:!px-3" // Padding ajustado
                  aria-label="Cerrar sesión"
                >
                  <FiLogOut size={18} className="hidden sm:inline sm:mr-1.5" />
                  <span className="hidden sm:inline">Salir</span>
                  <FiLogOut size={18} className="sm:hidden" /> {/* Icono solo en móvil */}
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