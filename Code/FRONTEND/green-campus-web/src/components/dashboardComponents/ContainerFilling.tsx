import React from "react";
import { useServerContext } from "../../contexts/ServerContext"; // Asegúrate de que la ruta de importación sea correcta
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { v4 as uuidv4 } from "uuid";

const scale = (
  num: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
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

const ContainerFilling: React.FC = () => {
  const { data } = useServerContext();

  // Aquí puedes renderizar condicionalmente basado en los datos disponibles
  // Por ejemplo, si los datos no están cargados, puedes mostrar un indicador de carga
  if (!data) {
    return <div className="loading-container rounded-xl"></div>;
  }

  // Si los datos están cargados, puedes mapearlos y mostrar la información correspondiente
  // Asegúrate de adaptar el código a cómo quieres que se vea tu interfaz
  return (
    <div className="flex flex-row p-4 items-center justify-between w-full">
      {/* Mapea los datos del contexto para renderizar cada grupo de anillos */}
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center rounded">
          <div className="flex h-[5%]">
            {/* Puedes decidir qué color mostrar basado en el nombre del contenedor o cualquier otro criterio */}
            <div
              className={`w-10 h-2 rounded ${
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
          <div className="flex h-[50%]">
            <ActivityRings
              key={uuidv4()}
              rings={[
                {
                  filledPercentage:
                    1 - scale(item.measurements.distance, 0, 170, 0, 100) / 100,
                  color: getColorForFilling(
                    100 - scale(item.measurements.distance, 0, 170, 0, 100)
                  ),
                },
              ]}
              options={{
                containerHeight: "17vh",
                containerWidth: "17vh",
                backgroundOpacity: 0.2,
              }}
            />
          </div>
          <div className="flex flex-col gap-2 h-[50%]">
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
      ))}
    </div>
  );
};

export default ContainerFilling;
