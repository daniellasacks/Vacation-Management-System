import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import { Login, Register } from './areas/Auth';
import { Vacations } from './areas/Vacations';
import { AdminVacations, AddVacation, EditVacation, VacationReport } from './areas/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/vacations" 
                element={
                  <ProtectedRoute>
                    <Vacations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/vacations" 
                element={
                  <AdminRoute>
                    <AdminVacations />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/vacations/add" 
                element={
                  <AdminRoute>
                    <AddVacation />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/vacations/edit/:id" 
                element={
                  <AdminRoute>
                    <EditVacation />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/report" 
                element={
                  <AdminRoute>
                    <VacationReport />
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
