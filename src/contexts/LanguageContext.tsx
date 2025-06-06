import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import esMessages from '../lang/es.json';
import enMessages from '../lang/en.json';

interface LanguageContextProps {
  locale: string;
  messages: Record<string, string>; 
  changeLanguage: (lang: string) => void;
}

// Mapeo de mensajes
const messagesMap: { [key: string]: Record<string, string> } = {
  en: enMessages,
  es: esMessages,
};

// Crear el contexto
export const LanguageContext = createContext<LanguageContextProps>({
  locale: 'es', // Idioma por defecto
  messages: esMessages,
  changeLanguage: () => {},
});

// Proveedor del contexto
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Intenta obtener el idioma del navegador o del localStorage
  const getInitialLocale = () => {
    const browserLang = navigator.language.split('-')[0]; 
    const storedLang = localStorage.getItem('appLanguage');
    if (storedLang && messagesMap[storedLang]) {
      return storedLang;
    }
    if (browserLang && messagesMap[browserLang]) {
      return browserLang;
    }
    return 'es'; 
  };

  const [locale, setLocale] = useState<string>(getInitialLocale());

  useEffect(() => {
    // Guarda el idioma seleccionado en localStorage para persistencia
    localStorage.setItem('appLanguage', locale);
  }, [locale]);

  const changeLanguage = (lang: string) => {
    if (messagesMap[lang]) {
      setLocale(lang);
    } else {
      console.warn(`Language "${lang}" not supported. Falling back to default.`);
      setLocale('es'); 
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        messages: messagesMap[locale] || esMessages, 
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};