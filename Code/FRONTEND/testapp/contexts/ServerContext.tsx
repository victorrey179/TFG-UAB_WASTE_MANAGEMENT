/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_POINTS,
  TOTAL_POINTS_USER,
  POINTS_PER_CONTAINER,
  MODIFY_USER,
  ADD_USER,
  COORDINATES_CONTAINERS,
} from "./Queries";
import { useAuth } from "./AuthContext";

interface Container {
  idContainer: string;
}

interface LocationInfo {
  containers: Container[];
  coordinates: [number, number];
}

// Tipo para la respuesta de la API
interface ApiResponse {
  data: {
    allInfo: LocationInfo[];
  };
}

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

// Definición de un tipo para el objeto principal que contiene los contenedores
interface IPointsPerContainer {
  amarillo: IContainerData;
  azul: IContainerData;
  verde: IContainerData;
  marron: IContainerData;
  gris: IContainerData;
}

// Definición del tipo para la estructura de datos completa
interface IPointsPerContainerData {
  data: {
    pointsPerContainer: IPointsPerContainer;
  };
}

const ServerContext = createContext<any>(null);

export function useServer() {
  return useContext(ServerContext);
}

interface ServerProviderProps {
  children: ReactNode;
}

export const ServerProvider: React.FC<ServerProviderProps> = ({ children }) => {
  const [containerColors, setContainerColors] = useState<Container[]>([]);
  const [pointsPerContainer, setPointsPerContainer] =
    useState<IPointsPerContainerData>();
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const { user } = useAuth();

  // Connect to the server and handle updates

  const saveContainerColors = (containersData: Container[]) => {
    setContainerColors(containersData);
  };

  const {
    data: pointsPerContainerData,
    error: pointsPerContainerError,
    loading: pointsPerContainerLoading,
  } = useQuery(POINTS_PER_CONTAINER, { variables: { niu: user } });

  useEffect(() => {
    if (pointsPerContainerData) {
      console.log("data: ", pointsPerContainerData);
      setPointsPerContainer(pointsPerContainerData);
    }
  }, [pointsPerContainerData]);
  useEffect(() => {
    if (pointsPerContainerError) {
      console.log("error" + pointsPerContainerError);
    }
  }, [pointsPerContainerError]);
  useEffect(() => {
    if (pointsPerContainerLoading) {
      console.log("loading" + pointsPerContainerLoading);
    }
  }, [pointsPerContainerLoading]);

  const {
    data: totalPointsData,
    error: totalPointsError,
    loading: totalPointsLoading,
  } = useQuery(TOTAL_POINTS_USER, { variables: { user }});

  useEffect(() => {
    if (totalPointsData) {
      setTotalPoints(totalPointsData);
    }
  }, [totalPointsData]);

  // Provide functions and state through context
  return (
    <ServerContext.Provider
      value={{
        totalPoints,
        pointsPerContainer,
        containerColors,
        saveContainerColors,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServerContext = () => useContext(ServerContext);

export default ServerProvider;
