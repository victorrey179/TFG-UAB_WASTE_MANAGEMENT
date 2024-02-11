import React, { useState } from "react";
import { useServerContext } from "../../contexts/ServerContext"; // Asegúrate de que la ruta de importación sea correcta
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { IconButton } from "@mui/material";

const scale = (
  num: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
const getColorForSignal = (signal: number): string => {
  if (signal > -76) {
    return "#008000"; // Light green for strong signal
  } else if (signal <= -76 && signal > -89) {
    return "#7CFC00"; // Green for good signal
  } else if (signal <= -89 && signal > -97) {
    return "#FFA500"; // Orange for weak signal
  } else {
    return "#FF0000"; // Red for very weak signal
  }
};

const getColorForTemperature = (temperature: number): string => {
  if (temperature < 4) {
    return "#F0F8FF"; // AliceBlue, a whitish-blue color for cold temperatures
  } else if (temperature >= 4 && temperature < 18) {
    return "#8DD8FF"; // LightBlue, a blue-whitish color for cool temperatures
  } else if (temperature >= 18 && temperature < 30) {
    return "#00B000"; // Green for mild temperatures
  } else if (temperature >= 30 && temperature < 40) {
    return "#FFFF00"; // Yellow for warm temperatures
  } else if (temperature >= 40 && temperature <= 49) {
    return "#FF0000"; // Red for hot temperatures
  } else {
    return "#FF60FF"; // Red for hot temperatures
  }
};

const getColorForFilling = (filling: number): string => {
  if (filling < 20) {
    return "#8DD8FF"; // AliceBlue, a whitish-blue color for cold temperatures
  } else if (filling >= 21 && filling < 40) {
    return "#10B940"; // LightBlue, a blue-whitish color for cool temperatures
  } else if (filling >= 41 && filling < 60) {
    return "#FFFF00"; // Green for mild temperatures
  } else if (filling >= 61 && filling < 75) {
    return "#FFBF00"; // Yellow for warm temperatures
  } else if (filling >= 76 && filling <= 90) {
    return "#FF5500"; // Red for hot temperatures
  } else {
    return "#FF0000"; // Red for hot temperatures
  }
};

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

const GeneralState: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
   const { data } = useServerContext();

  // Aquí puedes renderizar condicionalmente basado en los datos disponibles
  // Por ejemplo, si los datos no están cargados, puedes mostrar un indicador de carga
  if (!data) {
    return <div className="loading-container rounded-xl"></div>;
  }
  const datad: DashboardDataItem[] = [
    {
      containerId: "azul",
      date: "2024-01-10",
      measurements: {
        acceleration: [0.5, 0.2, 0.8],
        distance: 140,
        humidity: 60,
        signal: -65,
        temperature: 10,
      },
    },
    {
      containerId: "amarillo",
      date: "2024-01-10",
      measurements: {
        acceleration: [0.2, 0.1, 0.3],
        distance: 90,
        humidity: 55,
        signal: -78,
        temperature: 10,
      },
    },
    {
      containerId: "verde",
      date: "2024-01-10",
      measurements: {
        acceleration: [0.2, 0.1, 0.3],
        distance: 110,
        humidity: 55,
        signal: -81,
        temperature: 12,
      },
    },
    {
      containerId: "marron",
      date: "2024-01-10",
      measurements: {
        acceleration: [0.2, 0.1, 0.3],
        distance: 75,
        humidity: 55,
        signal: -81,
        temperature: 18,
      },
    },
    {
      containerId: "gris",
      date: "2024-01-10",
      measurements: {
        acceleration: [0.2, 0.1, 0.3],
        distance: 20,
        humidity: 55,
        signal: -76,
        temperature: 13,
      },
    },
    // Add more data items as needed
  ];

  const next = () =>
    setActiveIndex((prevIndex) => (prevIndex + 1) % datad.length);
  const prev = () =>
    setActiveIndex((prevIndex) => (prevIndex - 1 + datad.length) % datad.length);

  const item = datad[activeIndex]; // Asegúrate de que data no está vacío

  return (
    <div className="flex flex-col items-center justify-center w-full my-5">
      <div className="navigation-container flex flex-row items-center justify-between w-full">
        <IconButton onClick={prev} size="small">
          <ArrowBackIosOutlinedIcon fontSize="inherit" className="text-white" />
        </IconButton>
        <div
          className={`color-bar w-[30%] h-2 rounded ${
            item.containerId.includes("amarillo")
              ? "bg-yellow-500"
              : item.containerId.includes("azul")
              ? "bg-blue-500"
              : item.containerId.includes("verde")
              ? "bg-green-500"
              : item.containerId.includes("marron")
              ? "bg-brown"
              : "bg-gray-500"
          }`}
        ></div>
        <IconButton onClick={next} size="small">
          <ArrowBackIosOutlinedIcon fontSize="inherit" className="text-white rotate-180" />
        </IconButton>
      </div>
      <div className="activity-ring-container my-1">
        <ActivityRings
          key={item.containerId}
          rings={[
            {
              filledPercentage:
                scale(item.measurements.signal, -135, 0, 0, 100) / 100,
              color: getColorForSignal(item.measurements.signal),
            },
            {
              filledPercentage:
                scale(item.measurements.temperature, -40, 50, 0, 100) / 100,
              color: getColorForTemperature(item.measurements.temperature),
            },
            {
              filledPercentage: item.measurements.humidity / 100,
              color: "#4D8ED9",
            },
            {
              filledPercentage:
                1 - scale(item.measurements.distance, 0, 170, 0, 100) / 100,
              color: getColorForFilling(
                100 - scale(item.measurements.distance, 0, 170, 0, 100)
              ),
            },
          ]}
          options={{
            containerHeight: "19vh",
            containerWidth: "19vh",
          }}
        />
      </div>
      <div className="data-container flex flex-col items-center justify-center w-full">
        <div className="flex flex-row gap-1 items-center">
          <WaterDropOutlinedIcon style={{ color: "#4D8ED9" }} />
          <h2 className="text-lg font-bold" style={{ color: "#4D8ED9" }}>
            {`${item.measurements.humidity} %`}
          </h2>
        </div>
        <div className="flex flex-row gap-1 items-center">
          <DeviceThermostatOutlinedIcon
            style={{
              color: getColorForTemperature(item.measurements.temperature),
            }}
          />
          <h2
            className="text-lg font-bold"
            style={{
              color: getColorForTemperature(item.measurements.temperature),
            }}
          >
            {`${item.measurements.temperature} ºC`}
          </h2>
        </div>
        <div className="flex flex-row gap-1 items-center">
          <SensorsOutlinedIcon
            style={{ color: getColorForSignal(item.measurements.signal) }}
          />
          <h2
            className="text-lg font-bold"
            style={{ color: getColorForSignal(item.measurements.signal) }}
          >
            {`${item.measurements.signal} RSSI`}
          </h2>
        </div>
        <div className="flex flex-row gap-1 items-center">
          <DeleteOutlineOutlinedIcon
            style={{
              color: getColorForFilling(
                100 - scale(item.measurements.distance, 0, 170, 0, 100)
              ),
            }}
          />
          <h2
            className="flex text-lg font-bold"
            style={{
              color: getColorForFilling(
                100 - scale(item.measurements.distance, 0, 170, 0, 100)
              ),
            }}
          >
            {`${(
              100 - scale(item.measurements.distance, 0, 170, 0, 100)
            ).toFixed(2)} %`}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default GeneralState;
