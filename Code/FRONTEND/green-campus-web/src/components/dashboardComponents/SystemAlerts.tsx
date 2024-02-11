import React from "react";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { useServerContext } from "../../contexts/ServerContext";

interface CardProps {
  zone: string;
  container: string;
  description: string;
  severity: "warning" | "error" | string; // Updated type to include string
}

const Card: React.FC<CardProps> = ({
  zone,
  container,
  description,
  severity,
}) => {
  // Determinar el icono y el color según la severidad
  const Icon = severity === "warning" ? WarningIcon : ErrorIcon;
  const color = severity === "warning" ? "text-yellow-500" : "text-red-500"; // Utilizando clases de Tailwind CSS para los colores

  return (
    <div className={`card ${severity} p-4 rounded-lg shadow-md mb-4 w-full`}>
      <div className="flex items-center gap-2">
        <Icon className={color} style={{ fontSize: 24 }} />
        <div className="flex-grow">
          <h3 className="card-title text-lg font-bold">
            {zone} - {container}
          </h3>
        </div>
      </div>
      <p className="card-description mt-2">{description}</p>
    </div>
  );
};

// Componente que contiene y muestra las tarjetas
const SystemAlerts: React.FC = () => {
  const { data } = useServerContext();

  // Aquí puedes renderizar condicionalmente basado en los datos disponibles
  // Por ejemplo, si los datos no están cargados, puedes mostrar un indicador de carga
  if (!data) {
    return <div className="loading-container rounded-xl"></div>;
  }
  const cardsData = [
    {
      zone: "Z1",
      container: "Verde",
      description: "Contenedor lleno.",
      severity: "warning",
    },
    {
      zone: "Z1",
      container: "Amarillo",
      description: "Conetendor lleno.",
      severity: "warning",
    },
    {
      zone: "Z4",
      container: "Marron",
      description: "Contenedor con alta temperatura.",
      severity: "warning",
    },
    {
      zone: "Z2",
      container: "Gris",
      description: "Contenedor lleno.",
      severity: "warning",
    },
    {
      zone: "Z3",
      container: "Marron",
      description: "Contenedor con alta temperatura.",
      severity: "warning",
    },
    {
      zone: "Z5",
      container: "Gris",
      description: "Contenedor lleno.",
      severity: "warning",
    },
    {
      zone: "Z5",
      container: "Verde",
      description: "Error sensor, revision urgente.",
      severity: "error",
    },
    // Agrega más datos aquí para probar el desplazamiento
  ];

  return (
    <div className="w-full p-2">
      <h2 className="text-xl font-bold mb-4">Avisos del sistema</h2>
      <div className="relative w-full">
        {" "}
        {/* Contenedor envolvente para manejar el desplazamiento */}
        <div className="overflow-y-auto max-h-96 w-full pr-0">
          {" "}
          {/* Asegúrate de que no hay padding/margen derecho */}
          {cardsData.map((card, index) => (
            <Card
              key={index}
              zone={card.zone}
              container={card.container}
              description={card.description}
              severity={card.severity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemAlerts;
