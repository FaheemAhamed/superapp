import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './routes/index.jsx';
import Login from './routes/login.jsx';
import Categories from './routes/categories.jsx';
import Dashboard from './routes/dashboard.jsx';
import MainDashboard from './routes/main-dashboard.jsx';
import Movies from './routes/movies.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
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

export default App;
