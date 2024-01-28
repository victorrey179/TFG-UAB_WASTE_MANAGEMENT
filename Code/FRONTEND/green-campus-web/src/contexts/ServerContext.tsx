/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

import { useQuery, useSubscription } from "@apollo/client";
import {
  ZONES_QUERY,
  STATISTICS_QUERY,
  DASHBOARD_HTS_QUERY,
  POINTS_TO_BE_COLLECTED,
} from "./Queries";
import { CREATED_DATA, UPDATED_DATA } from "./Subscriptions";

// Define the expected shape of measurements
interface Measurements {
  acceleration: number[];
  distance: number;
  humidity: number;
  signal: number;
  temperature: number;
}

// Define the expected shape of the dashboard data item
interface DashboardDataItem {
  containerId: string;
  date: string;
  measurements: Measurements;
}

interface Statistics {
  date: string;
  id: string;
  measurements: Measurements;
}
interface Records {
  idContainer: string;
}

interface RecordsDataItem {
  containerId: string;
  records: Records[];
}

interface StatisticsDataItem {
  containerId: string;
  records: Statistics[];
}

interface PointsToBeCollected {
  zoneId: string;
  coordinates: number[];
  containers: RecordsDataItem[];
}
const marks = [
  { label: "1min" },
  { label: "5min" },
  { label: "10min" },
  { label: "30min" },
  { label: "1h" },
  { label: "2h" },
  { label: "6h" },
  { label: "12h" },
  { label: "1d" },
  { label: "2d" },
  { label: "5d" },
  { label: "1sem" },
  { label: "2sem" },
  { label: "3sem" },
  { label: "1mes" },
];
// Update the ServerContextData interface to use an array of DashboardDataItem
interface ServerContextData {
  data: DashboardDataItem[] | null;
  zones: String[] | null;
  currentZoneIndex: number;
  statistics: StatisticsDataItem[] | null;
  setData: React.Dispatch<React.SetStateAction<DashboardDataItem[] | null>>;
  setZones: React.Dispatch<React.SetStateAction<String[]>>;
  setCurrentZoneIndex: React.Dispatch<React.SetStateAction<number>>;
  nextZone: () => void;
  prevZone: () => void;
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  pointsToBeCollected: PointsToBeCollected[];
}

// Provide a default context value that matches the interface
const defaultContextValue: ServerContextData = {
  data: null,
  zones: [],
  currentZoneIndex: 0,
  statistics: null,
  setData: () => {},
  setZones: () => {},
  setCurrentZoneIndex: () => {},
  nextZone: () => {},
  prevZone: () => {},
  sliderValue: 0, // Valor inicial para el slider
  setSliderValue: () => {}, // Función de actualización vacía por defecto
  pointsToBeCollected: [],
};

// Create a context with the default value
export const ServerContext =
  createContext<ServerContextData>(defaultContextValue);

interface ServerProviderProps {
  children: ReactNode;
}

// Define a provider component with proper typing for its props
export const ServerProvider: React.FC<ServerProviderProps> = ({ children }) => {
  const [data, setData] = useState<DashboardDataItem[] | null>(null);
  const [zones, setZones] = useState<String[]>([]);
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [statistics, setStatistics] = useState<StatisticsDataItem[] | null>(
    null
  );
  const [pointsToBeCollected, setPointsToBeCollected] = useState<
    PointsToBeCollected[]
  >([]);

  const {
    data: dashboardData,
    error: dashboardError,
    loading: dashboardLoading,
  } = useQuery(DASHBOARD_HTS_QUERY, {
    variables: {
      zoneId: zones.length > 0 ? zones[currentZoneIndex] : null,
    },
    skip: zones.length === 0, // Evita ejecutar la consulta si no hay zonas
  });

  // Connect to the server and handle updates
  useEffect(() => {
    if (dashboardData) {
      setData(dashboardData.dashboardHTS);
    }
  }, [data, dashboardData, currentZoneIndex, zones]);

  const {
    data: statisticsData,
    error: statisticsError,
    loading: statisticsLoading,
  } = useQuery(STATISTICS_QUERY, {
    variables: {
      zoneId: zones.length > 0 ? zones[currentZoneIndex] : null,
      duration: marks[sliderValue].label,
    },
    skip: zones.length === 0, // Evita ejecutar la consulta si no hay zonas
  });

  useEffect(() => {
    if (statisticsData) {
      setStatistics(statisticsData.dashboardStatistics);
    }
    // Añade currentZoneIndex y zones al array de dependencias para que se vuelva a ejecutar cuando cambien
  }, [statisticsData, currentZoneIndex, zones, sliderValue]);

  const nextZone = () => {
    setCurrentZoneIndex(
      (prevIndex) => (prevIndex + 1) % (zones ? zones.length : 1)
    );
  };

  const prevZone = () => {
    setCurrentZoneIndex(
      (prevIndex) =>
        (prevIndex - 1 + (zones ? zones.length : 1)) %
        (zones ? zones.length : 1)
    );
  };

  const { data: zonesData } = useQuery(ZONES_QUERY);
  useEffect(() => {
    if (zonesData) {
      setZones(zonesData.zoneIds);
    }
  }, [zonesData, zones]);

  const { data: zonesInfo } = useQuery(POINTS_TO_BE_COLLECTED);
  useEffect(() => {
    if (zonesInfo) {
      const filteredPointsToBeCollected = zonesInfo.pointsToBeCollected
        .map((zone: PointsToBeCollected) => {
          return zone;
        })
        // Filtrar zonas que tengan containers después de la filtración
        .filter(
          (zone: PointsToBeCollected) =>
            zone.containers && zone.containers.length > 0
        );

      // Actualiza el estado con los puntos filtrados
      setPointsToBeCollected(filteredPointsToBeCollected);
      // Asumo que tienes una función setPointsToBeCollected para actualizar el estado
    }
  }, [zonesInfo]);

  // Pass the state and updater function through the context
  return (
    <ServerContext.Provider
      value={{
        data,
        setData,
        zones,
        setZones,
        currentZoneIndex,
        setCurrentZoneIndex,
        nextZone,
        prevZone,
        statistics,
        sliderValue,
        setSliderValue,
        pointsToBeCollected,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

// A hook to use the ServerContext in components
export const useServerContext = () => useContext(ServerContext);

export default ServerProvider;
