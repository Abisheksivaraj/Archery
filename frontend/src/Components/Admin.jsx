import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import JsBarcode from "jsbarcode";
import logoImage from "../assets/companyLogo.jpg";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const Admin = () => {
  const [formData, setFormData] = useState({
    partName: "",
    partNo: "",
    quantity: "",
  });
  const [barcode, setBarcode] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5555/addPart",
        formData
      );
      toast.success(response.data.message);
      setBarcode(formData.partNo);
      setFormData({ partName: "", partNo: "", quantity: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving part");
    }
  };

  const generateBarcode = () => {
    if (barcode) {
      JsBarcode("#barcode", barcode, {
        format: "CODE128",
        displayValue: false,
      });
    }
  };

  useEffect(() => {
    generateBarcode();
  }, [barcode]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          height: "100vh",
          backgroundColor: "#1F2937",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <img
                  src={logoImage}
                  alt="Company Logo"
                  className="h-auto w-[20rem]"
                />
        <Divider sx={{ backgroundColor: "white" }} />
        <List>
          {["⚙️ Part Master", "📝 Table"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={index === 0 ? "/part" : "/table"}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <div className="ml-[260px] flex flex-col items-center justify-center w-full py-12 px-6">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="w-full max-w-4xl bg-gray-300 shadow-lg rounded-xl p-8 border border-gray-200 flex flex-col lg:flex-row">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              🛠 Part Master
            </h1>
            {["partName", "partNo", "quantity"].map((field) => (
              <div key={field}>
                <label className="block text-gray-600 font-medium mb-2">
                  {field === "partName"
                    ? "Part Name"
                    : field === "partNo"
                    ? "Part Number"
                    : "Quantity"}
                </label>
                <input
                  type={field === "quantity" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="w-full mt-4 py-3 bg-[#24a0ed] text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              ✅ Save
            </button>
          </div>

          {/* Barcode Preview */}
          {barcode && (
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:ml-6 flex flex-col items-center border border-gray-200 p-6 bg-gray-50 rounded-lg shadow-md">
              <p className="text-lg text-gray-700 font-semibold mb-4">
                <strong>Part No:</strong> {barcode}
              </p>
              <svg id="barcode" className="w-full h-24"></svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
