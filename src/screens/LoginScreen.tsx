import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginScreen.module.css';
import inputStyles from '../styles/shared/Input.module.css';
import Button from '../components/Button';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); // Reset error
    // --- Lógica de inicio de sesión ---
    // Aquí llamarías a tu API/servicio de autenticación
    console.log('Intentando iniciar sesión con:', email);
    if (email === 'test@test.com' && password === 'password') { // Simulación básica
      // Guardar token/sesión, etc.
      navigate('/dashboard');
    } else {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <img src="/tennis-logo.svg" alt="Logo App Tenis" className={styles.logo} />
        <h2>Iniciar Sesión</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputStyles.input} ${error ? inputStyles.inputError : ''}`}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputStyles.input} ${error ? inputStyles.inputError : ''}`}
            required
            autoComplete="current-password"
          />
          <Button variant="link" size="small" className={styles.forgotPassword}>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </Button>
          <Button type="submit" variant="primary" fullWidth size="large">
            Iniciar Sesión
          </Button>
        </form>
        <p className={styles.signupText}>
          ¿No tienes cuenta?{' '}
          <Button variant="link" className={styles.inlineLink}><Link to="/register">Regístrate aquí</Link></Button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;