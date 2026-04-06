import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const WeeklyProgress = ({ data = [] }) => {
  const { t } = useTranslation();
  const chartLabels = data.length ? data.map((d) => d.day) : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartValues = data.length ? data.map((d) => d.value) : Array(7).fill(0);
  const maxValue = Math.max(...chartValues, 3);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        tension: 0.4,
        borderWidth: 3,
        borderColor: "#0ef",
        backgroundColor: "rgba(14,239,255,0.2)",
        pointRadius: 5,
        pointBackgroundColor: "#0ef",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { display: false } },
      y: {
        min: 0,
        max: Math.ceil(maxValue / 5) * 5,
        ticks: { stepSize: Math.ceil(Math.max(maxValue / 4, 1)), color: "#94a3b8" },
        grid: { color: "rgba(148,163,184,0.1)" },
      },
    },
  };

  return (
    <div className="weekly-progress-card">
      <h3 className="card-title">{t("weeklyProgress.title")}</h3>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeeklyProgress;
