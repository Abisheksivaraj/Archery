import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import logoIcon from "../assets/companyLogo.jpg";
import QRCode from "react-qr-code";
import { api } from "../apiConfig";

// Separate Label component with corrected props
const PartLabel = ({ partNo, logoUrl, partName, quantity }) => {
  const qrCodeValue = JSON.stringify({
    partNo,
    partName,
    quantity,
  });

  const labelStyle = {
    width: "100mm",
    height: "50mm",
    padding: "6mm",
    backgroundColor: "white",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    margin: "0 auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  };

  const contentContainerStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2mm",
    height: "calc(100% - 12mm)", // Account for logo height and padding
  };

  const textContainerStyle = {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    overflow: "hidden",
  };

  const textStyle = {
    margin: 0,
    fontSize: "3.5mm",
    color: "black",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const qrCodeContainerStyle = {
    width: "25%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={labelStyle} className="print-content">
      <img
        src={logoUrl}
        alt="Company Logo"
        style={{
          width: "25mm",
          height: "10mm",
          objectFit: "contain",
          alignSelf: "center",
        }}
      />

      <div style={contentContainerStyle}>
        <div style={textContainerStyle}>
          <p style={textStyle}>
            PartName: <strong>{partName}</strong>
          </p>
          <p style={textStyle}>
            PartNo: <strong>{partNo}</strong>
          </p>
          <p style={textStyle}>
            Packing Quantity: <strong>{quantity}</strong>
          </p>
        </div>

        <div style={qrCodeContainerStyle}>
          <QRCode
            value={qrCodeValue}
            size={100}
            level="M"
            style={{ margin: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

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
  const [deleteType, setDeleteType] = useState("");

  const scanQuantityRef = useRef(null);

  // Auto-focus effect
  useEffect(() => {
    if (selectedPartNo && scanQuantityRef.current) {
      scanQuantityRef.current.focus();
    }
  }, [selectedPartNo]);

  // Fetch parts data
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await api.get("/getAllParts");
        setParts(response.data.parts);
      } catch (error) {
        console.error("Error fetching parts:", error);
        toast.error("Failed to fetch parts data");
      }
    };

    fetchParts();
  }, []);

  // Update counts
  const updateCounts = async () => {
    try {
      await api.post("/saveCounts", {
        totalPartCount,
        totalPackageCount,
      });
    } catch (error) {
      console.error("Error saving counts:", error);
      toast.error("Failed to save counts");
    }
  };

  useEffect(() => {
    if (totalPartCount !== 0 || totalPackageCount !== 0) {
      updateCounts();
    }
  }, [totalPartCount, totalPackageCount]);

  // Fetch initial counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await api.get("/getCounts");
        if (response.data) {
          setTotalPartCount(response.data.totalPartCount || 0);
          setTotalPackageCount(response.data.totalPackageCount || 0);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
        toast.error("Failed to fetch counts");
      }
    };

    fetchCounts();
  }, []);

  // Handle printing
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Label</title>
          <style>
            @page {
              size: 100mm 50mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            #print-content {
              width: 100%;
              height: 100%;
            }
          </style>
        </head> 
        <body>
          <div id="print-content">
            ${document.querySelector(".print-content").outerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle part number change
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

  // Handle scan quantity change
  const handleScanQuantityChange = (e) => {
    const value = e.target.value;
    setScanQuantity(value);

    if (status === "Fail 🚫") {
      setScanQuantity(value);
      setPreviousScanQuantity("");
    }

    checkStatus(selectedPartNo, value);
  };

  // Check status
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
          setTimeout(() => {
            handlePrint();
          }, 100);
        } else {
          setScannedQuantity(newScannedQuantity);
        }

        setPreviousScanQuantity(scanQuantityValue);
      }
    } else {
      setStatus("Fail 🚫");
      setPreviousScanQuantity("");
      setTimeout(() => {
        setScanQuantity("");
        if (scanQuantityRef.current) {
          scanQuantityRef.current.focus();
        }
      }, 500);
    }
  };

  // Modify just the handleDelete function within the User component:

  const handleDelete = async (type) => {
    try {
      if (type === "parts") {
        await api.post("/deleteTotalParts");
        setTotalPartCount(0);
        setDeleteType("");
        // Fetch updated counts after deletion
        const response = await api.get("/getCounts");
        if (response.data) {
          setTotalPartCount(response.data.totalPartCount || 0);
        }
        toast.success("Total parts count reset successfully");
      } else if (type === "packages") {
        await api.post("/deleteTotalPackages");
        setTotalPackageCount(0);
        setDeleteType("");
        // Fetch updated counts after deletion
        const response = await api.get("/getCounts");
        if (response.data) {
          setTotalPackageCount(response.data.totalPackageCount || 0);
        }
        toast.success("Total packages count reset successfully");
      }
    } catch (error) {
      console.error("Error in deletion:", error);
      toast.error(`Error resetting ${type} count`);
    }
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-start mb-6">
        <img
          src={logoIcon}
          alt="Company Logo"
          className="md:w-[10rem] md:h-[2rem] lg:w-[16rem] lg:h-[4rem]"
        />
      </div>
      <div style={{ display: "none" }}>
        <PartLabel
          partNo={selectedPartNo}
          logoUrl={logoIcon}
          partName={selectedPart.partName}
          quantity={selectedPart.quantity}
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 backdrop-blur-lg bg-gray-800/50 rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-400">
          🗂️ Part Management System
        </h1>
        <div className=" bg-gray-700/50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 mb-6">
            ⚙️ Part Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
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
              <label className="block text-sm font-medium mb-2">
                Part Name
              </label>
              <input
                type="text"
                value={selectedPart.partName}
                readOnly
                className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-sm font-medium mb-2">Production Quantity</h4>
              <div className="bg-gray-500 text-white py-4 px-6 rounded-lg text-2xl font-bold shadow-inner">
                {selectedPart.quantity || "0"}
              </div>
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
              <div
                onClick={() => {
                  setDeleteType("parts");
                  handleDelete();
                }}
                className="bg-[#f07167] text-white py-4 px-8 rounded-lg text-2xl font-bold shadow-inner cursor-pointer"
              >
                {totalPartCount}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-lg font-medium text-blue-400 mb-2">
                Total Package Count
              </h4>
              <div
                onClick={() => {
                  setDeleteType("packages");
                  handleDelete();
                }}
                className="bg-[#00a8aa] text-white py-4 px-8 rounded-lg text-2xl font-bold shadow-inner cursor-pointer"
              >
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
