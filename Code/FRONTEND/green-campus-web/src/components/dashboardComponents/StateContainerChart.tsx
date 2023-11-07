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
  labels: ["Hace 4 min", "Hace 3 min", "Hace 2 min", "Hace 1 min", "Última lectura"],
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
    }
  ],
};

const options: ChartOptions<"line"> = {
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        display: false,  // Esto elimina las líneas de cuadrícula horizontales
      },
      ticks: {
        // Adjust the callback to handle both string and number types
        callback: (tickValue: string | number) => {
          // Ensure we're working with a number before appending '%'
          const value =
            typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
          return `${value}%`;
        },
      },
    },
    x: {
      grid: {
        display: false,  // Esto elimina las líneas de cuadrícula verticales
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        usePointStyle: true,  // Esto hará que las leyendas sean redondas
        pointStyle: 'circle', // Asegúrate de que el estilo del punto es un círculo
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

const StateContainerChart: React.FC = () => {
  return (
    <div className="w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default StateContainerChart;
