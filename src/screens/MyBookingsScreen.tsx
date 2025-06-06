// src/screens/MyBookingsScreen.tsx
import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Tab } from '@headlessui/react';
import {
  FiCheckCircle, FiXCircle, FiCalendar, FiClock,
  FiAlertCircle, FiInfo, FiPlusSquare, FiRefreshCw
} from 'react-icons/fi';
import { useAuthContext } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../models/booking';
import { FormattedMessage, useIntl, FormattedDate } from 'react-intl'; 
import { useLanguageContext } from '../contexts/LanguageContext'; 

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const MyBookingsScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const intl = useIntl(); // Hook de internacionalización
  const { locale } = useLanguageContext(); // Para formatear fechas

  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.bookingConfirmed) {
      setShowConfirmationMsg(true);
      const timer = setTimeout(() => setShowConfirmationMsg(false), 5000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const fetchUserBookings = React.useCallback(async () => { 
    if (!currentUser) {
      setLoading(false);
      setError(intl.formatMessage({ id: "myBookings.error.mustBeLoggedIn" }));
      setUpcomingBookings([]);
      setHistoryBookings([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const allUserBookings = await bookingService.getUserBookings(currentUser.uid);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const upcoming = allUserBookings.filter(b => {
        const bookingDate = new Date(b.date + 'T00:00:00Z'); 
        return b.status === 'Confirmada' && bookingDate >= today;
      });
      const history = allUserBookings.filter(b => {
        const bookingDate = new Date(b.date + 'T00:00:00Z'); 
        return b.status !== 'Confirmada' || bookingDate < today;
      });
      setUpcomingBookings(upcoming);
      setHistoryBookings(history);
    } catch (err: any) {
      console.error("Error fetching user bookings:", err);
      setError(err.message || intl.formatMessage({ id: "myBookings.error.couldNotLoad" }));
    } finally {
      setLoading(false);
    }
  }, [currentUser, intl]); 

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]); 


  const handleCancelBooking = async (booking: Booking) => {
    if (!currentUser || !booking.id) return;

    // Formateamos fecha para el prompt de confirmación
    const dateForPrompt = new Date(booking.date + 'T00:00:00Z');
    const formattedDateForPrompt = new Intl.DateTimeFormat(locale, {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    }).format(dateForPrompt);

    if (window.confirm(
        intl.formatMessage(
            { id: 'myBookings.cancelConfirmationPrompt' },
            { courtName: booking.courtName, date: formattedDateForPrompt, time: booking.startTime }
        )
    )) {
      setCancellingId(booking.id);
      try {
        await bookingService.cancelBooking(booking.id, currentUser.uid, booking.courtId, booking.date, booking.startTime);
        setUpcomingBookings(prev => prev.filter(b => b.id !== booking.id));
        setHistoryBookings(prev => [{ ...booking, status: "Cancelada" as Booking["status"] }, ...prev]
          .sort((a, b) => new Date(`${b.date}T${b.startTime || '00:00'}`).getTime() - new Date(`${a.date}T${a.startTime || '00:00'}`).getTime()));
        alert(intl.formatMessage({ id: "myBookings.cancelSuccessAlert" }));
      } catch (error: any) {
        console.error("Error cancelando reserva:", error);
        alert(intl.formatMessage({ id: "myBookings.cancelErrorAlert" }, { error: error.message || intl.formatMessage({id: "myBookings.status.Unknown"}) }));
      } finally {
        setCancellingId(null);
      }
    }
  };


  const getStatusInfo = (status: Booking['status']): { icon: React.ElementType, badgeClass: string, label: string } => {
    const statusKey = `myBookings.status.${status || 'Unknown'}` as const; 
    const label = intl.formatMessage({ id: statusKey, defaultMessage: status || intl.formatMessage({id: "myBookings.status.Unknown"}) });

    switch (status) {
      case 'Confirmada': return { icon: FiCheckCircle, badgeClass: 'bg-green-100 text-green-700', label };
      case 'Completada': return { icon: FiCheckCircle, badgeClass: 'bg-blue-100 text-blue-700', label };
      case 'Cancelada': return { icon: FiXCircle, badgeClass: 'bg-red-100 text-red-700 line-through', label };
      default: return { icon: FiAlertCircle, badgeClass: 'bg-yellow-100 text-yellow-700', label };
    }
  };

  const renderBookingList = (list: Booking[], listType: 'upcoming' | 'history') => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg className="w-10 h-10 mb-3 text-primary animate-spin"></svg>
          <FormattedMessage id="myBookings.loading" />
        </div>
      );
    }
    if (error && list.length === 0) {
      return (
        <div className="py-10 text-center text-red-600">
          <FiAlertCircle size={40} className="mx-auto mb-4" />
          <p className="mb-4 font-semibold">{error}</p> 
          <Button variant="outline" onClick={fetchUserBookings} className="inline-flex items-center space-x-2">
            <FiRefreshCw size={16} />
            <span><FormattedMessage id="myBookings.retryButton" /></span>
          </Button>
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="py-10 text-center text-gray-500">
          <FiInfo size={40} className="mx-auto mb-4 text-gray-400" />
          <p className="mb-4 text-lg">
            <FormattedMessage id={listType === 'upcoming' ? "myBookings.noUpcomingBookings" : "myBookings.noHistoryBookings"} />
          </p>
          {listType === 'upcoming' && (
            <Button variant="primary" onClick={() => navigate('/courts')} className="inline-flex items-center space-x-2 shadow-md">
              <FiPlusSquare size={18} />
              <span><FormattedMessage id="myBookings.bookNowButton" /></span>
            </Button>
          )}
        </div>
      );
    }
    return (
      <ul className="space-y-4">
        {list.map(booking => {
          const statusInfo = getStatusInfo(booking.status);
          const isCancellingThis = cancellingId === booking.id;
          return (
            <li key={booking.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">{booking.courtName}</h3>
                  <p className="flex flex-wrap items-center mt-1 text-sm text-gray-600">
                    <FiCalendar size={15} className="mr-1.5 text-gray-500 shrink-0" />
                    <span className="mr-3">
                        <FormattedDate
                            value={new Date(booking.date + 'T00:00:00Z')} 
                            year="numeric" month="long" day="numeric" timeZone="UTC"
                        />
                    </span>
                    <FiClock size={15} className="mr-1.5 text-gray-500 shrink-0" />
                    <span>{booking.startTime}</span>
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap mt-2 sm:mt-0 ${statusInfo.badgeClass}`}>
                  <statusInfo.icon size={14} className="mr-1 -ml-0.5" />
                  {statusInfo.label} 
                </span>
              </div>
              {booking.status === 'Confirmada' && listType === 'upcoming' && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                  <Button
                    variant="error" size="small" onClick={() => handleCancelBooking(booking)}
                    disabled={isCancellingThis} className="inline-flex items-center justify-center"
                  >
                    {isCancellingThis ? (<svg className="w-4 h-4 mr-1.5 animate-spin" /* ... */></svg>) : (<FiXCircle size={14} className="mr-1.5" />)}
                    {isCancellingThis
                        ? <FormattedMessage id="myBookings.cancellingButton" />
                        : <FormattedMessage id="myBookings.cancelButton" />
                    }
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Nombres de las pestañas
  const tabCategories = [
    { key: 'upcoming', name: intl.formatMessage({ id: "myBookings.tab.upcoming" }) },
    { key: 'history', name: intl.formatMessage({ id: "myBookings.tab.history" }) },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-16">
      <header className="sticky top-0 z-10 p-4 text-center bg-white border-b border-gray-200 shadow-sm h-14 flex items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-800">
          <FormattedMessage id="myBookings.title" />
        </h2>
      </header>

      {showConfirmationMsg && (
        <div role="alert" className="sticky top-14 z-10 flex items-center justify-center p-3 space-x-2 font-medium text-white bg-green-500 shadow">
          <FiCheckCircle size={20} />
          <span><FormattedMessage id="myBookings.bookingConfirmedMsg" /></span>
        </div>
      )}

      <div className="w-full max-w-3xl px-2 py-4 mx-auto sm:px-4">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-gray-200 rounded-xl">
            {tabCategories.map((category) => (
              <Tab key={category.key}
                className={({ selected }) => classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors duration-150',
                  'focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary ring-opacity-60',
                  selected ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-white/[0.7] hover:text-primary'
                )}
              >
                {category.name} 
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="focus:outline-none">
              {renderBookingList(upcomingBookings, 'upcoming')}
            </Tab.Panel>
            <Tab.Panel className="focus:outline-none">
              {renderBookingList(historyBookings, 'history')}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default MyBookingsScreen;
