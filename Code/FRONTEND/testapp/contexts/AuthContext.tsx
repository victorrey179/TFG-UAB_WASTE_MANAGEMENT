/* eslint-disable prettier/prettier */
// AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
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

interface IUserProfileData {
  name: string;
  surname: string;
  studies: string;
  college: string;
  niu: string;
  totalpoints: number;
}

interface IUser {
  _id: string;
  userdata: IUserData;
}

// Crea el contexto con el valor inicial
const AuthContext = createContext<any>(null);

export function useAuth() {
  return useContext(AuthContext);
}

// Proveedor del contexto que envolverá la aplicación en App.tsx
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<string | undefined>("");
  const [userData, setUserData] = useState<IUserProfileData | undefined>();
  const rootSegments = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    async function loadUserNiu() {
      try {
        const storedUserNiu = await AsyncStorage.getItem("@user_niu");
        if (storedUserNiu !== null) {
          setUser(storedUserNiu);
        }
      } catch (e) {
        console.error("Error al leer el niu de AsyncStorage", e);
      }
    }

    loadUserNiu();
  }, []);

  useEffect(() => {
    async function loadUserData() {
      try {
        const storedUserName = await AsyncStorage.getItem("@user_name");
        const storedUserSurname = await AsyncStorage.getItem("@user_surname");
        const storedUserStudies = await AsyncStorage.getItem("@user_studies");
        const storedUserCollege = await AsyncStorage.getItem("@user_college");
        const storedUserPoints = await AsyncStorage.getItem("@user_points");
        const storedUserData: IUserProfileData = {
          name: storedUserName || "",
          surname: storedUserSurname || "",
          studies: storedUserStudies || "",
          college: storedUserCollege || "",
          niu: user || "",
          totalpoints: parseInt(storedUserPoints || "0"),
        };
        if (storedUserData !== null) {
          setUserData(storedUserData);
        }
      } catch (e) {
        console.error("Error al leer el niu de AsyncStorage", e);
      }
    }

    loadUserData();
  }, []);

  useEffect(() => {
    if (user === undefined) return;
    if (!user && rootSegments !== "(auth)") {
      router.replace("/(auth)/signin");
    } else if (user && rootSegments !== "(app)") {
      router.replace("/");
    }
  }, [user, rootSegments]);

  async function signin(userData: IUserData) {
    try {
      await AsyncStorage.setItem("@user_niu", userData.niu);
      await AsyncStorage.setItem("@user_name", userData.name);
      await AsyncStorage.setItem("@user_surname", userData.surname);
      await AsyncStorage.setItem("@user_studies", userData.studies);
      await AsyncStorage.setItem("@user_college", userData.college);
      await AsyncStorage.setItem(
        "@user_points",
        userData.totalpoints.toString()
      );
      setUser(userData.niu);
      setUserData(userData);
    } catch (e) {
      console.error("Error al guardar el niu en AsyncStorage", e);
    }
  }

  async function signout() {
    try {
      await AsyncStorage.removeItem("@user_niu");
      await AsyncStorage.removeItem("@user_name");
      await AsyncStorage.removeItem("@user_surname");
      await AsyncStorage.removeItem("@user_studies");
      await AsyncStorage.removeItem("@user_college");
      await AsyncStorage.removeItem("@user_points");
      setUser("");
      setUserData(undefined);
    } catch (e) {
      console.error("Error al eliminar el niu de AsyncStorage", e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, userData, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}
