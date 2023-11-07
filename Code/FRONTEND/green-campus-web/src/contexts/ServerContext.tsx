import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

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
  containerName: string;
  date: string;
  measurements: Measurements;
}

interface ZoneDataItem {
  id: String | null;
}

interface StatisticsDataItem {
  containerName: string;
  statistics: DashboardDataItem[];
}

// Update the ServerContextData interface to use an array of DashboardDataItem
interface ServerContextData {
  data: DashboardDataItem[] | null;
  zones: ZoneDataItem[] | null;
  currentZoneIndex: number;
  statistics: StatisticsDataItem[] | null;
  setData: React.Dispatch<React.SetStateAction<DashboardDataItem[] | null>>;
  setZones: React.Dispatch<React.SetStateAction<ZoneDataItem[] | null>>;
  setCurrentZoneIndex: React.Dispatch<React.SetStateAction<number>>;
  nextZone: () => void;
  prevZone: () => void;
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
}

// Provide a default context value that matches the interface
const defaultContextValue: ServerContextData = {
  data: null,
  zones: null,
  currentZoneIndex: 0,
  statistics: null,
  setData: () => {},
  setZones: () => {},
  setCurrentZoneIndex: () => {},
  nextZone: () => {},
  prevZone: () => {},
  sliderValue: 1, // Valor inicial para el slider
  setSliderValue: () => {}, // Función de actualización vacía por defecto
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
  const [zones, setZones] = useState<ZoneDataItem[] | null>(null);
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState<number>(1);
  const [statistics, setStatistics] = useState<StatisticsDataItem[] | null>(
    null
  );

  // Connect to the server and handle updates
  useEffect(() => {
    const fetchData = async () => {
      // Asegúrate de que las zonas se hayan cargado antes de intentar acceder a ellas
      if (!zones || zones.length === 0) return;

      // Construye la URL con el ID de la zona actual
      const currentZoneId = zones[currentZoneIndex]?.id;
      if (!currentZoneId) return; // Maneja el caso donde currentZoneId pueda ser nulo o indefinido

      const url = `http://192.168.1.132:3050/dashboardhts/${currentZoneId}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data: DashboardDataItem[] = await response.json();
          setData(data);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchData();
    // Añade currentZoneIndex y zones al array de dependencias para que se vuelva a ejecutar cuando cambien
  }, [currentZoneIndex, zones]);

  useEffect(() => {
    const fetchStatistics = async () => {
      // Repite la lógica para asegurarte de que las zonas estén cargadas y para construir la URL
      if (!zones || zones.length === 0) return;

      const currentZoneId = zones[currentZoneIndex]?.id;
      if (!currentZoneId) return;

      const url = `http://192.168.1.132:3050/dashboardstatistics/${currentZoneId}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const statistics: StatisticsDataItem[] = await response.json();
          setStatistics(statistics);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchStatistics();
    // Añade currentZoneIndex y zones al array de dependencias para que se vuelva a ejecutar cuando cambien
  }, [currentZoneIndex, zones]);

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

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch("http://192.168.1.132:3050/zones");
        if (response.ok) {
          const zones: ZoneDataItem[] = await response.json();
          setZones(zones);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchZones();

    // Set up a polling mechanism here if you need real-time updates
  }, []);

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
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

// A hook to use the ServerContext in components
export const useServerContext = () => useContext(ServerContext);

export default ServerProvider;
