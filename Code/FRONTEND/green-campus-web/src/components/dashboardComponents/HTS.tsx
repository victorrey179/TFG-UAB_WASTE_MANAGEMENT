import React from "react";
import { useServerContext } from "../../contexts/ServerContext"; // Asegúrate de que la ruta de importación sea correcta
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';

const scale = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
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

const HTS: React.FC = () => {
  // Utiliza el hook para obtener los datos y la función de actualización
  const { data } = useServerContext();

  // Aquí puedes renderizar condicionalmente basado en los datos disponibles
  // Por ejemplo, si los datos no están cargados, puedes mostrar un indicador de carga
  if (!data) {
    return <div className="loading-container rounded-xl"></div>;
  }

  // Si los datos están cargados, puedes mapearlos y mostrar la información correspondiente
  // Asegúrate de adaptar el código a cómo quieres que se vea tu interfaz
  return (
    <div className="flex flex-col w-full">
      {/* Mapea los datos del contexto para renderizar cada grupo de anillos */}
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-row items-center justify-center gap-10 rounded"
        >
          <div className="ml-5 flex w-[10%]">
            {/* Puedes decidir qué color mostrar basado en el nombre del contenedor o cualquier otro criterio */}
            <div
              className={`w-2 h-10 rounded ${
                item.containerId.includes("amarillo")
                  ? "bg-yellow-500"
                  : item.containerId.includes("azul")
                  ? "bg-blue-500"
                  : item.containerId.includes("verde")
                  ? "bg-green-900"
                  : item.containerId.includes("marron")
                  ? "bg-brown"
                  : "bg-gray-500"
              }`}
            ></div>
          </div>
          <div className="flex w-[50%]">
            {/* Asumiendo que tienes una lógica para calcular los porcentajes basados en los datos */}
            <ActivityRings
              key={Date.now()}
              rings={[
                {
                  filledPercentage: scale(item.measurements.signal, -135, 0, 0, 100) / 100,
                  color: getColorForSignal(item.measurements.signal), // This will change the color based on the signal value
                },
                {
                  filledPercentage: scale(item.measurements.temperature, -40, 50, 0, 100)/100,
                  color: getColorForTemperature(item.measurements.temperature),
                }, // Asumiendo 30 como temperatura máxima para el porcentaje
                {
                  filledPercentage: item.measurements.humidity / 100,
                  color: "#4D8ED9",
                },
              ]}
              options={{
                containerHeight: "18vh",
                containerWidth: "18vh",
              }}
            />
          </div>
          <div className="flex flex-col w-[40%] gap-2">
            <div className="flex flex-row gap-1 items-center">
              <WaterDropOutlinedIcon style={{ color: "#4D8ED9" }} />
              <h2
                className="text-lg font-bold"
                style={{ color: "#4D8ED9" }}
              >
                {`${item.measurements.humidity} %`}
              </h2>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <DeviceThermostatOutlinedIcon style={{ color: getColorForTemperature(item.measurements.temperature) }} />
              <h2
                className="flex text-lg font-bold"
                style={{ color: getColorForTemperature(item.measurements.temperature) }}
              >
                {`${item.measurements.temperature} ºC`}
              </h2>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <SensorsOutlinedIcon style={{ color: getColorForSignal(item.measurements.signal) }} />
              <h2
                className="text-lg font-bold"
                style={{ color: getColorForSignal(item.measurements.signal) }}
              >
                {`${item.measurements.signal} RSSI`}
              </h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HTS;
