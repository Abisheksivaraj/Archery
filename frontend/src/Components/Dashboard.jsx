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
import logo from "../assets/companyLogo.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [deleteType, setDeleteType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5555/getAllParts");
        const parts = response.data.parts;

        const partCountResponse = await axios.get(
          "http://localhost:5555/getTotalPartCount"
        );
        const totalPartCount = partCountResponse.data.totalPartCount;

        const packageCountResponse = await axios.get(
          "http://localhost:5555/getTotalPackageCount"
        );
        const totalPackageCount = packageCountResponse.data.totalPackageCount;

        const totalParts = parts.length;
        const categories = new Set(parts.map((part) => part.partName)).size;

        setStats({
          parts: totalParts,
          categories,
          totalCount: totalPartCount,
          dayCount: totalPackageCount,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async () => {
    try {
      if (deleteType === "parts") {
        await axios.post("http://localhost:5555/deleteTotalParts");
        toast.success("Total parts count reset successfully");
      } else if (deleteType === "packages") {
        await axios.post("http://localhost:5555/deleteTotalPackages");
        toast.success("Total packages count reset successfully");
      }
      setDeleteType("");
    } catch (error) {
      toast.error(`Error resetting ${deleteType} count`);
    }
  };

  const chartLabels = ["Parts", "Categories", "Total Count", "Day Count"];
  const chartData = [
    stats.parts,
    stats.categories,
    stats.totalCount,
    stats.dayCount,
  ];

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Counts",
        data: chartData,
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(239, 68, 68, 0.6)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(239, 68, 68, 0.6)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-white">
      <img
        src={logo}
        alt="Company Logo"
        className="absolute top-6 left-6 w-24 sm:w-32 md:w-40 lg:w-50 h-auto object-contain z-50"
      />
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-white/90">
          📊 Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8">
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
              title: "Total Part Count",
              count: stats.totalCount,
              color: "from-yellow-600",
            },
            {
              title: "Total Package Count",
              count: stats.dayCount,
              color: "from-red-600",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${item.color} to-gray-900 p-4 sm:p-6 rounded-2xl text-white text-center shadow-lg backdrop-blur-xl bg-opacity-30 border border-white/20 hover:scale-105 transition-transform duration-300`}
            >
              <h2 className="text-sm sm:text-lg font-semibold opacity-90">
                {item.title}
              </h2>
              <p className="text-2xl sm:text-4xl font-bold mt-2 text-white">
                {item.count}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white/10 p-4 sm:p-6 rounded-2xl shadow-lg backdrop-blur-xl border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white/80">
              Data Overview
            </h2>
            <Bar data={barData} />
          </div>
          <div className="bg-white/10 p-4 sm:p-6 rounded-2xl shadow-lg backdrop-blur-xl border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white/80">
              Data Distribution
            </h2>
            <Pie data={pieData} />
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => {
              setDeleteType("parts");
              handleDelete();
            }}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md"
          >
            Reset Total Parts
          </button>
          <button
            onClick={() => {
              setDeleteType("packages");
              handleDelete();
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg shadow-md"
          >
            Reset Total Packages
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
