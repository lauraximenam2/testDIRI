// src/screens/HomePage.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom'; 
import Button from '../components/Button';
import { FiUserPlus, FiLogIn } from 'react-icons/fi';
import { useAuthContext } from '../contexts/AuthContext'; 
import { FormattedMessage } from 'react-intl'; 
import logger from '../services/logging';

const HomePage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuthContext();

  useEffect(() => {
    // log general de montaje para saber que el componente se está renderizando
    logger.debug("HomePage montado", { state: null });

    // loguear el estado de autenticación cuando se resuelva
    if (!authLoading) {
      if (currentUser) {
        logger.info("HomePage: Usuario autenticado, redirigiendo a /dashboard.", { bookingData: {} as Omit<any, "id" | "bookedAt" | "status"> });
      } else {
        logger.info("HomePage: Usuario no autenticado, mostrando página de inicio.", { bookingData: {} as Omit<any, "id" | "bookedAt" | "status"> });
      }
    }
    return () => {
      logger.debug("HomePage desmontado", { state: null });
    };
  }, [currentUser, authLoading]); 

  if (authLoading) {
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        
        <svg className="w-12 h-12 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // Si el usuario está autenticado (y la carga de auth ha terminado), redirigir al dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si el usuario no está autenticado y la carga de auth ha terminado, mostrar la HomePage
  useEffect(() => {
    console.log("Entrando a HomePage (usuario no autenticado y auth resuelta)");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary via-green-400 to-secondary p-6 text-center">
      <div className="bg-white/90 backdrop-blur-md p-8 sm:p-12 rounded-xl shadow-2xl max-w-2xl">
        <img src="/logo_tenis.png" alt="Logo Reserva Tenis" className="w-24 h-24 mx-auto mb-6 sm:w-32 sm:h-32" />
        <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl lg:text-6xl">
          <FormattedMessage id="landing.title" defaultMessage="Reserva Tu Cancha de Tenis" />
        </h1>
        <p className="mt-4 text-lg text-gray-600 sm:mt-6 sm:text-xl">
          <FormattedMessage
            id="landing.description"
            defaultMessage="Encuentra y reserva canchas de tenis cerca de ti de forma rápida y sencilla. ¡Empieza a jugar hoy mismo!"
          />
        </p>

        <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
          <Button
            as="link"
            to="/register"
            variant="primary"
            size="large"
            className="w-full sm:w-auto shadow-lg hover:shadow-xl !text-lg"
          >
            <FiUserPlus size={20} className="mr-2" />
            <FormattedMessage id="landing.registerButton" defaultMessage="Crear Cuenta Gratis" />
          </Button>
          <Button
            as="link"
            to="/login"
            variant="outline"
            size="large"
            className="w-full sm:w-auto shadow-lg hover:shadow-xl !border-primary hover:!bg-primary hover:!text-white !text-lg"
          >
            <FiLogIn size={20} className="mr-2" />
            <FormattedMessage id="landing.loginButton" defaultMessage="Ya tengo cuenta" />
          </Button>
        </div>

        <p className="mt-10 text-xs text-gray-500">
          <FormattedMessage id="landing.featureHighlight" defaultMessage="Busca por ubicación, tipo de superficie y horarios disponibles." />
        </p>
      </div>
    </div>
  );
};

export default HomePage;