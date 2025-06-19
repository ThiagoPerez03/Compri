import React from "react";
import './LengthTable.css';
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
    title: {
      display: true,
      text: 'Longitud',
      align: 'start',
      color: 'rgba(43, 54, 116, 1)',
      font: {
        size: 22,
        weight: 'bold',
      }
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      categoryPercentage: 0.95, // default es 0.8
      barPercentage: 0.95,      // default es 0.9
      ticks: {
        color: 'rgba(43, 54, 116, 1)',
        font: {
          size: 14,
          weight: 'bold',
        }
      },
      grid: {
        display: false,         // para sacar la cuadrícula
      }
    },
    y: {
      ticks: {
        display: false,
      },
      grid: {
        display: false,          // sacar la cuadrícula del eje y también
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
      label: 'Longitud de palabra',
      data: DATOS.map(e => e.freq),
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) return null;

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(43, 54, 116, 1)');
        gradient.addColorStop(1, 'rgba(43, 54, 116, 0.3)');
        return gradient;
      },
      borderWidth: 0,
      barThickness: 20,
      borderRadius: 20,
      borderSkiped: false,
    }
  ]
};

const LengthTable = () => {
  return (
    <div id='length-table'>
      <Bar options={options} data={data} />
    </div>
  );
}

export default LengthTable;
