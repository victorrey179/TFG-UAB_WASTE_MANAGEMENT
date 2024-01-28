/* eslint-disable prettier/prettier */
// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";

interface IContainerData {
  points: number;
  items: number;
}

interface IUserData {
  name: string;
  surname: string;
  password: string;
  studies: string;
  college: string;
  niu: string;
  totalpoints: number;
  container_data: {
    amarillo: IContainerData;
    azul: IContainerData;
    verde: IContainerData;
    marron: IContainerData;
    gris: IContainerData;
  };
}

interface IUser {
  _id: string;
  userdata: IUserData;
}

type AuthContextType = {
  //setUserToken: (token: string) => void
  //userToken: string | null;
  //currentUser: IUser | null;
  //setCurrentUser: (user: IUser) => void
  user: string | undefined;
  signin: () => void;
  signout: () => void;
};

// Valor inicial para el contexto
const authContextInitialValues: AuthContextType = {
  //userToken: null,
  //currentUser: null,
  //setUserToken: () => {},
  //setCurrentUser: () => {},
  user: null,
  signin: () => {},
  signout: () => {},
};

// Crea el contexto con el valor inicial
export const AuthContext = createContext<AuthContextType>(
  authContextInitialValues
);

type Props = {
  children: ReactNode;
};

// Proveedor del contexto que envolverá la aplicación en App.tsx
export const AuthProvider: React.FC<Props> = ({ children }) => {
  // const [userToken, setUserToken] = useState<string | null>(null);
  // const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [user, setUser] = useState<string | undefined>("v");
  const rootSegments = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (!user && rootSegments !== "(auth)") {
      router.replace("/(auth)/login");
    } else if (user && rootSegments !== "(app)") {
      router.replace("/");
    }
  }, [user, rootSegments]);

  function signin() {
    setUser("victor");
  }

  function signout() {
    setUser(undefined);
  }

  // Cargar el token del usuario al iniciar la aplicación
  // useEffect(() => {
  //   const bootstrapAsync = async () => {
  //     try {
  //       // Intenta recuperar el token del usuario desde el almacenamiento
  //       const token = await AsyncStorage.getItem('userToken');
  //       if (token) {
  //         // Si hay un token, inicia sesión con el token
  //         setUserToken(token);
  //       }
  //     } catch (e) {
  //       // Restablecer token si hay errores de lectura
  //       console.error('Failed to load user token:', e);
  //     }
  //     // Después de obtener el token (o no), actualiza el estado
  //     setUserToken(userToken);
  //   };

  //   bootstrapAsync();
  // }, [userToken]);

  // // Cargar el usuario al iniciar la aplicación
  // useEffect(() => {
  //   const bootstrapAsync = async () => {
  //     try {
  //       // Intenta recuperar el usuario desde el almacenamiento
  //       const user = await AsyncStorage.getItem('currentUser');
  //       if (user) {
  //         // Si hay un usuario, inicia sesión con el usuario
  //         setCurrentUser(JSON.parse(user));
  //       }
  //     } catch (e) {
  //       // Restablecer usuario si hay errores de lectura
  //       console.error('Failed to load user:', e);
  //     }
  //     // Después de obtener el usuario (o no), actualiza el estado
  //     setCurrentUser(currentUser);
  //   };

  //   bootstrapAsync();
  // }, [currentUser]);

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
