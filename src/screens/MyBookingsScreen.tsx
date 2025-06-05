// src/screens/MyBookingsScreen.tsx
import React, { useState, useEffect, Fragment } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import Button from '../components/Button'; 
import { Tab } from '@headlessui/react'; 
import {
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiClock,
  FiAlertCircle, 
  FiInfo, 
  FiPlusSquare 
} from 'react-icons/fi';

// Interfaz para Reserva
interface Booking {
  id: string;
  courtName: string;
  date: string;
  time: string;
  status: 'Confirmada' | 'Completada' | 'Cancelada';
}


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const MyBookingsScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);

  // Mensaje de confirmación
  useEffect(() => {
    if (location.state?.bookingConfirmed) {
      setShowConfirmationMsg(true);
      const timer = setTimeout(() => setShowConfirmationMsg(false), 5000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Simulación carga de todas las reservas 
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const allBookingsData: Booking[] = [
        { id: '123', courtName: 'Cancha Central', date: '2024-08-15', time: '10:00', status: 'Confirmada' },
        { id: '124', courtName: 'Pista Rápida 1', date: '2024-08-20', time: '16:00', status: 'Confirmada' },
        { id: '101', courtName: 'Pista Rápida 1', date: '2024-08-10', time: '15:00', status: 'Completada' },
        { id: '98', courtName: 'Cancha Central', date: '2024-08-05', time: '09:00', status: 'Cancelada' },
        { id: '95', courtName: 'Indoor 1', date: '2024-07-28', time: '19:00', status: 'Completada' },
      ];

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); 

      const upcoming = allBookingsData
        .filter(b => {
          const bookingDate = new Date(b.date); 
       
          const bookingDateUTC = new Date(Date.UTC(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()));
          return b.status === 'Confirmada' && bookingDateUTC >= today;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const history = allBookingsData
        .filter(b => {
          const bookingDate = new Date(b.date);
          const bookingDateUTC = new Date(Date.UTC(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()));
          return b.status !== 'Confirmada' || bookingDateUTC < today;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setUpcomingBookings(upcoming);
      setHistoryBookings(history);
      setLoading(false);
    }, 500);
  }, []); // Cargar solo una vez al montar el componente

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      console.log("Cancelando reserva:", id);
    }
  };

  const getStatusInfo = (status: Booking['status']): { icon: React.ElementType, badgeClass: string, label: string } => {
    switch (status) {
      case 'Confirmada': return { icon: FiCheckCircle, badgeClass: 'bg-green-100 text-green-700', label: 'Confirmada' };
      case 'Completada': return { icon: FiCheckCircle, badgeClass: 'bg-blue-100 text-blue-700', label: 'Completada' };
      case 'Cancelada': return { icon: FiXCircle, badgeClass: 'bg-red-100 text-red-700 line-through', label: 'Cancelada' };
      default: return { icon: FiAlertCircle, badgeClass: 'bg-yellow-100 text-yellow-700', label: 'Desconocido' };
    }
  };

  const renderBookingList = (list: Booking[], listType: 'upcoming' | 'history') => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <svg className="w-6 h-6 mr-3 animate-spin text-primary" /* ... spinner SVG ... */></svg>
          Cargando reservas...
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="py-10 text-center text-gray-500">
          <FiInfo size={40} className="mx-auto mb-4 text-gray-400" />
          <p className="mb-4">No tienes reservas {listType === 'upcoming' ? 'próximas' : 'en el historial'}.</p>
          {listType === 'upcoming' && (
            <Button variant="secondary" onClick={() => navigate('/courts')} className="inline-flex items-center space-x-2">
              <FiPlusSquare size={18} />
              <span>Reservar Ahora</span>
            </Button>
          )}
        </div>
      );
    }
    return (
      <ul className="space-y-4">
        {list.map(booking => {
          const statusInfo = getStatusInfo(booking.status);
          return (
            <li key={booking.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">{booking.courtName}</h3>
                  <p className="flex items-center mt-1 text-sm text-gray-600">
                    <FiCalendar size={15} className="mr-1.5 text-gray-500" /> {formatDate(booking.date)}
                    <FiClock size={15} className="ml-3 mr-1.5 text-gray-500" /> {booking.time}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.badgeClass}`}
                >
                  <statusInfo.icon size={14} className="mr-1 -ml-0.5" />
                  {statusInfo.label}
                </span>
              </div>
              {booking.status === 'Confirmada' && listType === 'upcoming' && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                  <Button variant="error" size="small" onClick={() => handleCancelBooking(booking.id)}>
                    Cancelar Reserva
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-16"> 
      <header className="sticky top-0 z-10 p-4 text-center bg-white border-b border-gray-200 shadow-sm h-14 flex items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-800">Mis Reservas</h2>
      </header>

      {/* Mensaje de confirmación global */}
      {showConfirmationMsg && (
        <div
          role="alert"
          className="sticky top-14 z-10 flex items-center justify-center p-3 space-x-2 font-medium text-white bg-green-500 shadow" // Estilo para el mensaje
        >
          <FiCheckCircle size={20} />
          <span>¡Tu reserva ha sido confirmada con éxito!</span>
        </div>
      )}

      <div className="w-full max-w-3xl px-2 py-4 mx-auto sm:px-4">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-gray-200 rounded-xl">
            {['Próximas', 'Historial'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors duration-150',
                    'focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary ring-opacity-60',
                    selected
                      ? 'bg-primary text-white shadow'
                      : 'text-gray-700 hover:bg-white/[0.7] hover:text-primary'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel
              className={classNames(
                'p-0.5 focus:outline-none', 
              )}
            >
              {renderBookingList(upcomingBookings, 'upcoming')}
            </Tab.Panel>
            <Tab.Panel
              className={classNames('p-0.5 focus:outline-none')}
            >
              {renderBookingList(historyBookings, 'history')}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      
    </div>
  );
};

export default MyBookingsScreen;