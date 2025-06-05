// src/screens/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import {
  FiUser, // No se usa directamente aquí si el Header global lo maneja
  FiCalendar,
  FiClock,
  FiBell, // No se usa directamente aquí si el Header global lo maneja
  FiPlusCircle,
  FiStar,
  FiMapPin,
  FiInfo
} from 'react-icons/fi';
// No importamos Header aquí si se renderiza desde App.tsx

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const userName = "Laura"; // Simulado, obtén esto del estado de autenticación

  const [loading, setLoading] = useState(true); // Estado para la carga general del dashboard
  const [upcomingBookingData, setUpcomingBookingData] = useState<any>(null); // Tipar mejor con tu interfaz Booking
  const [favoriteCourtsData, setFavoriteCourtsData] = useState<any[]>([]); // Tipar mejor con tu interfaz Court

  // Simulación de si el usuario tiene o no estos datos
  const userHasUpcomingBookings = true;
  const userHasFavoriteCourts = true;

  useEffect(() => {
    setLoading(true);
    // Simular carga de datos del dashboard
    setTimeout(() => {
      if (userHasUpcomingBookings) {
        setUpcomingBookingData({
          id: '123',
          courtName: 'Pista Central Club Alpha',
          date: '2024-08-15',
          time: '10:00',
          surface: 'Tierra Batida',
          img: '/placeholder-court-fav.jpg' // Imagen para la card
        });
      } else {
        setUpcomingBookingData(null);
      }

      if (userHasFavoriteCourts) {
        setFavoriteCourtsData([
          { id: 2, name: 'Pista Rápida Norte', location: 'Anexo Deportivo Norte', img: '/placeholder-court1.jpg' },
          { id: 3, name: 'Cancha Cubierta Sur', location: 'Complejo Sur', img: '/placeholder-court2.jpg' },
        ]);
      } else {
        setFavoriteCourtsData([]);
      }
      setLoading(false);
    }, 700); // Simular un pequeño delay de carga
  }, []); // Ejecutar solo una vez al montar el componente

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    // Contenedor principal de la pantalla.
    // Si App.tsx > main ya tiene padding para Header/BottomNav, este div puede ser más simple.
    // Si esta pantalla necesita su propio fondo o padding específico, añádelo aquí.
    // Asumimos que App.tsx ya maneja el padding para el Header y BottomNav globales.
    <div className="flex-grow"> {/* Ocupa el espacio restante que deja el Header y BottomNav */}
      
      {/* Saludo y CTA Principal */}
      <section className="p-4 bg-gradient-to-r from-primary to-green-600 sm:p-6 md:p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            ¡Hola, {userName}!
          </h1>
          <p className="mt-2 text-green-100 sm:text-lg">
            ¿Listo/a para tu próximo partido?
          </p>
          <Button
            variant="secondary"
            size="large"
            onClick={() => navigate('/courts')}
            className="flex items-center justify-center w-full mt-6 space-x-2 shadow-md sm:w-auto sm:mx-auto hover:shadow-lg !bg-white !text-primary hover:!bg-gray-50"
          >
            <FiPlusCircle size={22} />
            <span>Reservar una Cancha</span>
          </Button>
        </div>
      </section>

      {/* Contenido del Dashboard con padding */}
      <div className="container p-4 mx-auto space-y-6 sm:p-6 md:space-y-8">
        {/* Sección de Próxima Reserva */}
        {loading && !upcomingBookingData && ( // Mostrar skeleton/spinner solo si no hay datos aún y está cargando
          <section className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="flex justify-center items-center py-4">
              <svg className="w-6 h-6 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-600">Cargando tu próxima reserva...</span>
            </div>
          </section>
        )}

        {!loading && upcomingBookingData && (
          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-700">
              Tu Próxima Reserva
            </h2>
            <div
              className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer sm:flex-row hover:shadow-xl transition-shadow duration-300"
              onClick={() => navigate(`/bookings/${upcomingBookingData.id}`)}
            >
              {upcomingBookingData.img && (
                <img src={upcomingBookingData.img} alt={upcomingBookingData.courtName} className="object-cover w-full h-40 sm:w-48 sm:h-auto" />
              )}
              <div className="flex flex-col justify-between flex-grow p-4">
                <div>
                  <span className="px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-accent">
                    {upcomingBookingData.surface}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-primary">
                    {upcomingBookingData.courtName}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FiCalendar size={16} className="text-gray-500" />
                      <span>{formatDate(upcomingBookingData.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiClock size={16} className="text-gray-500" />
                      <span>{upcomingBookingData.time}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <Button variant='link' size="small" className="!text-sm !font-semibold text-primary hover:text-primary-dark">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {!loading && !upcomingBookingData && (
          <section className="p-6 text-center bg-white border border-dashed border-gray-300 rounded-lg">
            <FiCalendar size={36} className="mx-auto mb-3 text-gray-400" />
            <p className="text-lg text-gray-600">No tienes reservas próximas.</p>
            <p className="text-sm text-gray-500">¡Es un buen momento para planificar tu siguiente partido!</p>
          </section>
        )}

        {/* Sección de Canchas Favoritas/Recomendadas */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-700">
            {userHasFavoriteCourts ? "Tus Canchas Favoritas" : "Canchas Recomendadas"}
          </h2>
          {loading && favoriteCourtsData.length === 0 && ( // Mostrar skeletons solo si está cargando y no hay datos aún
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md animate-pulse">
                  <div className="w-full h-32 mb-3 bg-gray-300 rounded-md sm:h-36"></div> {/* Ajustado tamaño de skeleton de imagen */}
                  <div className="w-3/4 h-4 mb-2 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && favoriteCourtsData.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteCourtsData.map(court => (
                <div
                  key={court.id}
                  className="flex flex-col justify-between p-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer group hover:shadow-xl transition-shadow duration-300"
                  onClick={() => navigate(`/courts/${court.id}/booking`)}
                >
                  <img src={court.img} alt={court.name} className="object-cover w-full mb-3 rounded-md h-32 sm:h-36 group-hover:scale-105 transition-transform duration-300" />
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 truncate">
                      {court.name}
                    </h4>
                    <p className="flex items-center mt-1 text-xs text-gray-500">
                      <FiMapPin size={12} className="mr-1" /> {court.location}
                    </p>
                  </div>
                  <div className="mt-3 text-right">
                    <Button variant='outline' size="small" className="!text-sm !border-primary !text-primary hover:!bg-primary hover:!text-white">
                      Ver Horarios
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && favoriteCourtsData.length === 0 && (
            <div className="p-6 text-center bg-white border border-dashed border-gray-300 rounded-lg">
              <FiStar size={36} className="mx-auto mb-3 text-yellow-400" />
              <p className="text-lg text-gray-600">
                {userHasFavoriteCourts ? "Aún no tienes canchas favoritas." : "Explora y encuentra tu cancha ideal."}
              </p>
              <p className="text-sm text-gray-500">
                {userHasFavoriteCourts ? "Marca una cancha como favorita para accederla rápidamente." : "¡Tenemos muchas opciones para ti!"}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardScreen;