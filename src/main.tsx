// src/main.tsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguageContext } from './contexts/LanguageContext';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux'; // Importamos el Provider de Redux
import store from './redux/store'; 


const RootWithIntlAndRedux: React.FC = () => {
  const { locale, messages } = useLanguageContext();

  return (
    <ReduxProvider store={store}> 
      <IntlProvider
        locale={locale}
        messages={messages}
        onError={(err) => {
          if (err.code === 'MISSING_TRANSLATION') return;
          console.error(err);
        }}
      >
        <App />
      </IntlProvider>
    </ReduxProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <RootWithIntlAndRedux /> 
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);