import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Import components
import Sidebar from "./Components/Sidebar";
import PartMaster from "./Components/Admin";
import Table from "./Components/Table";
import Dashboard from "./Components/Dashboard";
import User from "./Components/User";
import Auth from "./Components/Auth";

const App = () => {
  const location = useLocation(); // Get current location

  // Define routes that should display the sidebar
  const sidebarRoutes = ["/part", "/table"];

  return (
    <div>
      {sidebarRoutes.includes(location.pathname) && <Sidebar />}

      <div className="flex-1 bg-gray-100">
        <Routes>
          <Route path="/part" element={<PartMaster />} />
          <Route path="/table" element={<Table />} />

          {/* Routes for Dashboard, User, Auth */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Auth />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
