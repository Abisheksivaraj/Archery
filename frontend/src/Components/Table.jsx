import React, { useEffect, useState } from "react";
import axios from "axios";

const Table = () => {
  const [parts, setParts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 7; // Number of parts per page

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

  // Get current page parts
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = parts.slice(indexOfFirstPart, indexOfLastPart);

  // Handle pagination
  const totalPages = Math.ceil(parts.length / partsPerPage);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex-1 p-8 bg-gray-900 text-white min-h-screen">
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
  );
};

export default Table;
