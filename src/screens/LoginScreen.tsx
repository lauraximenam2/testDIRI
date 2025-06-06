// src/screens/LoginScreen.tsx
import React, { useState ,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { FormattedMessage, useIntl } from 'react-intl';
import logger from '../services/logging';


const LoginScreen: React.FC = () => {

  const navigate = useNavigate();
  const intl = useIntl(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    logger.debug("LoginScreen montado");
    return () => {
      logger.debug("LoginScreen desmontado");
    };
  }, []); 

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    logger.info(`Intento de inicio de sesión para email: ${email}`); // Loguea el intento
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      logger.info(`Inicio de sesión exitoso para: ${email}`); // Loguea el éxito
      navigate('/dashboard');
    } catch (err: any) {

      logger.error(`Error de inicio de sesión para ${email}: ${err.message || String(err)}`);
      if (err.code) {
        logger.debug(`Código de error de Firebase (login): ${err.code}`);
      }
      if (err.stack) {
        logger.debug(`Stack trace del error de login: ${err.stack}`);
      }

      let errorMessage = intl.formatMessage({ id: 'login.error.generic' });
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = intl.formatMessage({ id: 'login.error.generic' });
            break;
          default:
            break;
        }
      }
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-green-600 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          <FormattedMessage id="login.title" defaultMessage="Iniciar Sesión" />
        </h2>

        {error && (
          <p role="alert" className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-md">
            {error} 
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="sr-only">
              <FormattedMessage id="login.emailLabel" defaultMessage="Email" />
            </label>
            <input
              id="email"
              type="email"
              placeholder={intl.formatMessage({ id: 'login.emailPlaceholder', defaultMessage: 'Email' })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              <FormattedMessage id="login.passwordLabel" defaultMessage="Contraseña" />
            </label>
            <input
              id="password"
              type="password"
              placeholder={intl.formatMessage({ id: 'login.passwordPlaceholder', defaultMessage: 'Contraseña' })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="text-right">
            <Button
              as="link"
              to="/forgot-password" 
              variant="link"
              size="small"
              className="text-sm text-gray-600 hover:text-primary"
            >
              <FormattedMessage id="login.forgotPassword" defaultMessage="¿Olvidaste tu contraseña?" />
            </Button>
          </div>

          <Button type="submit" variant="primary" fullWidth size="large" className="shadow-md hover:shadow-lg" disabled={loading}>
            {loading ? (
              <FormattedMessage id="login.loading" defaultMessage="Iniciando sesión..." />
            ) : (
              <FormattedMessage id="login.submitButton" defaultMessage="Iniciar Sesión" />
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          <FormattedMessage id="login.noAccount" defaultMessage="¿No tienes cuenta?" />
          {' '}
          <Button
            as="link"
            to="/register"
            variant="link"
            className="font-semibold !text-primary hover:!text-primary-dark hover:underline"
          >
            <FormattedMessage id="login.registerHere" defaultMessage="Regístrate aquí" />
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;