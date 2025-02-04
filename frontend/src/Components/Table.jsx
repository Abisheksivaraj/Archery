import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import logoImage from "../assets/companyLogo.jpg";
import JsBarcode from "jsbarcode";
import { Modal, Button, TextField } from "@mui/material"; // For modal and form
import { toast } from "react-toastify"; // Importing toast from react-toastify

const Table = () => {
  const [parts, setParts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 7;
  const [selectedPart, setSelectedPart] = useState(null); // For storing selected part for preview/edit
  const [isEditMode, setIsEditMode] = useState(false); // Toggle between edit and preview mode
  const [updatedPart, setUpdatedPart] = useState({
    partName: "",
    partNo: "",
    quantity: "",
  }); // For editing part details

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

  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = parts.slice(indexOfFirstPart, indexOfLastPart);

  const totalPages = Math.ceil(parts.length / partsPerPage);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handlePreview = (part) => {
    setSelectedPart(part);
    setIsEditMode(false); // Set to preview mode
  };

  const handleEdit = (part) => {
    setSelectedPart(part);
    setUpdatedPart({ ...part }); // Set the part details in the edit form
    setIsEditMode(true); // Set to edit mode
  };

  const handleSaveEdit = () => {
    // Logic to update the part
    axios
      .put(`http://localhost:5555/editPart/${selectedPart._id}`, updatedPart)
      .then((response) => {
        setParts(
          parts.map((part) =>
            part._id === selectedPart._id ? updatedPart : part
          )
        );
        setSelectedPart(null); // Close the modal
        setIsEditMode(false);
        toast.success("Part updated successfully!"); // Success Toast
      })
      .catch((error) => {
        console.error("Error updating part:", error);
        toast.error("Error updating part!"); // Error Toast
      });
  };

  return (
    <div className="flex">
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
        <img src={logoImage} alt="Company Logo" className="h-auto w-[20rem]" />
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
      <div className="ml-[260px] p-8 bg-gray-900 text-white min-h-screen w-full">
        <h1 className="text-3xl font-semibold mb-6 text-center text-white">
          🛠️ Parts Table
        </h1>
        {parts.length === 0 ? (
          <p className="text-center text-gray-400">No parts available</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg p-4">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-300 text-gray-900">
                <tr>
                  <th className="py-3 px-6 text-left">Part Name</th>
                  <th className="py-3 px-6 text-left">Part No</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentParts.map((part) => (
                  <tr
                    key={part._id}
                    className="hover:bg-gray-600 transition-colors duration-200"
                  >
                    <td className="py-3 px-6 border-b border-gray-700">
                      {part.partName}
                    </td>
                    <td className="py-3 px-6 border-b border-gray-700">
                      {part.partNo}
                    </td>
                    <td className="py-3 px-6 border-b border-gray-700">
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

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Preview/Edit */}
      <Modal
        open={selectedPart !== null}
        onClose={() => setSelectedPart(null)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            width: 400,
            boxShadow: 24,
          }}
        >
          <h2 id="modal-title" className="text-center text-2xl font-bold">
            {isEditMode ? "Edit Part" : "Preview Part"}
          </h2>
          <div className="mt-4">
            {selectedPart ? (
              <>
                {isEditMode ? (
                  <>
                    <TextField
                      label="Part Name"
                      value={updatedPart.partName || ""}
                      onChange={(e) =>
                        setUpdatedPart({
                          ...updatedPart,
                          partName: e.target.value,
                        })
                      }
                      fullWidth
                      className="mb-4"
                    />
                    <TextField
                      label="Part No"
                      value={updatedPart.partNo || ""}
                      onChange={(e) =>
                        setUpdatedPart({
                          ...updatedPart,
                          partNo: e.target.value,
                        })
                      }
                      fullWidth
                      className="mb-4"
                    />
                    <TextField
                      label="Quantity"
                      value={updatedPart.quantity || ""}
                      onChange={(e) =>
                        setUpdatedPart({
                          ...updatedPart,
                          quantity: e.target.value,
                        })
                      }
                      fullWidth
                      className="mb-4"
                    />
                    <div className="flex justify-between">
                      <Button
                        onClick={() => setSelectedPart(null)}
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} color="primary">
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <JsBarcode value={selectedPart.partNo} />
                    <p className="mt-4">Part Name: {selectedPart.partName}</p>
                    <p>Part No: {selectedPart.partNo}</p>
                    <p>Quantity: {selectedPart.quantity}</p>
                    <Button
                      onClick={() => setSelectedPart(null)}
                      color="secondary"
                      className="mt-4"
                    >
                      Close
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>Loading part details...</p>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Table;
