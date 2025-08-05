import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import AdminProfilePage from './pages1/AdminProfilePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/adminProfile" element={<AdminProfilePage />} />
    </Routes>
  );
}

export default AppRoutes;