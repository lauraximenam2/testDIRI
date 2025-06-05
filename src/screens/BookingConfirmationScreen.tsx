// src/screens/BookingConfirmationScreen.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Link no se usa directamente aquí
import Button from '../components/Button'; // Tu componente Button con Tailwind
import { FiArrowLeft, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'; // FiAlertTriangle para errores

const BookingConfirmationScreen: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { courtName, date, time } = location.state || { courtName: `Cancha ${courtId}`, date: 'N/A', time: 'N/A' };

  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookingDetails = {
    court: courtName,
    formattedDate: date !== 'N/A' ? new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
    time: time,
    duration: '1 hora', // Asumido
    price: '€15.00',   // Simulado
  };
  
  
  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    setError(null);
    console.log('Confirmando reserva:', bookingDetails);
     try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.1;
      if (success) {
        navigate('/bookings', { state: { bookingConfirmed: true, details: bookingDetails } });
      } else {
        throw new Error('No se pudo confirmar la reserva. Inténtalo de nuevo.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
      setIsConfirming(false);
    }
  };

  return (
    // Contenedor principal de la pantalla
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header de la Pantalla */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm sm:p-4 h-14">
        <Button
          variant='ghost'
          size='small'
          onClick={() => navigate(-1)} // Volver a la pantalla anterior
          className="!p-1.5 sm:!p-2 text-gray-600 hover:text-gray-900"
          disabled={isConfirming}
          aria-label="Volver o Cancelar"
        >
          <FiArrowLeft size={22} strokeWidth={2} />
          <span className="hidden ml-1 sm:inline">Volver</span>
        </Button>
        <h2 className="text-lg font-semibold text-center text-gray-800 flex-grow truncate px-2">
          Confirma tu Reserva
        </h2>
        {/* Espaciador para centrar el título si el botón izquierdo es más grande que el derecho (si hubiera) */}
        <div className="min-w-[60px] sm:min-w-[80px]"></div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-lg p-6 space-y-6 text-center bg-white rounded-lg shadow-xl sm:p-8">
          <FiCheckCircle size={56} className="mx-auto text-green-500" aria-hidden="true" />
          <h3 className="text-2xl font-semibold text-gray-800">
            ¡Casi listo! Revisa los detalles:
          </h3>

          {/* Card de Detalles de la Reserva */}
          <div className="p-4 space-y-2 text-left bg-gray-50 border border-gray-200 rounded-md sm:p-6">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Cancha:</span>
              <span className="font-semibold text-gray-800">{bookingDetails.court}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Fecha:</span>
              <span className="text-gray-700">{bookingDetails.formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Hora:</span>
              <span className="text-gray-700">{bookingDetails.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Duración:</span>
              <span className="text-gray-700">{bookingDetails.duration}</span>
            </div>
            <hr className="my-3 border-gray-200" />
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold text-gray-600">Precio Total:</span>
              <span className="text-xl font-bold text-primary">{bookingDetails.price}</span>
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div role="alert" className="flex items-center p-3 space-x-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
              <FiAlertTriangle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Botón de Confirmación */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={handleConfirmBooking}
            disabled={isConfirming}
            className="mt-4 shadow-lg hover:shadow-xl" // Margen superior para separarlo
          >
            {isConfirming ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirmando...
              </div>
            ) : (
              'Confirmar Reserva'
            )}
          </Button>
        </div>
      </main>
      
    </div>
  );
};

export default BookingConfirmationScreen;