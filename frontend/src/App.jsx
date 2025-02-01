import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Sidebar from "./Components/Sidebar";
import PartMaster from "./Components/Admin";
import Table from "./Components/Table";
import Dashboard from "./Components/Dashboard";
import User from "./Components/User";
import Auth from "./Components/Auth";
import Admin from "./Components/Admin";

const App = () => {
  return (
    
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 bg-gray-100 p-8">
          <Routes>
            {/* Routes for PartMaster and Table */}
            <Route path="/" element={<PartMaster />} />
            <Route path="/table" element={<Table />} />

            {/* Routes for Dashboard, User, Auth, and Admin */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<User />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
  
  );
};

export default App;
