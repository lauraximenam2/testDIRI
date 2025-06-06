// src/screens/DateTimeSelectionScreen.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { FiArrowLeft, FiCalendar, FiAlertCircle, FiClock } from 'react-icons/fi';
import { courtService } from '../services/courtService';
import type { DailyScheduleData, ScheduleSlotData } from '../models/court';
import { FormattedMessage, useIntl, FormattedDate } from 'react-intl'; 


interface UITimeSlot {
  timeRange: string;
  startTime: string;
  available: boolean;
}

const DateTimeSelectionScreen: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl(); // Hook de internacionalización


  const initialSelectedDate = location.state?.selectedDate
    ? new Date(location.state.selectedDate + 'T00:00:00Z') 
    : new Date();
  initialSelectedDate.setUTCHours(0, 0, 0, 0); 


  const courtNameFromState = location.state?.courtName;
  const courtName = courtNameFromState || (courtId
    ? `${intl.formatMessage({ id: "booking.court" })} ${courtId}` // "Cancha X" o "Court X"
    : intl.formatMessage({ id: "dateTimeSelection.courtUnknown" }));

  const hourlyRate = location.state?.hourlyRate || 0;

  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate);
  const [uiTimeSlots, setUiTimeSlots] = useState<UITimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<UITimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState<string | null>(null);

  const isoDateString = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    if (!courtId) {
      setErrorSlots(intl.formatMessage({ id: "dateTimeSelection.error.courtIdMissing" }));
      setUiTimeSlots([]);
      return;
    }
    const fetchTimeSlots = async () => {
      setLoadingSlots(true);
      setSelectedTimeSlot(null);
      setErrorSlots(null);
      try {
        const dailyScheduleData: DailyScheduleData | null = await courtService.getCourtScheduleForDate(courtId, isoDateString);
        if (dailyScheduleData) {
          const slots: UITimeSlot[] = Object.entries(dailyScheduleData)
            .map(([startTime, slotData]: [string, ScheduleSlotData]) => {
              const startHour = parseInt(startTime.split(':')[0]);
              const endHour = startHour + 1;
              const endTime = `${endHour.toString().padStart(2, '0')}:00`;
              return {
                startTime: startTime,
                timeRange: `${startTime} - ${endTime}`,
                available: slotData.status === 'available',
              };
            })
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          setUiTimeSlots(slots);
        } else {
          setUiTimeSlots([]);
        }
      } catch (err: any) {
        console.error("Error fetching time slots:", err);
        setErrorSlots(err.message || intl.formatMessage({ id: "dateTimeSelection.errorLoadingSlotsDefault" }));
        setUiTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchTimeSlots();
  }, [selectedDate, courtId, isoDateString, intl]); 

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    const [year, month, day] = dateValue.split('-').map(Number);
    const newDate = new Date(Date.UTC(year, month - 1, day)); 
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (newDate >= today) {
      setSelectedDate(newDate);
    } else {
      alert(intl.formatMessage({ id: "dateTimeSelection.alert.pastDate" }));
    }
  };

  const handleTimeSelect = (slot: UITimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(selectedTimeSlot?.timeRange === slot.timeRange ? null : slot);
    }
  };

  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm sm:p-4 h-14">
        <Button variant='ghost' size='small' onClick={() => navigate(-1)} className="!p-1.5 sm:!p-2 text-gray-600 hover:text-gray-900" aria-label={intl.formatMessage({ id: "general.back" })}>
          <FiArrowLeft size={22} strokeWidth={2} />
        </Button>
        <h2 className="flex-grow text-lg font-semibold text-center text-gray-800 truncate sm:text-xl">
          <FormattedMessage id="dateTimeSelection.title" />
        </h2>
        <div className="min-w-[40px] sm:min-w-[50px]"></div>
      </header>

      <main className={`flex-grow p-4 sm:p-6 ${selectedTimeSlot ? 'pb-28 sm:pb-32' : 'pb-6'}`}>
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-center text-gray-700">
            <FormattedMessage id="dateTimeSelection.bookingFor" /> <strong className="text-primary">{courtName}</strong>
          </p>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
            <label htmlFor="date-selector" className="flex items-center mb-2 text-sm font-medium text-gray-700">
              <FiCalendar size={18} className="mr-2 text-accent" />
              <FormattedMessage id="dateTimeSelection.selectDateLabel" />
            </label>
            <input
              id="date-selector" type="date" value={isoDateString} onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]} // Mantiene el formato YYYY-MM-DD
              className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
            <h3 className="mb-3 font-semibold text-gray-700 text-md">
              <FormattedMessage id="dateTimeSelection.availableSlotsFor" />{' '}
              <span className="text-primary">
                <FormattedDate
                    value={selectedDate} 
                    weekday="long" year="numeric" month="long" day="numeric"
                    timeZone="UTC" // Para mostrar la fecha seleccionada consistentemente como UTC
                />
              </span>
            </h3>
            {loadingSlots && (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <svg className="w-8 h-8 mr-3 text-primary animate-spin"></svg>
                <FormattedMessage id="dateTimeSelection.loadingSlots" />
              </div>
            )}
            {!loadingSlots && errorSlots && (
              <div className="flex flex-col items-center py-10 text-center text-red-600">
                <FiAlertCircle size={32} className="mb-2" />
                <p className="font-semibold"><FormattedMessage id="dateTimeSelection.errorLoadingSlotsTitle" /></p>
                <p className="text-sm">{errorSlots}</p> 
              </div>
            )}
            {!loadingSlots && !errorSlots && uiTimeSlots.length === 0 && (
              <div className="flex flex-col items-center py-10 text-center text-gray-500">
                <FiClock size={32} className="mb-2 text-gray-400" />
                <FormattedMessage id="dateTimeSelection.noSlotsAvailable" />
              </div>
            )}
            {!loadingSlots && !errorSlots && uiTimeSlots.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {uiTimeSlots.map((slot) => (
                  <Button
                    key={slot.timeRange}
                    variant={selectedTimeSlot?.timeRange === slot.timeRange ? 'primary' : (slot.available ? 'outline' : 'ghost')}
                    onClick={() => handleTimeSelect(slot)}
                    disabled={!slot.available}
                    fullWidth
                    className={`py-2.5 sm:py-3 text-sm ${!slot.available ? 'text-gray-400 !border-gray-300 line-through !bg-gray-100 !cursor-not-allowed' : ''} ${selectedTimeSlot?.timeRange === slot.timeRange ? 'ring-2 ring-offset-1 ring-primary-dark' : ''}`}
                  >
                    {slot.timeRange} 
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedTimeSlot && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-white border-t border-gray-200 shadow-top-md sm:p-6">
          <div className="flex flex-col items-center max-w-md mx-auto space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
            <p className="text-sm text-center text-gray-700 sm:text-left">
              <FormattedMessage id="dateTimeSelection.selectedInfo" />{' '}
              <strong className="text-primary">
                <FormattedDate
                    value={selectedDate}
                    weekday="long" year="numeric" month="long" day="numeric"
                    timeZone="UTC"
                />
              </strong>
              <br className="sm:hidden" />{' '}
              <FormattedMessage id="dateTimeSelection.selectedInfo.from" />{' '}
              <strong className="text-primary">{selectedTimeSlot.timeRange}</strong>
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate(
                `/courts/${courtId}/confirm`,
                { state: { courtId: courtId, courtName: courtName, date: isoDateString, time: selectedTimeSlot.startTime, timeRange: selectedTimeSlot.timeRange, hourlyRate: hourlyRate } }
              )}
              className="w-full sm:w-auto shadow-md"
            >
              <FormattedMessage id="dateTimeSelection.continueBookingButton" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelectionScreen;