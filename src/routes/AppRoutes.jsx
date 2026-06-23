import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/routes/login";
import Categories from "@/pages/Categories";
import Dashboard from "@/pages/Dashboard";
import MainDashboard from "@/pages/MainDashboard";
import Movies from "@/pages/Movies";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/categories" element={
        <ProtectedRoute>
          <Categories />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/main-dashboard" element={
        <ProtectedRoute>
          <MainDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/movies" element={
        <ProtectedRoute>
          <Movies />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
