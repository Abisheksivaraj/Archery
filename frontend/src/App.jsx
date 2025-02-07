import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import PartMaster from "./Components/Admin";
import Table from "./Components/Table";
import Dashboard from "./Components/Dashboard";
import User from "./Components/User";
import Auth from "./Components/Auth";

const App = () => {
  return (
    <div>
      <div className="flex-1 bg-gray-100">
        <Routes>
          <Route path="/part" element={<PartMaster />} />
          <Route path="/table" element={<Table />} />
          <Route path="/admin" element={<Auth />} />

        
          <Route path="/" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
