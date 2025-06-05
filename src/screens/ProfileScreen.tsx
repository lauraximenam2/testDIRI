// src/screens/ProfileScreen.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button'; 
import {
    FiUser, FiEdit2, FiCalendar, FiLock, 
    FiHelpCircle, FiChevronRight, FiLogOut, 
} from 'react-icons/fi';
import Header from '../components/Header'; 

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = {
    name: "Laura Martínez",
    email: "laura.m@example.com",
    avatar: null // "/placeholder-avatar.png" 
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      console.log('Cerrando sesión...');
      navigate('/login');
    }
  };

  const profileOptions = [
    { label: 'Mis Reservas', path: '/bookings', icon: FiCalendar },
    { label: 'Editar Perfil', path: '/profile/edit', icon: FiEdit2 },
    { label: 'Cambiar Contraseña', path: '/profile/change-password', icon: FiLock },
    { label: 'Ayuda y Soporte', path: '/help', icon: FiHelpCircle },
  ];

  return (
    // Contenedor principal de la pantalla
    <div className="flex flex-col min-h-screen bg-gray-100 pb-16">
      <Header
      />

      {/* Contenido Principal */}
      <main className="flex-grow p-4 sm:p-6 space-y-6 md:space-y-8">
        {/* Sección de Información del Usuario */}
        <section className="flex flex-col items-center p-6 space-y-4 text-center bg-white border border-gray-200 rounded-xl shadow-lg sm:flex-row sm:text-left sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar del usuario"
                className="object-cover w-20 h-20 rounded-full shadow-md sm:w-24 sm:h-24 ring-2 ring-offset-2 ring-primary"
              />
            ) : (
              <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full shadow-md sm:w-24 sm:h-24 ring-2 ring-offset-1 ring-gray-300">
                <FiUser size={36} className="text-gray-500 sm:size-44" />
              </div>
            )}
             
            <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/profile/edit')}
                aria-label="Editar perfil"
                className="absolute -bottom-2 -right-2 !p-2 bg-white rounded-full shadow-md hover:bg-gray-100 sm:static sm:ml-auto sm:self-start sm:-mt-0 sm:mr-0" // Posicionamiento diferente para móvil y desktop
            >
                <FiEdit2 size={18} className="text-primary" />
            </Button>
          </div>

          {/* Nombre y Email */}
          <div className="flex-grow min-w-0">
            <h2 className="text-xl font-bold text-gray-800 truncate sm:text-2xl">{user.name}</h2>
            <p className="text-sm text-gray-600 truncate sm:text-base">{user.email}</p>
          </div>
        </section>

        {/* Lista de Opciones de Navegación */}
        <nav className="bg-white border border-gray-200 rounded-lg shadow-md">
          {profileOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Link
                key={option.path}
                to={option.path}
                className={`flex items-center justify-between p-4 text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-primary focus:outline-none focus-visible:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary
                            ${index < profileOptions.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent size={20} className="text-gray-500" />
                  <span className="font-medium">{option.label}</span>
                </div>
                <FiChevronRight size={20} className="text-gray-400" />
              </Link>
            );
          })}
        </nav>

        {/* Sección de Cerrar Sesión */}
        <div className="pt-4">
          <Button
            variant="error"
            fullWidth
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 shadow hover:shadow-md"
          >
            <FiLogOut size={18} />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;