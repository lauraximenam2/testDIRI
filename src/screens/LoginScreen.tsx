// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../../firebase-config'; 


const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => { // <--- Convertir a async
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password); // <--- Usar Firebase Auth
      navigate('/dashboard'); // Firebase onAuthStateChanged se encargará del resto
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      console.error("Error de login:", err);
    }
    setLoading(false);
  };
  

  return (
    // Contenedor principal de la pantalla
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-green-600 p-4">

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <img src="/tennis-logo.svg" alt="Logo" className="w-20 h-20 mx-auto mb-5" />
        <h2 className="text-3xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
        
        {error && <p role="alert" className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-md">{error}</p>}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label> 
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Clases para el input
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2  focus:border-transparent transition-colors
                          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="email"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Enlace Olvidaste Contraseña */}
          <div className="text-right">
            <Button
              as="link" 
              to="/forgot-password"
              variant="link"
              size="small"
              className="text-sm text-gray-600 hover:text-primary" 
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>

          {/* Botón Iniciar Sesión */}
          <Button type="submit" variant="primary" fullWidth size="large" className="shadow-md hover:shadow-lg">
            Iniciar Sesión
          </Button>
        </form>

        {/* Texto y Enlace de Registro */}
        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta?{' '}
          <Button
            as="link"
            to="/register"
            variant="link"
            className="font-semibold !text-primary hover:!text-primary-dark hover:underline" 
          >
            Regístrate aquí
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;