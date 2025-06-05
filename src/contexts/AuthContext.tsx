// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, FirebaseUser } from 'firebase/auth';
import { auth } from '../../firebase-config'; // Tu instancia de auth

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  // Aquí podrías añadir roles si los gestionas en tu app después de obtenerlos
  // roles: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  // const [roles, setRoles] = useState<string[]>([]); // Ejemplo si gestionas roles

  useEffect(() => {
    // Escucha cambios en el estado de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

    });

    // Limpiar el observador al desmontar el componente
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,

  };

  // No renderizar nada hasta que la carga inicial del estado de auth haya terminado
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};