// src/main.tsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Tu App.tsx
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Importante: BrowserRouter aquí
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguageContext } from './contexts/LanguageContext';
import { IntlProvider } from 'react-intl';

// Componente intermedio para acceder al contexto del idioma y configurar IntlProvider
const RootWithIntl: React.FC = () => {
  const { locale, messages } = useLanguageContext(); // Obtiene locale y messages del LanguageProvider

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      onError={(err) => {
        if (err.code === 'MISSING_TRANSLATION') {
          // console.warn('Missing translation:', err.message); // Puedes descomentar para debug
          return;
        }
        console.error(err);
      }}
    >
      <App /> {/* App y todos sus hijos ahora están dentro del contexto de IntlProvider */}
    </IntlProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* BrowserRouter envuelve todo para el enrutamiento */}
      <AuthProvider>
        <LanguageProvider> {/* LanguageProvider provee el idioma y los mensajes */}
          <RootWithIntl />   {/* RootWithIntl consume eso y configura IntlProvider antes de renderizar App */}
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);