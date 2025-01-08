import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Routes, Route,Navigate  } from "react-router-dom";
import Header from "../Components/header";
import Sidebar from "../Components/sidebar";
import DashboardContent from "../pages/Dashboard/DashboardContent";
import Invoices from "../pages/Billing/BillingContent";
import ProfileComponent from "../pages/Profile/ProfileContent";
import NotificationComponent from "../pages/Notification/NotificationContent";
import CreateItem from "../pages/CreateItem/CreateItem";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("role"); 
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/sign-in" />;
  }
  
  return children;
};

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [role, setRole] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent:"space-between",
        gap:'20px',
        backgroundColor: "rgb(26 32 53)", 
        minHeight: "100vh",
        height:'100%',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      {/* Main Content Area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width:'calc(100% - 250px)',
          "@media (max-width: 900px)": { 
            width: "100%",
  },
          
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "sticky", 
            top: 0,
            zIndex: 10,
            height: "64px", 
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius:'10px',
          }}
        >
          <Header toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to Header */}
        </Box>

        {/* Routes for the Content */}
        <Box 
          sx={{
            color: "#FFF",
            padding: 3,
            marginTop: { xs: 5, },
          }}
        >
          <Routes>
          <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardContent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Invoices />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/createitem" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CreateItem />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'user']}>
            <ProfileComponent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <NotificationComponent />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect any invalid routes to sign-in */}
      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
        </Box>
      </Box>

      <CssBaseline />
    </Box>
  );
}

export default DashboardLayout;
