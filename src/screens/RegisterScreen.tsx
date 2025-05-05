import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterScreen.module.css'; // Podría importar de Login y añadir específicos
import inputStyles from '../styles/shared/Input.module.css';
import Button from '../components/Button';

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }
    // --- Lógica de Registro ---
    console.log('Registrando:', name, email);
    // Llamada API...
    navigate('/dashboard'); // Simulado
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <img src="/tennis-logo.svg" alt="Logo App Tenis" className={styles.logo} />
        <h2>Crea tu Cuenta</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleRegister} className={styles.form}>
          <input type="text" placeholder="Nombre Completo" value={name} onChange={(e) => setName(e.target.value)} className={inputStyles.input} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputStyles.input} ${error && !email ? inputStyles.inputError : ''}`} required autoComplete="email" />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputStyles.input} ${error.includes('contraseñas') ? inputStyles.inputError : ''}`} required autoComplete="new-password"/>
          <input type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputStyles.input} ${error.includes('contraseñas') ? inputStyles.inputError : ''}`} required autoComplete="new-password"/>

          <label className={`${inputStyles.checkboxLabel} ${styles.terms}`}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className={`${inputStyles.checkbox} ${error.includes('términos') ? styles.errorCheckbox : ''}`}
              required
            />
             Acepto los <a href="/terms" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>
          </label>

          <Button type="submit" variant="primary" fullWidth size="large">
            Registrarse
          </Button>
        </form>
        <p className={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <Button variant="link" className={styles.inlineLink}><Link to="/login">Inicia Sesión</Link></Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;