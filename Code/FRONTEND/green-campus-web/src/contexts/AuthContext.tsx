// src/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { auth, googleProvider } from "../firebase"; // Asegúrate de que la ruta sea correcta
import {
  browserLocalPersistence,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  setPersistence,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

interface AuthContextProps {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createUserWithEmail: (email: string, password: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  authChecked: boolean;
}
const AuthContext = createContext<AuthContextProps>({
  user: null,
  authChecked: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  createUserWithEmail: async () => {},
  handleSignOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);  // Se ha comprobado la autenticación
    });
    return unsubscribe;
  }, []);

  if (!authChecked) {
    return null;  // O puedes mostrar un componente de carga aquí
  }

  const handleError = (error: any) => {
    setError(error.message);
    console.error(error);
  };

  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result); // Redirige al usuario a la página principal
    } catch (error) {
      handleError(error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log(result); // Redirige al usuario a la página principal
    } catch (error) {
      handleError(error);
    }
  };

  const createUserWithEmail = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(result); // Redirige al usuario a la página principal
    } catch (error) {
      handleError(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Usuario cerró sesión exitosamente"); // Redirige al usuario a la página principal
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithEmail,
        createUserWithEmail,
        handleSignOut,
        authChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
