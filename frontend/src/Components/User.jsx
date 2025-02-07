import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import logoIcon from "../assets/companyLogo.jpg";

const User = () => {
  const [parts, setParts] = useState([]);
  const [selectedPartNo, setSelectedPartNo] = useState("");
  const [selectedPart, setSelectedPart] = useState({
    partName: "",
    quantity: "",
  });
  const [scanQuantity, setScanQuantity] = useState("");
  const [scannedQuantity, setScannedQuantity] = useState(0);
  const [status, setStatus] = useState("⚠️ Processing");
  const [totalPartCount, setTotalPartCount] = useState(0);
  const [totalPackageCount, setTotalPackageCount] = useState(0);
  const [previousScanQuantity, setPreviousScanQuantity] = useState("");

  const scanQuantityRef = useRef(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get("http://localhost:5555/getAllParts");
        setParts(response.data.parts);
      } catch (error) {
        console.error("Error fetching parts:", error);
      }
    };

    fetchParts();
  }, []);

  const updateCounts = async () => {
    try {
      await axios.post("http://localhost:5555/saveCounts", {
        totalPartCount,
        totalPackageCount,
      });
    } catch (error) {
      console.error("Error saving counts:", error);
    }
  };

  useEffect(() => {
    if (totalPartCount !== 0 || totalPackageCount !== 0) {
      updateCounts();
    }
  }, [totalPartCount, totalPackageCount]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("http://localhost:5555/getCounts");
        if (response.data) {
          setTotalPartCount(response.data.totalPartCount || 0);
          setTotalPackageCount(response.data.totalPackageCount || 0);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const handlePartNoChange = (e) => {
    const value = e.target.value;
    setSelectedPartNo(value);

    setScannedQuantity(0);
    setScanQuantity("");
    setStatus("⚠️ Processing");
    setPreviousScanQuantity("");

    const part = parts.find((part) => part.partNo === value);
    if (part) {
      setSelectedPart({
        partName: part.partName,
        quantity: part.quantity,
      });
    } else {
      setSelectedPart({
        partName: "",
        quantity: "",
      });
    }
  };

  const handleScanQuantityChange = (e) => {
    const value = e.target.value;
    setScanQuantity(value);
    checkStatus(selectedPartNo, value);
  };

  const checkStatus = (partNoValue, scanQuantityValue) => {
    if (String(partNoValue).trim() === String(scanQuantityValue).trim()) {
      setStatus("PASS ✅");
      if (scanQuantityValue !== previousScanQuantity) {
        const newScannedQuantity = scannedQuantity + 1;

        setTotalPartCount((prev) => prev + 1);
        setScanQuantity("");

        if (newScannedQuantity === Number(selectedPart.quantity)) {
          setTotalPackageCount((prev) => prev + 1);
          setScannedQuantity(0);
        } else {
          setScannedQuantity(newScannedQuantity);
        }

        setPreviousScanQuantity(scanQuantityValue);
      }
    } else {
      setStatus("Fail 🚫");
      setPreviousScanQuantity("");
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-start mb-6">
        <img
          src={logoIcon}
          alt="Company Logo"
          className="md:w-[10rem] md:h-[2rem] lg:w-[16rem] lg:h-[4rem]"
        />
      </div>
      <div className="max-w-6xl mx-auto space-y-8 backdrop-blur-lg bg-gray-800/50 rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-400">
          🗂️ Part Management System
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-700/50 p-6 rounded-lg shadow-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Part No</label>
            <select
              value={selectedPartNo}
              onChange={handlePartNoChange}
              className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Part No</option>
              {parts.map((part) => (
                <option key={part._id} value={part.partNo}>
                  {part.partNo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Part Name</label>
            <input
              type="text"
              value={selectedPart.partName}
              readOnly
              className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-col items-center">
            <h4 className="text-sm font-medium mb-2">Production Quantity</h4>
            <div className="bg-[gray] text-white py-4 px-6 rounded-lg text-2xl font-bold shadow-inner">
              {selectedPart.quantity || "0"}
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 mb-6">
            📇 Scan Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2">Scan Quantity</label>
              <input
                type="text"
                ref={scanQuantityRef}
                value={scanQuantity}
                onChange={handleScanQuantityChange}
                className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block mb-2">Scanned Quantity</label>
              <div className="bg-green-600/80 text-white py-4 px-6 rounded-lg text-2xl font-bold shadow-inner text-center">
                {scannedQuantity}
              </div>
            </div>

            <div>
              <label className="block mb-2">Status</label>
              <div
                className={`py-4 px-6 text-center rounded-lg text-2xl font-bold shadow-inner ${
                  status === "PASS ✅"
                    ? "bg-green-500/80"
                    : status === "Fail 🚫"
                    ? "bg-red-500/80"
                    : "bg-yellow-500/80"
                }`}
              >
                {status}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <h4 className="text-lg font-medium text-blue-400 mb-2">
                Total Part Count
              </h4>
              <div className="bg-[#f07167] text-white py-4 px-8 rounded-lg text-2xl font-bold shadow-inner">
                {totalPartCount}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-lg font-medium text-blue-400 mb-2">
                Total Package Count
              </h4>
              <div className="bg-[#00a8aa] text-white py-4 px-8 rounded-lg text-2xl font-bold shadow-inner">
                {totalPackageCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
