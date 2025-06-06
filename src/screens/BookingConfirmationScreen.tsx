// src/screens/BookingConfirmationScreen.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { FiArrowLeft, FiCheckCircle, FiAlertTriangle, FiClock, FiCalendar, FiTag, FiDollarSign } from 'react-icons/fi';
import { useAuthContext } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../models/booking';
import { FormattedMessage, useIntl, FormattedDate, FormattedNumber } from 'react-intl'; 
import { useLanguageContext } from '../contexts/LanguageContext'; 
import logger from '../services/logging';


const calculateEndTime = (startTime: string, durationHours: number = 1): string => {
  if (!startTime || !startTime.includes(':')) {
    logger.warn("calculateEndTime: startTime inválido o ausente.", { startTime });
    return "N/A";
  }

  const [hours, minutes] = startTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    logger.warn("calculateEndTime: horas o minutos inválidos después de parsear.", { startTime });
    return "N/A";
  }

  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  startDate.setHours(startDate.getHours() + durationHours);
  return `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
};

const BookingConfirmationScreen: React.FC = () => {
  const { courtId: paramCourtId } = useParams<{ courtId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const intl = useIntl();
  const { locale } = useLanguageContext(); 

  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log de montaje y desmontaje
  useEffect(() => {
    logger.debug("BookingConfirmationScreen montado", { state: location.state });
    return () => {
      logger.debug("BookingConfirmationScreen desmontado", { state: location.state });
    };
  }, [location.state]); 


  const {
    courtIdFromState,
    courtName: courtNameFromState = intl.formatMessage({ id: "dateTimeSelection.courtUnknown" }), 
    date: dateISO = 'N/A',
    time: startTime = 'N/A',
    timeRange = 'N/A',
    hourlyRate = undefined 
  } = location.state || {};

  const courtId = paramCourtId || courtIdFromState;
  const courtName = courtNameFromState || (courtId ? `${intl.formatMessage({id: "booking.court"})} ${courtId}` : intl.formatMessage({id: "dateTimeSelection.courtUnknown"}));
  const canProceed = currentUser && courtId && dateISO !== 'N/A' && startTime !== 'N/A' && typeof hourlyRate === 'number';
  const displayDateObject = dateISO !== 'N/A' ? new Date(dateISO + 'T00:00:00Z') : null;


  useEffect(() => {
    if (!currentUser) {
      setError(intl.formatMessage({ id: "booking.error.notLoggedIn" }));
    } else if (!courtId || dateISO === 'N/A' || startTime === 'N/A' || typeof hourlyRate !== 'number') {
      setError(intl.formatMessage({ id: "booking.error.missingBookingDetails" }));
    } else {
        setError(null); 
    }
  }, [currentUser, courtId, dateISO, startTime, hourlyRate, intl, location]);


  const handleConfirmBooking = async () => {
    logger.info("BookingConfirmationScreen: Iniciando proceso de confirmación de reserva.", { bookingData: {} as Omit<Booking, 'id' | 'bookedAt' | 'status'> });
    if (!canProceed) {
      const errorMsg = !currentUser ? intl.formatMessage({ id: "booking.error.notLoggedIn" }) : intl.formatMessage({ id: "booking.error.missingBookingDetails" });
      logger.warn("BookingConfirmationScreen: Intento de confirmar sin cumplir requisitos.", { startTime });
      setError(errorMsg);
      setIsConfirming(false);
      return;
    }

    setIsConfirming(true);
    setError(null);
    logger.debug("BookingConfirmationScreen: Estado de 'isConfirming' seteado a true.", { state: location.state });

    const endTime = calculateEndTime(startTime, 1);

    const bookingDataForService: Omit<Booking, 'id' | 'bookedAt' | 'status'> = {
      userId: currentUser!.uid, 
      courtId: courtId!,     
      courtName: courtName,
      date: dateISO,
      startTime: startTime,
      endTime: endTime,
      totalPrice: hourlyRate!, 
    };

        logger.info("BookingConfirmationScreen: Datos preparados para el servicio de creación de reserva.", { bookingData: bookingDataForService });

    try {
      const newBookingId = await bookingService.createBooking(
        bookingDataForService,
        courtId,
        dateISO,
        startTime
      );

      navigate('/bookings', { state: { bookingConfirmed: true, confirmedBookingId: newBookingId } });
    } catch (err: any) {
      console.error("Error al confirmar reserva en Firebase:", err);
      setError(err.message || intl.formatMessage({ id: "booking.error.genericConfirm" }));
      setIsConfirming(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm sm:p-4 h-14">
        <Button
          variant='ghost' size='small' onClick={() => navigate(-1)}
          className="!p-1.5 sm:!p-2 text-gray-600 hover:text-gray-900"
          disabled={isConfirming}
          aria-label={intl.formatMessage({ id: "general.back" })}
        >
          <FiArrowLeft size={22} strokeWidth={2} />
          <span className="hidden ml-1 sm:inline"><FormattedMessage id="general.back" /></span>
        </Button>
        <h2 className="flex-grow px-2 text-lg font-semibold text-center text-gray-800 truncate">
          <FormattedMessage id="booking.confirmTitle" />
        </h2>
        <div className="min-w-[60px] sm:min-w-[80px]"></div>
      </header>

      <main className="flex-grow p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-lg p-6 space-y-6 text-center bg-white rounded-lg shadow-xl sm:p-8">
          {!canProceed && !isConfirming && (
            <FiAlertTriangle size={56} className="mx-auto text-yellow-500" aria-hidden="true" />
          )}
          {canProceed && !isConfirming && (
            <FiCheckCircle size={56} className="mx-auto text-green-500" aria-hidden="true" />
          )}

          <h3 className="text-2xl font-semibold text-gray-800">
            <FormattedMessage id={canProceed ? "booking.confirmSubtitle.ready" : "booking.confirmSubtitle.missingDetails"} />
          </h3>

          <div className="p-4 space-y-3 text-left bg-gray-50 border border-gray-200 rounded-md sm:p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center font-medium text-gray-600">
                <FiTag size={16} className="mr-2 text-gray-500" />
                <FormattedMessage id="booking.court" />:
              </span>
              <span className="font-semibold text-gray-800">{courtName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center font-medium text-gray-600">
                <FiCalendar size={16} className="mr-2 text-gray-500" />
                <FormattedMessage id="booking.date" />:
              </span>
              <span className="text-gray-700">
                {displayDateObject ? (
                  <FormattedDate value={displayDateObject} weekday="long" year="numeric" month="long" day="numeric" timeZone="UTC"/>
                ) : (
                  <FormattedMessage id="booking.date.unavailable" />
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center font-medium text-gray-600">
                <FiClock size={16} className="mr-2 text-gray-500" />
                <FormattedMessage id="booking.time" />:
              </span>
              <span className="text-gray-700">
                {timeRange !== 'N/A' ? timeRange : (startTime !== 'N/A' ? startTime : <FormattedMessage id="booking.time.unavailable" />)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center font-medium text-gray-600">
                <FiClock size={16} className="mr-2 text-gray-500" />
                <FormattedMessage id="booking.duration" />:
              </span>
              <span className="text-gray-700"><FormattedMessage id="booking.duration.default" /></span>
            </div>
            <hr className="my-3 border-gray-200" />
            <div className="flex items-baseline justify-between">
              <span className="flex items-center text-lg font-semibold text-gray-600">
                <FiDollarSign size={18} className="mr-2 text-gray-500" />
                <FormattedMessage id="booking.price" />:
              </span>
              <span className="text-xl font-bold text-primary">
                {typeof hourlyRate === 'number' && hourlyRate >= 0 ? (
                  <FormattedNumber value={hourlyRate} style="currency" currency={locale === 'es' ? 'EUR' : 'USD'} />
                  // Considera una lógica más robusta para la moneda si es necesario
                ) : (
                  <FormattedMessage id="booking.price.unavailable" />
                )}
              </span>
            </div>
          </div>

          {error && (
            <div role="alert" className="flex items-center p-3 space-x-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
              <FiAlertTriangle size={20} className="shrink-0" />
              <span>{error}</span> 
            </div>
          )}

          <Button
            variant="primary" size="large" fullWidth
            onClick={handleConfirmBooking}
            disabled={isConfirming || !canProceed}
            className="mt-4 shadow-lg hover:shadow-xl"
          >
            {isConfirming ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-white animate-spin"></svg>
                <FormattedMessage id="booking.confirmingButton" />
              </div>
            ) : (
              <FormattedMessage id="booking.confirmButton" />
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmationScreen;
