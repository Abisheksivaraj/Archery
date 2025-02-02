import React, { useState, useEffect } from "react";
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
      toast.success(response.data.message); // Show success toast
      setBarcode(formData.partNo);
      setFormData({ partName: "", partNo: "", quantity: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving part"); // Show error toast
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
    <div className="bg-gray-900   flex flex-col items-center py-8 px-4">
      <Toaster position="top-right" reverseOrder={false} />{" "}
      <img
        src={logoImage}
        alt="Company Logo"
        className="h-auto rounded-md w-[20rem] mb-6"
      />
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-6 rounded-xl bg-gray-900/50 shadow-md border border-gray-700">
          <h1 className="text-3xl font-semibold text-white text-center mb-6">
            🛠 Part Master
          </h1>

          <div className="space-y-4">
            {["partName", "partNo", "quantity"].map((field) => (
              <div key={field}>
                <label className="block text-lg text-gray-300 mb-2">
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
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 border border-gray-700"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            ✅ Save
          </button>
        </div>

        {/* Barcode Preview */}
        {barcode && (
          <div className="w-full lg:w-1/2 p-6 mt-8 lg:mt-0 lg:ml-6 bg-gray-900/50 shadow-md border border-gray-700 rounded-xl flex flex-col items-center">
            <div className="bg-white w-full p-4 rounded-lg shadow-lg">
              <p className="text-lg text-black mb-4">
                <strong>Part No:</strong> {barcode}
              </p>
              <svg id="barcode" className="w-full h-24"></svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
