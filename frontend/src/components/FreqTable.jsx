import React from "react";
import './FreqTable.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,

);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    x: {
      categoryPercentage: 0.95, // default es 0.8
      barPercentage: 0.95,      // default es 0.9
      grid: {
        display: false          // para sacar la cuadrícula
      }
    },
    y: {
      grid: {
        display: false          // sacar la cuadrícula del eje y también
      }
    }
  }
};

const DATOS = [
  {
    word: 'p',
    freq: 15,
  },
  {
    word: 'a',
    freq: 23,
  },
  {
    word: 'b',
    freq: 21
  }
];

export const data = {
  labels: DATOS.map(e => e.word),
  datasets: [
    {
      label: 'Frecuencia de Bytes',
      data: DATOS.map(e => e.freq),
      backgroundColor: 'rgba(43, 54, 116, 1)',
      borderWidth: 0,
      barThickness: 20,
      borderRadius: 20,
      borderSkiped: false,
    }
  ]
};

const FreqTable = () => {
  return (
    <div id='freq-table'>
      <Bar options={options} data={data}  />
    </div>
  );
}

export default FreqTable;
