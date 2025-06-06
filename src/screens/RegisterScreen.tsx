// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { FormattedMessage, useIntl } from 'react-intl'; // Importar

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl(); // Hook para internacionalización
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
      setError(intl.formatMessage({ id: 'register.error.passwordsDoNotMatch' }));
      return;
    }
    if (!termsAccepted) {
      setError(intl.formatMessage({ id: 'register.error.mustAcceptTerms' }));
      return;
    }

    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = intl.formatMessage({ id: 'register.error.generic' });
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = intl.formatMessage({ id: 'register.error.emailAlreadyInUse' });
            break;
          case 'auth/weak-password':
            errorMessage = intl.formatMessage({ id: 'register.error.weakPassword' });
            break;
          default:
            errorMessage = err.message || errorMessage; // Usar el mensaje de Firebase si es más descriptivo
        }
      }
      setError(errorMessage);
      console.error("Error de registro:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-green-600 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
          <FormattedMessage id="register.title" defaultMessage="Crea tu Cuenta" />
        </h2>

        {error && (
          <div role="alert" className="p-3 text-sm text-center text-red-700 bg-red-100 border border-red-300 rounded-md">
            {error} {/* El mensaje de error ya está internacionalizado en handleRegister */}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="name" className="sr-only">
              <FormattedMessage id="register.nameLabel" defaultMessage="Nombre Completo" />
            </label>
            <input
              id="name"
              type="text"
              placeholder={intl.formatMessage({ id: 'register.namePlaceholder', defaultMessage: 'Nombre Completo' })}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error && !name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email-register" className="sr-only">
              <FormattedMessage id="register.emailLabel" defaultMessage="Email" />
            </label>
            <input
              id="email-register"
              type="email"
              placeholder={intl.formatMessage({ id: 'register.emailPlaceholder', defaultMessage: 'Email' })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error && !email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password-register" className="sr-only">
              <FormattedMessage id="register.passwordLabel" defaultMessage="Contraseña" />
            </label>
            <input
              id="password-register"
              type="password"
              placeholder={intl.formatMessage({ id: 'register.passwordPlaceholder', defaultMessage: 'Contraseña' })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error.toLowerCase().includes(intl.formatMessage({id: "register.error.passwordsDoNotMatch"}).toLowerCase().substring(0,10)) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="sr-only">
              <FormattedMessage id="register.confirmPasswordLabel" defaultMessage="Confirmar Contraseña" />
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder={intl.formatMessage({ id: 'register.confirmPasswordPlaceholder', defaultMessage: 'Confirmar Contraseña' })}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                          ${error.toLowerCase().includes(intl.formatMessage({id: "register.error.passwordsDoNotMatch"}).toLowerCase().substring(0,10)) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-start pt-1">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className={`w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-offset-1
                            ${error.toLowerCase().includes(intl.formatMessage({id: "register.error.mustAcceptTerms"}).toLowerCase().substring(0,10)) ? 'border-red-500 ring-red-300' : 'border-gray-300'}`}
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                <FormattedMessage id="register.acceptTerms" defaultMessage="Acepto los" />
                {' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:text-primary-dark hover:underline">
                  <FormattedMessage id="register.termsAndConditionsLink" defaultMessage="Términos y Condiciones" />
                </Link>
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="large" className="shadow-md hover:shadow-lg" disabled={loading}>
            {loading ? (
              <FormattedMessage id="register.loadingButton" defaultMessage="Registrando..." />
            ) : (
              <FormattedMessage id="register.submitButton" defaultMessage="Registrarse" />
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          <FormattedMessage id="register.alreadyHaveAccount" defaultMessage="¿Ya tienes cuenta?" />
          {' '}
          <Button
            as="link"
            to="/login"
            variant="link"
            className="font-semibold !text-primary hover:!text-primary-dark hover:underline"
          >
            <FormattedMessage id="register.loginHere" defaultMessage="Inicia Sesión" />
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;