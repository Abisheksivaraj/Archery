import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const PartMaster = lazy(() => import("./Components/Admin"));
const Table = lazy(() => import("./Components/Table"));
const Dashboard = lazy(() => import("./Components/Dashboard"));
const User = lazy(() => import("./Components/User"));
const Auth = lazy(() => import("./Components/Auth"));
const Footer = lazy(() => import("./Components/Footer"));

const App = () => {
  const location = useLocation();
  const hideFooterRoutes = ["/admin"]; // Add routes where footer shouldn't appear
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  console.log(
    "Location:",
    location.pathname,
    "Should show footer:",
    shouldShowFooter
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gray-100">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/part" element={<PartMaster />} />
            <Route path="/table" element={<Table />} />
            <Route path="/admin" element={<Auth />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/user" element={<User />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Suspense>
      </div>
      {shouldShowFooter && (
        <Suspense fallback={<div>Loading Footer...</div>}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
};

export default App;
