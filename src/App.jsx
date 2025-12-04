import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import PlateActivationPage from './pages/PlateActivationPage';
import PlateTypeSelectionPage from './pages/PlateTypeSelectionPage';
import Step1BasicInfo from './pages/ProfileSetup/Step1BasicInfo';
import Step2Contact from './pages/ProfileSetup/Step2Contact';
import Step3Privacy from './pages/ProfileSetup/Step3Privacy';
import ViewProfilePage from './pages/ViewProfilePage';
import PublicScanPage from './pages/PublicScanPage';
import EditProfilePage from './pages/EditProfilePage';
import ScanHistoryPage from './pages/ScanHistoryPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/plate/activate" 
        element={
          <ProtectedRoute>
            <PlateActivationPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/plate/select-type" 
        element={
          <ProtectedRoute>
            <PlateTypeSelectionPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/plate/setup/step1" 
        element={
          <ProtectedRoute>
            <Step1BasicInfo />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/plate/setup/step2" 
        element={
          <ProtectedRoute>
            <Step2Contact />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/plate/setup/step3" 
        element={
          <ProtectedRoute>
            <Step3Privacy />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile/:plateId" 
        element={
          <ProtectedRoute>
            <ViewProfilePage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile/:plateId/edit" 
        element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile/:plateId/scans" 
        element={
          <ProtectedRoute>
            <ScanHistoryPage />
          </ProtectedRoute>
        } 
      />

      {/* Public Scan Page */}
      <Route path="/scan/:plateId" element={<PublicScanPage />} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;