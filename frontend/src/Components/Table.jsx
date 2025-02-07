import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import logoImage from "../assets/companyLogo.jpg";
import { Modal, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

const PrintLabel = ({ partNo, logoUrl }) => {
  const isLongPartNo = partNo.length > 11;

  const labelStyle = {
    width: isLongPartNo ? "60mm" : "50mm", 
    height: "25mm",
    padding: "2mm",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    margin: "0 auto",
  };

  const textStyle = {
    margin: 0,
    fontSize: isLongPartNo ? "8px" : "10px", 
    color: "black",
    fontWeight: "500",
    wordBreak: "break-all", 
  };

  return (
    <div style={labelStyle} className="print-content">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={logoUrl}
          alt="Company Logo"
          style={{
            width: "20mm",
            height: "10mm",
            objectFit: "contain",
            marginBottom: "2mm",
          }}
        />
        <p style={textStyle}>PartNo: {partNo}</p>
      </div>
      <QRCode value={partNo} size={60} level="M" style={{ margin: 0 }} />
    </div>
  );
};

const Table = () => {
  const [parts, setParts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedPart, setUpdatedPart] = useState({
    partName: "",
    partNo: "",
    quantity: "",
  });

  const printRef = useRef(null);
  const partsPerPage = 5;

  const handlePrint = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = printRef.current.innerHTML;

    const styles = `
    @page {
      size: 50mm 25mm;
      margin: 0;
    }
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 25mm;
    }
    .print-content {
      width: 50mm;
      height: 25mm;
      background-color: white;
    }
  `;

    const printWindow = window.open("", "", "height=500,width=800");
    printWindow.document.write(`
    <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 250);
          }
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get("http://localhost:5555/getAllParts");
        setParts(response.data.parts);
      } catch (error) {
        console.error("Error fetching parts:", error);
        toast.error("Failed to fetch parts");
      }
    };
    fetchParts();
  }, []);

  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = parts.slice(indexOfFirstPart, indexOfLastPart);
  const totalPages = Math.ceil(parts.length / partsPerPage);

  const handlePreview = (part) => {
    setSelectedPart(part);
    setIsEditMode(false);
  };

  const handleEdit = (part) => {
    setSelectedPart(part);
    setUpdatedPart({ ...part });
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5555/editPart/${selectedPart._id}`,
        updatedPart
      );
      setParts(
        parts.map((part) =>
          part._id === selectedPart._id ? updatedPart : part
        )
      );
      setSelectedPart(null);
      setIsEditMode(false);
      toast.success("Part updated successfully!");
    } catch (error) {
      console.error("Error updating part:", error);
      toast.error("Error updating part!");
    }
  };

  return (
    <div className="flex">
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

      <div className="ml-[260px] p-8 bg-gray-900 text-white min-h-screen w-full">
        <h1 className="text-3xl font-semibold mb-6 text-center text-white">
          🛠️ Part Master Table
        </h1>

        {parts.length === 0 ? (
          <p className="text-center text-gray-400">No parts available</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg p-4">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-300 text-gray-900">
                <tr>
                  <th className="py-3 px-6 text-center">S.no</th>
                  <th className="py-3 px-6 text-center">Part Name</th>
                  <th className="py-3 px-6 text-center">Part No</th>
                  <th className="py-3 px-6 text-center">Packing Quantity</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentParts.map((part, index) => (
                  <tr
                    key={part._id}
                    className="hover:bg-gray-600 transition-colors duration-200"
                  >
                    <td className="py-3 px-6 border-b text-center border-gray-700">
                      {index + 1 + (currentPage - 1) * partsPerPage}
                    </td>
                    <td className="py-3 px-6 text-center border-b border-gray-700">
                      {part.partName}
                    </td>
                    <td className="py-3 px-6 text-center border-b border-gray-700">
                      {part.partNo}
                    </td>
                    <td className="py-3 px-6 border-b text-center border-gray-700">
                      {part.quantity}
                    </td>
                    <td className="py-3 px-6 border-b border-gray-700">
                      <button
                        onClick={() => handlePreview(part)}
                        className="bg-blue-500 px-4 py-2 rounded mr-2 text-white"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleEdit(part)}
                        className="bg-green-500 px-4 py-2 rounded text-white"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4 ">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 z- bg-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={selectedPart !== null}
        onClose={() => setSelectedPart(null)}
        aria-labelledby="modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#1F2937",
            padding: 4,
            borderRadius: "12px",
            width: 700,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {isEditMode ? (
            <div className="space-y-4 flex flex-col gap-7">
              <h2 className="text-2xl font-bold text-white text-center">
                Edit Part
              </h2>
              <TextField
                label="Part Name"
                value={updatedPart.partName}
                onChange={(e) =>
                  setUpdatedPart({ ...updatedPart, partName: e.target.value })
                }
                fullWidth
                sx={textFieldStyle}
              />
              <TextField
                label="Part No"
                value={updatedPart.partNo}
                onChange={(e) =>
                  setUpdatedPart({ ...updatedPart, partNo: e.target.value })
                }
                fullWidth
                sx={textFieldStyle}
              />
              <TextField
                label="Quantity"
                value={updatedPart.quantity}
                onChange={(e) =>
                  setUpdatedPart({ ...updatedPart, quantity: e.target.value })
                }
                fullWidth
                sx={textFieldStyle}
              />
              <div className="flex justify-between space-x-2">
                <Button
                  onClick={() => setSelectedPart(null)}
                  variant="contained"
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-white">
              <h2 className="text-2xl font-bold text-center mb-4">
                Preview Part
              </h2>
              <div ref={printRef}>
                <PrintLabel partNo={selectedPart?.partNo} logoUrl={logoImage} className="text-3xl" />
              </div>
              <div className="flex justify-between space-x-2 mt-4">
                <Button
                  onClick={() => setSelectedPart(null)}
                  variant="contained"
                  color="error"
                >
                  Close
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="contained"
                  color="primary"
                >
                  Print
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
};

export default Table;
