import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Importa tus pantallas TSX
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import CourtListScreen from './screens/CourtListScreen';
import DateTimeSelectionScreen from './screens/DateTimeSelectionScreen';
import BookingConfirmationScreen from './screens/BookingConfirmationScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import ProfileScreen from './screens/ProfileScreen';
// Importa el componente BottomNav
import BottomNav from './components/BottomNav';

// --- Simulación de Autenticación ---
// En una app real, esto vendría de un Context, Redux, Zustand, etc.
const useAuth = () => {
  // Cambia esto para probar flujo autenticado/no autenticado
  // Podrías usar localStorage o sessionStorage para persistencia básica
  // const token = localStorage.getItem('authToken');
  // return { isAuthenticated: !!token };
   return { isAuthenticated: true }; // Cambia a false para probar redirección
};

// Componente para Rutas Protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Redirige a login si no está autenticado
    // Puedes pasar la ruta original en el estado para redirigir después del login
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>; // Renderiza el componente hijo si está autenticado
};


const App: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Solo para la ruta raíz

  return (
    <Router>
        {/* Renderiza BottomNav aquí para que esté disponible en todas las rutas protegidas */}
        {/* Se oculta a sí mismo en /login y /register */}
        <BottomNav />

        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          {/* <Route path="/forgot-password" element={<ForgotPasswordScreen />} /> */}
          {/* <Route path="/terms" element={<TermsScreen />} /> */}


          {/* Rutas Protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
          <Route path="/courts" element={<ProtectedRoute><CourtListScreen /></ProtectedRoute>} />
          <Route path="/courts/:courtId/booking" element={<ProtectedRoute><DateTimeSelectionScreen /></ProtectedRoute>} />
          <Route path="/courts/:courtId/confirm" element={<ProtectedRoute><BookingConfirmationScreen /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><MyBookingsScreen /></ProtectedRoute>} />
          {/* <Route path="/bookings/:bookingId" element={<ProtectedRoute><BookingDetailScreen /></ProtectedRoute>} /> */}
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          {/* <Route path="/profile/edit" element={<ProtectedRoute><EditProfileScreen /></ProtectedRoute>} /> */}
          {/* <Route path="/profile/change-password" element={<ProtectedRoute><ChangePasswordScreen /></ProtectedRoute>} /> */}
          {/* <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} /> */}
          {/* <Route path="/help" element={<ProtectedRoute><HelpScreen /></ProtectedRoute>} /> */}


          {/* Ruta Raíz: Redirige a dashboard si está autenticado, si no a login */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />

          {/* Ruta para páginas no encontradas (404) */}
          <Route path="*" element={
              <div style={{textAlign: 'center', padding: '50px'}}>
                  <h1>404 - Página no encontrada</h1>
                  <Link to="/">Volver al inicio</Link>
              </div>
            }
          />
        </Routes>
    </Router>
  );
}

export default App;