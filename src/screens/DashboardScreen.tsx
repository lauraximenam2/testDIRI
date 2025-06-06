// src/screens/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import {
  FiCalendar,
  FiClock,
  FiPlusCircle,
  FiMapPin,
  FiInfo,
  FiActivity
} from 'react-icons/fi';
import { useAuthContext } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import { courtService } from '../services/courtService';
import { Booking } from '../models/booking';
import { Court } from '../models/court';
import { FormattedMessage, useIntl, FormattedDate } from 'react-intl'; 
import logger from '../services/logging';

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const intl = useIntl(); // Hook para internacionalización

  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);

  const [loadingFeaturedCourts, setLoadingFeaturedCourts] = useState(true);
  const [featuredCourts, setFeaturedCourts] = useState<Court[]>([]);
  const [errorUpcoming, setErrorUpcoming] = useState<string | null>(null);
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null);


  useEffect(() => {
    logger.debug("DashboardScreen montado", { state: null });
    return () => {
      logger.debug("DashboardScreen desmontado", { state: null });
    };
  }, []);


  const userName = currentUser?.displayName ||
                   currentUser?.email?.split('@')[0] ||
                   intl.formatMessage({ id: "general.userFallbackName" });

  // Cargamos la próxima reserva
  useEffect(() => {
    if (currentUser?.uid) {
      logger.info(`Dashboard: Cargando próxima reserva para usuario ${currentUser.uid}`, { bookingData: {} as Omit<Booking, "id" | "bookedAt" | "status"> });
      setLoadingUpcoming(true);
      setErrorUpcoming(null);
      bookingService.getUpcomingUserBookings(currentUser.uid, 1)
        .then(bookings => {
          if (bookings.length > 0) {
            setUpcomingBooking(bookings[0]);
            logger.info(
              `Dashboard: Próxima reserva encontrada para ${currentUser.uid}: ID ${bookings[0].id}`,
              { bookingData: { ...bookings[0] } as Omit<Booking, "id" | "bookedAt" | "status"> }
            );
          } else {
            setUpcomingBooking(null);
            logger.info(`Dashboard: No hay próximas reservas para ${currentUser.uid}`, { bookingData: {} as Omit<Booking, "id" | "bookedAt" | "status"> });
          }
        })
        .catch(error => {
          logger.error(`Dashboard: Error cargando próxima reserva para ${currentUser.uid}: ${error.message || String(error)}`, error);
          setErrorUpcoming(intl.formatMessage({ id: "dashboard.errorLoadingUpcomingBooking" }));
          setUpcomingBooking(null);
        })
        .finally(() => {
          setLoadingUpcoming(false);
        });
    } else {
      logger.info("Dashboard: No hay usuario logueado, no se carga próxima reserva.", { bookingData: {} as Omit<Booking, "id" | "bookedAt" | "status"> });
      setLoadingUpcoming(false);
      setUpcomingBooking(null);
    }
  }, [currentUser, intl]);

  // Cargamos canchas destacadas/populares
  useEffect(() => {
    logger.info("Dashboard: Cargando canchas destacadas.", { bookingData: {} as Omit<Booking, "id" | "bookedAt" | "status"> });
    setLoadingFeaturedCourts(true);
    setErrorFeatured(null);
    courtService.findCourtsByName('') // Trae todas las canchas
      .then(allCourts => {
        const destacadas = allCourts.sort(() => 0.5 - Math.random()).slice(0, 3);
        setFeaturedCourts(destacadas);
        logger.info(
          `Dashboard: ${destacadas.length} canchas destacadas cargadas.`,
          { bookingData: {} as Omit<Booking, "id" | "bookedAt" | "status"> }
        );
      })
      .catch(error => {
        logger.error(`Dashboard: Error cargando canchas destacadas: ${error.message || String(error)}`, error);
        setErrorFeatured(intl.formatMessage({ id: "dashboard.errorLoadingFeaturedCourts" }));
        setFeaturedCourts([]);
      })
      .finally(() => {
        setLoadingFeaturedCourts(false);
      });
  }, [intl]); 



  return (
    <div className="flex-grow">
      <section className="p-4 bg-gradient-to-r from-primary to-green-600 sm:p-6 md:p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            <FormattedMessage id="dashboard.greeting" values={{ name: userName }} />
          </h1>
          <p className="mt-2 text-green-100 sm:text-lg">
            <FormattedMessage id="dashboard.readyForNextMatch" />
          </p>
          <Button
            variant="secondary"
            size="large"
            onClick={() => navigate('/courts')}
            className="flex items-center justify-center w-full mt-6 space-x-2 shadow-md sm:w-auto sm:mx-auto hover:shadow-lg !bg-white !text-primary hover:!bg-gray-50"
          >
            <FiPlusCircle size={22} />
            <span><FormattedMessage id="dashboard.bookCourtButton" /></span>
          </Button>
        </div>
      </section>

      <div className="container p-4 mx-auto space-y-6 sm:p-6 md:space-y-8">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-700">
            <FormattedMessage id="dashboard.upcomingBookingTitle" />
          </h2>
          {loadingUpcoming && (
            <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md">
              <div className="flex justify-center items-center py-4">
                <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24" /* ... */></svg>
                <span className="ml-2 text-gray-600">
                  <FormattedMessage id="dashboard.loadingUpcomingBooking" />
                </span>
              </div>
            </div>
          )}
          {!loadingUpcoming && errorUpcoming && (
            <div role="alert" className="p-4 text-sm text-center text-red-700 bg-red-100 border border-red-300 rounded-md">
              {errorUpcoming} 
            </div>
          )}
          {!loadingUpcoming && !errorUpcoming && upcomingBooking && (
            <div
              className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer sm:flex-row hover:shadow-xl transition-shadow duration-300"
              onClick={() => navigate(`/bookings`)} // Llevamos a la lista completa de reservas
            >
              <div className="flex flex-col justify-between flex-grow p-4">
                <div>
                  <h3 className="mt-1 text-lg font-bold text-primary">
                    {upcomingBooking.courtName}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FiCalendar size={16} className="text-gray-500" />
                      <span>
                        <FormattedDate
                            value={new Date(upcomingBooking.date + 'T00:00:00Z')}
                            weekday="long"
                            day="numeric"
                            month="long"
                            timeZone="UTC"
                        />
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiClock size={16} className="text-gray-500" />
                      <span>{upcomingBooking.startTime}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <Button variant='link' size="small" className="!text-sm !font-semibold text-primary hover:text-primary-dark">
                    <FormattedMessage id="dashboard.viewAllBookingsButton" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          {!loadingUpcoming && !errorUpcoming && !upcomingBooking && (
            <div className="p-6 text-center bg-white border border-dashed border-gray-300 rounded-lg">
              <FiCalendar size={36} className="mx-auto mb-3 text-gray-400" />
              <p className="text-lg text-gray-600"><FormattedMessage id="dashboard.noUpcomingBookings" /></p>
              <p className="text-sm text-gray-500"><FormattedMessage id="dashboard.planNextMatch" /></p>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-700">
            <FormattedMessage id="dashboard.featuredCourtsTitle" />
          </h2>
          {loadingFeaturedCourts && (
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md animate-pulse">
                  <div className="w-full h-32 mb-3 bg-gray-300 rounded-md sm:h-36"></div>
                  <div className="w-3/4 h-4 mb-2 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          )}
          {!loadingFeaturedCourts && errorFeatured && (
            <div role="alert" className="p-4 text-sm text-center text-red-700 bg-red-100 border border-red-300 rounded-md">
              {errorFeatured} 
            </div>
          )}
          {!loadingFeaturedCourts && !errorFeatured && featuredCourts.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourts.map(court => (
                <div
                  key={court.id}
                  className="flex flex-col justify-between p-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer group hover:shadow-xl transition-shadow duration-300"
                  onClick={() => navigate(`/courts/${court.id}/booking`, { state: { courtName: court.name, hourlyRate: court.hourlyRate } })} // Pasar hourlyRate
                >
                  <img src={court.img || "/placeholder-court-default.jpg"} alt={court.name} className="object-cover w-full mb-3 rounded-md h-32 sm:h-36 group-hover:scale-105 transition-transform duration-300" />
                  <div>
                    <h4 className="font-semibold text-gray-800 truncate text-md">
                      {court.name}
                    </h4>
                    <p className="flex items-center mt-1 text-xs text-gray-500">
                      <FiMapPin size={12} className="mr-1 shrink-0" /> {court.location}
                    </p>
                  </div>
                  <div className="mt-3 text-right">
                    <Button variant='outline' size="small" className="!text-sm !border-primary !text-primary hover:!bg-primary hover:!text-white">
                      <FormattedMessage id="dashboard.viewSchedulesButton" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loadingFeaturedCourts && !errorFeatured && featuredCourts.length === 0 && (
            <div className="p-6 text-center bg-white border border-dashed border-gray-300 rounded-lg">
              <FiActivity size={36} className="mx-auto mb-3 text-gray-400" />
              <p className="text-lg text-gray-600"><FormattedMessage id="dashboard.noFeaturedCourts" /></p>
              <p className="text-sm text-gray-500">
                <FormattedMessage id="dashboard.exploreAllCourts" />{' '}
                <button onClick={() => navigate('/courts')} className="font-medium text-primary hover:underline">
                  <FormattedMessage id="dashboard.availableCourtsLink" />
                </button>.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardScreen;