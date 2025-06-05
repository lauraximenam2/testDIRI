import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // <--- Importar
import { auth } from '../../firebase-config'; // <--- Importar

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }
      
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // <--- Usar Firebase Auth
      // Opcional: Actualizar el perfil del usuario con el nombre
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      navigate('/dashboard'); // Firebase onAuthStateChanged se encargará del resto
    } catch (err: any) {
      setError(err.message || 'Error al registrar la cuenta.');
      console.error("Error de registro:", err);
    }
    setLoading(false);
  };
  

  return (
    // Contenedor principal
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-green-600 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
          Crea tu Cuenta
        </h2>

        {/* Mensaje de Error */}
        {error && (
          <div role="alert" className="p-3 text-sm text-center text-red-700 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Campo Nombre Completo */}
          <div>
            <label htmlFor="name" className="sr-only">Nombre Completo</label>
            <input
              id="name"
              type="text"
              placeholder="Nombre Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error && !name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="name"
            />
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email-register" className="sr-only">Email</label> {/* ID diferente si hay un email en Login */}
            <input
              id="email-register"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error && !email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="email"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password-register" className="sr-only">Contraseña</label>
            <input
              id="password-register"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error.includes('contraseñas') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Campo Confirmar Contraseña */}
          <div>
            <label htmlFor="confirm-password" className="sr-only">Confirmar Contraseña</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error.includes('contraseñas') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Checkbox Términos y Condiciones */}
          <div className="flex items-start pt-1">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                
                className={`w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-offset-1
                            ${error.includes('términos') ? 'border-red-500 ring-red-300' : 'border-gray-300'}`}
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                Acepto los{' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:text-primary-dark hover:underline">
                  Términos y Condiciones
                </Link>
              </label>
            </div>
          </div>

          {/* Botón Registrarse */}
          <Button type="submit" variant="primary" fullWidth size="large" className="shadow-md hover:shadow-lg">
            Registrarse
          </Button>
        </form>

        {/* Texto y Enlace para Iniciar Sesión */}
        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Button
            as="link" 
            to="/login"
            variant="link"
            className="font-semibold !text-primary hover:!text-primary-dark hover:underline"
          >
            Inicia Sesión
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;