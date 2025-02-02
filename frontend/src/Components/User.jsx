import React, { useEffect, useState } from "react";
import axios from "axios";

const User = () => {
  const [parts, setParts] = useState([]);
  const [selectedPartNo, setSelectedPartNo] = useState("");
  const [selectedPart, setSelectedPart] = useState({
    partName: "",
    quantity: "",
  });

  useEffect(() => {
    // Fetch all parts from the backend
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

  // Handle part number selection
  const handlePartNoChange = (e) => {
    const partNo = e.target.value;
    setSelectedPartNo(partNo);

    // Find the selected part details
    const partDetails = parts.find((part) => part.partNo === partNo);
    if (partDetails) {
      setSelectedPart({
        partName: partDetails.partName,
        quantity: partDetails.quantity,
      });
    } else {
      setSelectedPart({ partName: "", quantity: "" });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Part Details</h2>
      <form className="space-y-4">
        {/* Part No Dropdown */}
        <div>
          <label className="block text-sm font-medium">Part No</label>
          <select
            value={selectedPartNo}
            onChange={handlePartNoChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Part No</option>
            {parts.map((part) => (
              <option key={part._id} value={part.partNo}>
                {part.partNo}
              </option>
            ))}
          </select>
        </div>

        {/* Part Name (Auto-filled) */}
        <div>
          <label className="block text-sm font-medium">Part Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-100"
            value={selectedPart.partName}
            readOnly
          />
        </div>

        {/* Production Quantity (Auto-filled) */}
        <div>
          <label className="block text-sm font-medium">
            Production Quantity
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded bg-gray-100"
            value={selectedPart.quantity}
            readOnly
          />
        </div>

        {/* Scan Quantity (User Input) */}
        <div>
          <label className="block text-sm font-medium">Scan Quantity</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Enter Scan Quantity"
          />
        </div>
      </form>
    </div>
  );
};

export default User;
