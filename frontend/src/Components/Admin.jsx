import React, { useState } from "react";
import JsBarcode from "jsbarcode";
import logoImage from "../assets/companyLogo.jpg";

const Admin = () => {
  const [partName, setPartName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [barcode, setBarcode] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "part-name") setPartName(value);
    else if (name === "part-no") setPartNo(value);
    else if (name === "quantity") setQuantity(value);
  };

  const handleSubmit = () => {
    console.log({ partName, partNo, quantity });
  };

  const generatePreview = () => {
    setBarcode(partNo);
  };

  const generateBarcode = () => {
    if (barcode) {
      JsBarcode("#barcode", barcode, {
        format: "CODE128",
        displayValue: false,
      });
    }
  };

  React.useEffect(() => {
    generateBarcode();
  }, [barcode]);

  return (
    <div className=" bg-gradient-to-br  from-gray-900 via-black to-gray-800 flex flex-col items-center py-8 px-4">
      {/* Company Logo */}
      <img
        src={logoImage}
        alt="Company Logo"
        className="h-[10rem] w-full mb-6"
      />

      {/* Container */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-6 rounded-xl bg-gray-900/50 shadow-md border border-gray-700">
          <h1 className="text-3xl font-semibold text-white text-center mb-6">
            🛠 Part Master
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-lg text-gray-300 mb-2">
                Part Name
              </label>
              <input
                type="text"
                name="part-name"
                value={partName}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                placeholder="Enter part name"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-300 mb-2">
                Part Number
              </label>
              <input
                type="text"
                name="part-no"
                value={partNo}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                placeholder="Enter part number"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                placeholder="Enter quantity"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6">
              <button
                onClick={handleSubmit}
                className="w-full lg:w-40 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
              >
                ✅ Save
              </button>
              <button
                onClick={generatePreview}
                className="w-full lg:w-40 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 mt-4 lg:mt-0"
              >
                🔍 Preview
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Barcode Preview */}
        {barcode && (
          <div className="w-full lg:w-1/2 p-6 mt-8 lg:mt-0 lg:ml-6 rounded-xl bg-gray-900/50 shadow-md border border-gray-700 flex flex-col items-center">
            <div className="bg-white w-full p-4 rounded-lg shadow-lg">
              <p className="text-lg text-black mb-4">
                <strong>Part No:</strong> {partNo}
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
