import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Import Logo (Ensure Correct Path)
import logo from "../assets/companyLogo.jpg";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    parts: 0,
    categories: 0,
    totalCount: 0,
    dayCount: 0,
  });

useEffect(() => {
  const fetchParts = async () => {
    try {
      const response = await axios.get("http://localhost:5555/getAllParts");
      const parts = response.data.parts;

      // Count calculations
      const totalParts = parts.length;
      const categories = new Set(parts.map((part) => part.partName)).size;
      const partNo = new Set(parts.map((part) => part.partNo)).size;

      // Update state
      setStats({
        parts: totalParts,
        categories,
        totalCount: partNo,
        dayCount: Math.floor(Math.random() * 50),
      });
    } catch (error) {
      console.error("Error fetching parts data:", error);
    }
  };

  // Fetch initially and then set an interval
  fetchParts();
  const interval = setInterval(fetchParts, 2000); // Fetch data every 2 seconds

  return () => clearInterval(interval); // Cleanup interval on unmount
}, []);


  const chartLabels = ["Parts", "Categories", "Total Count", "Day Count"];
  const chartData = [
    stats.parts,
    stats.categories,
    stats.totalCount,
    stats.dayCount,
  ];

  // Bar Chart Data
  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Counts",
        data: chartData,
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  // Pie Chart Data
  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-white">
      {/* Logo */}
      <img
        src={logo}
        alt="Company Logo"
        className="absolute top-6 left-6 md:w-40 lg:w-50 h-auto object-contain z-50"
      />

      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

      {/* Main Dashboard Container */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8 text-white/90">
          📊 Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {[
            {
              title: "No. of Parts",
              count: stats.parts,
              color: "from-blue-600",
            },
            {
              title: "Categories",
              count: stats.categories,
              color: "from-green-600",
            },
            {
              title: "Total Count",
              count: stats.totalCount,
              color: "from-yellow-600",
            },
            {
              title: "Day Count",
              count: stats.dayCount,
              color: "from-red-600",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`
                bg-gradient-to-r ${item.color} to-gray-900 p-6 rounded-2xl 
                text-white text-center shadow-lg backdrop-blur-xl 
                bg-opacity-30 border border-white/20 
                hover:scale-105 transition-transform duration-300
              `}
            >
              <h2 className="text-lg font-semibold opacity-90">{item.title}</h2>
              <p className="text-4xl font-bold mt-2 text-white">{item.count}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-xl border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 text-white/80">
              Data Overview
            </h2>
            <Bar data={barData} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-xl border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 text-white/80">
              Data Distribution
            </h2>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
