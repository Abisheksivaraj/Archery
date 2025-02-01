import React from "react";

const User = () => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Part Details</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Part No</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter Part No"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Part Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter Part Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Production Quantity
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Enter Production Quantity"
          />
        </div>
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
