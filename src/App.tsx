// src/App.tsx
import React, { Suspense, lazy, useEffect } from 'react';
// BrowserRouter ya no se importa ni se usa aquí si está en main.tsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Outlet puede ser útil
import { useAuthContext } from './contexts/AuthContext';

import Header from './components/Header'; // Header SÍ usará useIntl y FormattedMessage
import HomePage from './screens/HomePage';
import LoginScreen from './screens/LoginScreen';

// --- Carga diferida para las pantallas principales ---
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const CourtListScreen = lazy(() => import('./screens/CourtListScreen'));
const DateTimeSelectionScreen = lazy(() => import('./screens/DateTimeSelectionScreen'));
const BookingConfirmationScreen = lazy(() => import('./screens/BookingConfirmationScreen'));
const MyBookingsScreen = lazy(() => import('./screens/MyBookingsScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));

// --- Hook useAuth usa el contexto ---
const useAuth = () => {
  const { currentUser, loading } = useAuthContext();
  return { isAuthenticated: !!currentUser && !loading, user: currentUser, authLoading: loading };
};

// Componente para Rutas Protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth(); // Incluir authLoading aquí

  // Si la autenticación aún está cargando, podrías mostrar un loader o nada
  // para evitar un parpadeo si el usuario está realmente autenticado.
  if (authLoading) {
    // Podrías retornar un loader específico para rutas protegidas o null
    return <PageLoader />; // O simplemente null si prefieres no mostrar nada hasta que se resuelva
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height,56px)-var(--bottom-nav-height,0px))] p-6">
    <div className="flex flex-col items-center">
      <svg className="w-12 h-12 text-primary animate-spin mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-lg text-gray-600">Cargando página...</p>
    </div>
  </div>
);

// Layout principal que incluye el Header y un Outlet para las rutas anidadas
// Esto es útil si todas tus rutas principales deben compartir el Header
const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background text-brand-text-primary antialiased">
      <Header />
      <main className="flex-grow pt-14"> {/* pt-14 asumiendo que Header tiene h-14 */}
        <Suspense fallback={<PageLoader />}>
          <Outlet /> {/* Las rutas anidadas se renderizarán aquí */}
        </Suspense>
      </main>
    </div>
  );
};


const App: React.FC = () => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <svg className="w-16 h-16 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // Ya no necesitas <Router> aquí si está en main.tsx
  return (
      <Routes>
        {/* Rutas que usan el MainLayout (con Header) */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />}
          />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
          <Route path="/courts" element={<ProtectedRoute><CourtListScreen /></ProtectedRoute>} />
          <Route path="/courts/:courtId/booking" element={<ProtectedRoute><DateTimeSelectionScreen /></ProtectedRoute>} />
          <Route path="/courts/:courtId/confirm" element={<ProtectedRoute><BookingConfirmationScreen /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><MyBookingsScreen /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        </Route>

        {/* Rutas que NO usan el MainLayout (sin Header, o con uno diferente) */}
        {/* Es importante que LoginScreen y RegisterScreen no estén dentro de MainLayout si no deben tener el Header principal */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Podrías tener una ruta catch-all para páginas no encontradas */}
        {/* <Route path="*" element={<NotFoundScreen />} /> */}
      </Routes>
  );
};

export default App;