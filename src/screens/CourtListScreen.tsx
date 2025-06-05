// src/screens/CourtListScreen.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */ // Puedes quitar esto si ya no es necesario
import React, { useState, useEffect, Fragment } from 'react'; // Fragment para Transition de Headless UI
import { useNavigate } from 'react-router-dom'; // Link no se usa directamente aquí
import Button from '../components/Button'; // Tu componente Button con Tailwind
import { Dialog, Transition } from '@headlessui/react'; // Para el modal de filtros 
import {
  FiArrowLeft,
  FiFilter,
  FiMapPin,
  FiTag,
  FiClock,
  FiDollarSign,
  FiInfo,
  FiX, // Para el botón de cerrar modal
  FiCalendar // Para el icono de fecha en el modal
} from 'react-icons/fi';

// Interfaz para el tipo de dato de Cancha
interface Court {
  id: number;
  name: string;
  location: string;
  surface: string;
  availability: string;
  img: string;
}

const CourtListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Estado para el modal de filtros

  // Estado para los filtros dentro del modal (ejemplo)
  const [filterSurface, setFilterSurface] = useState<string>(''); // '' para todas
  const [filterTimeOfDay, setFilterTimeOfDay] = useState<string>(''); // '' para todos

  function closeModal() {
    setIsFilterModalOpen(false);
  }
  function openModal() {
    setIsFilterModalOpen(true);
  }

  // Simulación de carga de datos y filtrado
  useEffect(() => {
    setLoading(true);
    console.log("Cargando canchas para fecha:", selectedDate, "Superficie:", filterSurface, "Horario:", filterTimeOfDay);
    // --- Simular llamada API ---
    setTimeout(() => {
      let fetchedCourts: Court[] = [
        { id: 1, name: "Cancha Central", location: "Club Principal", surface: "Tierra Batida", availability: "5 horarios", img: "/placeholder-court1.jpg" },
        { id: 2, name: "Pista Rápida 1", location: "Anexo Norte", surface: "Dura", availability: "Desde €15/hora", img: "/placeholder-court2.jpg" },
        { id: 3, name: "Pista Césped", location: "Club Principal", surface: "Césped Sintético", availability: "3 horarios", img: "/placeholder-court3.jpg" },
        { id: 4, name: "Indoor 1", location: "Pabellón Cubierto", surface: "Indoor", availability: "Desde €20/hora", img: "/placeholder-court4.jpg" },
        { id: 5, name: "Pista de Tierra 2", location: "Club Principal", surface: "Tierra Batida", availability: "Abierta", img: "/placeholder-court5.jpg" },
      ];

      // Simular filtrado (esto normalmente lo haría el backend)
      if (filterSurface) {
        fetchedCourts = fetchedCourts.filter(court => court.surface === filterSurface);
      }
      // Aquí podrías añadir más lógica de filtrado por filterTimeOfDay si lo implementas

      setCourts(fetchedCourts);
      setLoading(false);
    }, 500);
  }, [selectedDate, filterSurface, filterTimeOfDay]); // Recargar al cambiar filtros

  const getAvailabilityIcon = (availabilityText: string) => {
    if (availabilityText.toLowerCase().includes('hora')) return <FiDollarSign size={14} className="text-green-600" aria-hidden="true" />;
    if (availabilityText.toLowerCase().includes('horario')) return <FiClock size={14} className="text-blue-600" aria-hidden="true" />;
    return <FiInfo size={14} className="text-gray-500" aria-hidden="true" />;
  };

  const handleApplyFilters = () => {
    // La lógica de recarga ya está en useEffect, así que solo cerramos el modal.
    // Si los filtros se aplicaran de otra forma, aquí iría esa lógica.
    closeModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-16"> {/* page-container y padding para BottomNav */}
      {/* Header de la Pantalla */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm sm:p-4 h-14">
        <Button
          variant='ghost'
          size='small'
          onClick={() => navigate(-1)}
          className="!p-1.5 sm:!p-2 text-gray-600 hover:text-gray-900"
          aria-label="Volver"
        >
          <FiArrowLeft size={22} strokeWidth={2} />
        </Button>
        <h2 className="flex-grow text-lg font-semibold text-center text-gray-800 truncate sm:text-xl">
          Canchas Disponibles
        </h2>
        <Button
          variant='ghost'
          size='small'
          onClick={openModal}
          className="!p-1.5 sm:!p-2 text-gray-600 hover:text-gray-900"
          aria-label="Abrir Filtros"
        >
          <FiFilter size={20} />
          <span className="hidden ml-1 sm:inline">Filtro</span>
        </Button>
      </header>

      {/* Modal de Filtros con Headless UI */}
      <Transition appear show={isFilterModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeModal}> {/* z-30 para estar sobre el header sticky */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" /> {/* Overlay más oscuro */}
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title as="h3" className="flex items-center justify-between text-lg font-medium leading-6 text-gray-900">
                    Filtrar Canchas
                    <Button variant="ghost" onClick={closeModal} className="!p-1 text-gray-500 hover:text-gray-700" aria-label="Cerrar modal">
                      <FiX size={20} />
                    </Button>
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    {/* Filtro de Fecha en Modal */}
                    <div>
                      <label htmlFor="modal-date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        <FiCalendar className="inline mr-1 -mt-0.5" size={14}/> Fecha
                      </label>
                      <input
                        id="modal-date-filter" type="date" value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        min={new Date().toISOString().substring(0, 10)}
                      />
                    </div>
                    {/* Filtro de Superficie */}
                    <div>
                      <label htmlFor="surface-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        <FiTag className="inline mr-1 -mt-0.5" size={14}/> Superficie
                      </label>
                      <select
                        id="surface-filter"
                        value={filterSurface}
                        onChange={(e) => setFilterSurface(e.target.value)}
                        className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      >
                        <option value="">Todas las superficies</option>
                        <option value="Tierra Batida">Tierra Batida</option>
                        <option value="Dura">Dura</option>
                        <option value="Césped Sintético">Césped Sintético</option>
                        <option value="Indoor">Indoor</option>
                      </select>
                    </div>
                    {/* Aquí podrías añadir más filtros (ej. Hora del día) */}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => { setFilterSurface(''); setFilterTimeOfDay(''); closeModal(); /* También resetea fecha si quieres */ }}>
                      Limpiar
                    </Button>
                    <Button variant="primary" onClick={handleApplyFilters}>
                      Aplicar Filtros
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* Fin del Modal de Filtros */}

      {/* Barra de Filtro Rápido de Fecha (visible siempre debajo del header) */}
      <div className="sticky top-14 z-10 flex items-center gap-2 p-3 bg-gray-100 border-b border-gray-200 sm:p-4">
        <label htmlFor="main-date-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          <FiCalendar className="inline mr-1 -mt-0.5" size={14}/> Fecha:
        </label>
        <input
          id="main-date-filter" type="date" value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex-grow w-auto max-w-xs px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          min={new Date().toISOString().substring(0, 10)}
        />
      </div>

      {/* Contenido Principal: Lista de Canchas */}
      <main className="flex-grow p-3 sm:p-4">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <svg className="w-8 h-8 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-gray-600">Cargando canchas...</p>
          </div>
        )}
        {!loading && courts.length === 0 && (
          <div className="py-10 text-center">
            <FiInfo size={40} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">
              No hay canchas disponibles para los filtros seleccionados
              <br/>el {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}.
            </p>
            <Button variant="secondary" className="mt-4" onClick={openModal}>
                Modificar Filtros
            </Button>
          </div>
        )}
        {!loading && courts.length > 0 && (
          <div className="space-y-4">
            {courts.map(court => (
              <div key={court.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={court.img || "/placeholder-court-default.jpg"} // Placeholder si no hay img
                  alt={court.name}
                  className="w-full h-40 sm:w-40 sm:h-auto object-cover rounded-md border border-gray-100 flex-shrink-0"
                />
                <div className="flex flex-col flex-grow min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {court.name}
                  </h3>
                  <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                    <p className="flex items-center gap-1.5">
                      <FiMapPin size={14} className="text-gray-500 shrink-0" /> {court.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FiTag size={14} className="text-gray-500 shrink-0" /> {court.surface}
                    </p>
                    <p className="flex items-center gap-1.5 font-medium">
                      {getAvailabilityIcon(court.availability)} {court.availability}
                    </p>
                  </div>
                  <div className="mt-auto pt-3 text-right sm:text-left"> {/* mt-auto empuja este div abajo */}
                    <Button
                      variant="primary" // Cambiado a primary para destacar
                      size="small"
                      onClick={() => navigate(`/courts/${court.id}/booking`, { state: { courtName: court.name } })}
                    >
                      Ver Horarios
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* BottomNav se renderiza desde App.tsx */}
    </div>
  );
}

export default CourtListScreen;