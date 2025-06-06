// src/screens/CourtListScreen.tsx
import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Dialog, Transition } from '@headlessui/react';
import {
  FiArrowLeft, FiFilter, FiMapPin, FiTag, FiClock,
  FiDollarSign, FiInfo, FiX, FiCalendar, FiSearch, FiAlertCircle
} from 'react-icons/fi';
import { courtService } from '../services/courtService';
import type { Court } from '../models/court';
import { FormattedMessage, useIntl, FormattedNumber } from 'react-intl'; // Importar

// Función helper para concatenar clases (sin cambios)
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const CourtListScreen: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl(); // Hook de internacionalización

  const [allCourts, setAllCourts] = useState<Court[]>([]);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterSurface, setFilterSurface] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = courtService.onCourtsAndSchedulesChange(
      selectedDate,
      (courtsWithAvailability) => {
        setAllCourts(courtsWithAvailability);
        setLoading(false);
      },
      (fetchError) => {
        console.error("Error al obtener canchas en tiempo real:", fetchError);
        setError(intl.formatMessage({ id: "courtList.errorLoading" }));
        setAllCourts([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [selectedDate, intl]); // Añadir intl a las dependencias

  useEffect(() => {
    let courtsToDisplay = [...allCourts];
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      courtsToDisplay = courtsToDisplay.filter(court =>
        court.name.toLowerCase().includes(lowerSearchTerm) ||
        (court.location && court.location.toLowerCase().includes(lowerSearchTerm))
      );
    }
    if (filterSurface) {
      courtsToDisplay = courtsToDisplay.filter(court => court.surface === filterSurface);
    }
    if (showOnlyAvailable) {
      courtsToDisplay = courtsToDisplay.filter(court => court.isGenerallyAvailableOnSelectedDate === true);
    }
    setFilteredCourts(courtsToDisplay);
  }, [allCourts, searchTerm, filterSurface, showOnlyAvailable]);

  const closeModal = () => setIsFilterModalOpen(false);
  const openModal = () => setIsFilterModalOpen(true);

  const getAvailabilityDisplay = (court: Court) => {

    if (court.tempAvailabilitySummary) {
        const summaryText = court.tempAvailabilitySummary.toLowerCase();
        let iconColor = "text-gray-500";
        let textToDisplay = court.tempAvailabilitySummary; // Usar el texto directamente si no hay lógica de pluralización compleja

        if (summaryText.includes('libre') || summaryText.includes('free')) {
            iconColor = "text-green-600";
            // Para pluralización necesitarías algo como:
            // textToDisplay = intl.formatMessage({ id: "courtList.availability.free" }, { count: court.availableSlotsCount });
        } else if (summaryText.includes('completa') || summaryText.includes('pocos') || summaryText.includes('few') || summaryText.includes('full')) {
            iconColor = "text-orange-500";
            // textToDisplay = intl.formatMessage({ id: summaryText.includes('pocos') || summaryText.includes('few') ? "courtList.availability.few" : "courtList.availability.full" });
        }
        return <><FiClock size={14} className={iconColor} aria-hidden="true" /> {textToDisplay}</>;
    }
    if (court.hourlyRate) {
      return <>
        <FiDollarSign size={14} className="text-green-600" aria-hidden="true" />{' '}
        <FormattedMessage id="courtList.priceFrom" values={{ rate: <FormattedNumber value={court.hourlyRate} style="decimal" minimumFractionDigits={0} maximumFractionDigits={0} /> }} />
      </>;
    }
    return <><FiInfo size={14} className="text-gray-500" aria-hidden="true" /> <FormattedMessage id="courtList.availability.consult" /></>;
  };

  const handleApplyFilters = () => closeModal();
  const handleClearFilters = () => {
    setFilterSurface('');
    setSearchTerm('');
    setShowOnlyAvailable(false);
    closeModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-16">
      <header className="sticky top-0 z-20 flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm sm:p-4 h-14">
        <Button variant='ghost' size='small' onClick={() => navigate(-1)} className="!p-1.5 sm:!p-2 text-gray-600 hover:text-gray-900" aria-label={intl.formatMessage({id: "general.back"})}>
          <FiArrowLeft size={22} strokeWidth={2} />
        </Button>
        <h2 className="flex-grow text-lg font-semibold text-center text-gray-800 truncate sm:text-xl">
          <FormattedMessage id="courtList.title" />
        </h2>
        <Button variant='ghost' size='small' onClick={openModal} className="!p-1.5 sm:!p-2 text-gray-600 hover:text-gray-900" aria-label={intl.formatMessage({id: "courtList.filterButton"})}>
          <FiFilter size={20} />
          <span className="hidden ml-1 sm:inline"><FormattedMessage id="courtList.filterButton" /></span>
        </Button>
      </header>

      <Transition appear show={isFilterModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeModal}>
          {/* ... (Overlay sin cambios de texto) ... */}
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title as="h3" className="flex items-center justify-between text-lg font-medium leading-6 text-gray-900">
                    <FormattedMessage id="courtList.filterModalTitle" />
                    <Button variant="ghost" onClick={closeModal} className="!p-1 text-gray-400 hover:text-gray-600" aria-label={intl.formatMessage({id: "general.close"})}>
                      <FiX size={20} />
                    </Button>
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="surface-filter" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <FiTag className="mr-1.5 -mt-0.5" size={14} /> <FormattedMessage id="courtList.surfaceLabel" />
                      </label>
                      <select id="surface-filter" value={filterSurface} onChange={(e) => setFilterSurface(e.target.value)}
                        className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        <option value=""><FormattedMessage id="courtList.surface.all" /></option>
                        <option value="Tierra Batida"><FormattedMessage id="courtList.surface.clay" /></option>
                        <option value="Dura"><FormattedMessage id="courtList.surface.hard" /></option>
                        <option value="Césped Sintético"><FormattedMessage id="courtList.surface.grass" /></option>
                        <option value="Indoor"><FormattedMessage id="courtList.surface.indoor" /></option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700"><FormattedMessage id="courtList.showOnlyAvailableLabel" /></span>
                        <span className="text-xs text-gray-500"><FormattedMessage id="courtList.showOnlyAvailableSublabel" /></span>
                      </span>
                      <button type="button" className={/* ... (clases sin cambios de texto) ... */ classNames( showOnlyAvailable ? 'bg-primary' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2')}
                        onClick={() => setShowOnlyAvailable(!showOnlyAvailable)} aria-pressed={showOnlyAvailable}>
                        <span className="sr-only"><FormattedMessage id="courtList.showOnlyAvailableLabel" /></span>
                        <span aria-hidden="true" className={/* ... (clases sin cambios de texto) ... */ classNames( showOnlyAvailable ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out')} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={handleClearFilters}><FormattedMessage id="courtList.clearFiltersButton" /></Button>
                    <Button variant="primary" onClick={handleApplyFilters}><FormattedMessage id="courtList.applyFiltersButton" /></Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="sticky top-14 z-10 flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-100 border-b border-gray-200 sm:p-4">
        <div className="relative w-full sm:flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input type="text" placeholder={intl.formatMessage({ id: "courtList.searchPlaceholder" })} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
        <div className="flex items-center w-full mt-2 sm:mt-0 sm:w-auto">
          <label htmlFor="main-date-filter" className="flex items-center pr-2 text-sm font-medium text-gray-700 whitespace-nowrap">
            <FiCalendar className="mr-1 -mt-0.5" size={14} /> <FormattedMessage id="courtList.dateLabel" />
          </label>
          <input id="main-date-filter" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().substring(0, 10)}
            className="flex-grow w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm sm:w-auto focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
      </div>

      <main className="flex-grow p-3 sm:p-4">
        {error && (
          <div role="alert" className="p-4 mb-4 text-sm text-center text-red-700 bg-red-100 border border-red-300 rounded-md">
            <FiAlertCircle className="inline w-5 h-5 mr-2" /> {error} {}
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-10">
            <span className="text-gray-500 text-lg"><FormattedMessage id="courtList.loadingCourts" /></span>
          </div>
        )}
        {!loading && !error && filteredCourts.length === 0 && (
          <div className="py-10 text-center">
            <FiInfo size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700"><FormattedMessage id="courtList.noCourtsFoundTitle" /></h3>
            <p className="mt-1 text-gray-500">
              <FormattedMessage id="courtList.noCourtsFoundSubtitle" />
            </p>
            <Button variant="secondary" className="mt-6 inline-flex items-center gap-2" onClick={openModal}>
              <FiFilter size={16} /> <FormattedMessage id="courtList.modifyFiltersButton" />
            </Button>
          </div>
        )}
        {!loading && !error && filteredCourts.length > 0 && (
          <div className="space-y-4">
            {filteredCourts.map(court => (
              <div key={court.id} className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm sm:flex-row hover:shadow-lg transition-shadow duration-200 group">
              
                <img
                  src={court.img || "/placeholder-court-default.jpg"}
                  alt={court.name} // El alt text podría internacionalizarse si los nombres de cancha también lo están
                  className="w-full h-48 sm:w-40 md:w-48 sm:h-auto object-cover flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col flex-grow p-4">
                  <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-primary">
                    {court.name} {/* Asumiendo que los nombres de cancha no se traducen o vienen traducidos del backend */}
                  </h3>
                  <div className="mt-1 space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-1.5">
                      <FiMapPin size={14} className="text-gray-400 shrink-0" /> {court.location} {/* Localización podría necesitar traducción */}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FiTag size={14} className="text-gray-400 shrink-0" />
                      {/* Para traducir la superficie si los valores son claves de i18n */}
                      <FormattedMessage id={`courtList.surface.${court.surface.toLowerCase().replace(/\s+/g, '')}`} defaultMessage={court.surface} />
                      {/* Ejemplo: courtList.surface.tierrabatida, courtList.surface.dura */}
                    </p>
                    <p className="flex items-center gap-1.5 font-medium">
                      {getAvailabilityDisplay(court)}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 text-right">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate(`/courts/${court.id}/booking`, { state: { courtName: court.name, selectedDate: selectedDate, hourlyRate: court.hourlyRate } })} // Pasar hourlyRate
                    >
                      <FormattedMessage id="courtList.viewSchedulesButton" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CourtListScreen;