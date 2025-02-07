import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import logoImage from "../assets/companyLogo.jpg";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import QRcode from "react-qr-code";

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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Box
        sx={{
          width: 250,
          height: "100vh",
          backgroundColor: "#1F2937",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          border: "2px solid #E5E7EB",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img src={logoImage} alt="Company Logo" className="h-auto w-[20rem]" />
        <Divider sx={{ backgroundColor: "white" }} />
        <List>
          {["⚙️ Part Master", "📝 Part Master Table"].map((text, index) => (
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

      <div className="ml-[260px] flex flex-col items-center justify-center w-full py-12 px-6 h-full">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="w-full max-w-4xl bg-gray-300 shadow-lg rounded-xl p-8 border-2 border-gray-400 flex flex-col lg:flex-row h-auto">
          <div className="w-full lg:w-1/2 space-y-6 border-2 border-gray-400 p-6 rounded-md shadow-md bg-white">
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
                    : "Packing Quantity"}
                </label>
                <input
                  type={field === "quantity" ? "text" : "text"}
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

          {barcode && (
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:ml-6 border-2 border-gray-400 p-6 bg-gray-50 rounded-lg shadow-md flex flex-row items-center justify-center gap-7">
              <div className="flex flex-row border-gray-400 border-2 border-dotted p-5 gap-7">
                <div className="flex flex-col">
                  <img src={logoImage} alt="Logo" className="w-[8rem] mb-4" />
                  <p className="text-lg flex gap-2 text-gray-700 font-semibold">
                    <h6>Part No:</h6> {barcode}
                  </p>
                </div>

                <div className="">
                  <QRcode value={barcode} size={100} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
