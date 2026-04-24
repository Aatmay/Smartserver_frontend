import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import NGODashboard from './pages/NGODashboard';
import FoodLogForm from './pages/FoodLogForm';
import PredictionPage from './pages/PredictionPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin only routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/food-log" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <FoodLogForm />
          </ProtectedRoute>
        } />
        <Route path="/admin/predictions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PredictionPage />
          </ProtectedRoute>
        } />

        {/* NGO only routes */}
        <Route path="/ngo" element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <NGODashboard />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/unauthorized" element={<div>Access Denied</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;