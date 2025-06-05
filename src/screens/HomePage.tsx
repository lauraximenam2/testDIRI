// src/screens/HomePage.tsx
import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/Button';
import { FiUserPlus, FiLogIn } from 'react-icons/fi';

// Simulación del hook useAuth para este ejemplo
const useAuth = () => {
  return { user: null }; // Usuario no logueado
};
// Simulación de FormattedMessage
const FormattedMessage: React.FC<{ id: string; defaultMessage: string }> = ({ defaultMessage }) => <>{defaultMessage}</>;
// Fin de simulaciones

const HomePage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    console.log("Entrando a HomePage (usuario no autenticado)");
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