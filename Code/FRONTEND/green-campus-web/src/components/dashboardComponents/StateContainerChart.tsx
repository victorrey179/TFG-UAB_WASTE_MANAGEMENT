import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ChartOptions,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useServerContext } from "../../contexts/ServerContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  // Eje X: Puedes poner las fechas o las horas aquí
  labels: [
    "Hace 4 min",
    "Hace 3 min",
    "Hace 2 min",
    "Hace 1 min",
    "Última lectura",
  ],
  datasets: [
    {
      label: "",
      // Eje Y: Los valores de porcentaje para cada punto en el tiempo
      data: [10, 40, 30, 2, 85],
      fill: false,
      backgroundColor: "rgb(255, 235, 59)",
      borderColor: "rgba(255, 235, 59, 0.3)",
      radius: 1,
    },
    {
      label: "",
      // Eje Y: Los valores de porcentaje para cada punto en el tiempo
      data: [0, 90, 85, 40, 70],
      fill: false,
      backgroundColor: "rgb(59, 130, 246)",
      borderColor: "rgba(59, 130, 246, 0.3)",
      radius: 1,
    },
    {
      label: "",
      // Eje Y: Los valores de porcentaje para cada punto en el tiempo
      data: [20, 45, 80, 50, 60],
      fill: false,
      backgroundColor: "rgb(107, 114, 128)",
      borderColor: "rgba(107, 114, 128, 0.3)",
      radius: 1,
    },
    {
      label: "",
      // Eje Y: Los valores de porcentaje para cada punto en el tiempo
      data: [90, 2, 10, 90, 4],
      fill: false,
      backgroundColor: "rgb(121,85,72)",
      borderColor: "rgba(121,85,72, 0.3)",
      radius: 1,
    },
    {
      label: "",
      // Eje Y: Los valores de porcentaje para cada punto en el tiempo
      data: [60, 35, 2, 10, 95],
      fill: false,
      backgroundColor: "rgb(20, 83, 45)",
      borderColor: "rgba(20, 83, 45, 0.3)",
      radius: 1,
    },
  ],
};

const StateContainerChart: React.FC = () => {
  const { statistics } = useServerContext();
  if (!statistics) {
    return <div className="loading-container rounded-xl"></div>;
  }

  interface ContainerColors {
    backgroundColor: string;
    borderColor: string;
  }

  const containerColorMap: Record<string, ContainerColors> = {
    AMARILLO: {
      backgroundColor: "rgb(255, 235, 59, 0.9)",
      borderColor: "rgba(255, 235, 59, 0.3)",
    },
    AZUL: {
      backgroundColor: "rgb(59, 130, 246)",
      borderColor: "rgba(59, 130, 246, 0.3)",
    },
    GRIS: {
      backgroundColor: "rgb(107, 114, 128)",
      borderColor: "rgba(107, 114, 128, 0.3)",
    },
    MARRON: {
      backgroundColor: "rgb(121,85,72)",
      borderColor: "rgba(121,85,72, 0.3)",
    },
    VERDE: {
      backgroundColor: "rgb(20, 83, 45)",
      borderColor: "rgba(20, 83, 45, 0.3)",
    },
  };

  // Aquí asumo que cada contenedor tiene un conjunto de mediciones (por ejemplo, temperatura)
  // y que quieres graficar estas mediciones en el tiempo.

  // Crear datasets dinámicamente a partir de los datos de estadísticas
  console.log(statistics);
  const datasets =
    statistics.map((statItem) => {
      const datas = statItem.records.map((stat) => {
        return stat.measurements.temperature ?? null;
      }); // Filtra los valores nulos
      console.log(datas);
      const colorName =
        statItem.containerId.split("_").pop()?.toUpperCase() || "DEFAULT";
      const colors = containerColorMap[colorName] || {
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      };

      return {
        label: "",
        data: datas,
        fill: false,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: 1,
      };
    }) || [];

  // Crear etiquetas para el eje X (por ejemplo, fechas de las mediciones)
  const labels = [
    "Hace 4 min",
    "Hace 3 min",
    "Hace 2 min",
    "Hace 1 min",
    "Última lectura",
  ];

  // Data para el gráfico
  const data = {
    labels: labels,
    datasets: datasets,
  };

  // Opciones para el gráfico
  const options: ChartOptions<"line"> = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false, // Esto elimina las líneas de cuadrícula horizontales
        },
        ticks: {
          color: "#BDC0BF",
          stepSize: 10,
          // Adjust the callback to handle both string and number types
          callback: (tickValue: string | number) => {
            // Ensure we're working with a number before appending '%'
            const value =
              typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return `${value} %`;
          },
        },
      },
      x: {
        grid: {
          display: false, // Esto elimina las líneas de cuadrícula verticales
        },
        ticks: {
          color: "#BDC0BF", // Cambia el color de los ticks del eje X a blanco
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true, // Esto hará que las leyendas sean redondas
          pointStyle: "circle", // Asegúrate de que el estilo del punto es un círculo
        },
      },
    },
    // This will make it not create a new animation for updates
    // animation: {
    //   duration: 0,
    // },
    // This will make sure the chart does not perform a complete rerender with each update
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="w-full p-1">
      <Line data={data} options={options} />
    </div>
  );
};

export default StateContainerChart;
