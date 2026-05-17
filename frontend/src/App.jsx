import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import StoreExplorer from './pages/StoreExplorer';
import OwnerDashboard from './pages/OwnerDashboard';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'owner') return <Navigate to="/owner" />;
  return <Navigate to="/stores" />;
};

const ImpersonationBanner = () => {
  const { returnToAdmin } = useAuth();
  const isAdminBackup = sessionStorage.getItem('adminBackup');

  if (!isAdminBackup) return null;

  return (
    <div style={{ 
      backgroundColor: 'var(--primary)', 
      color: 'white', 
      padding: '0.75rem', 
      textAlign: 'center', 
      fontSize: '0.9rem', 
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 10000
    }}>
      <span>VIEWING AS USER (IMPERSONATION MODE)</span>
      <button 
        onClick={() => {
          returnToAdmin();
          window.location.href = '/admin';
        }}
        style={{ 
          backgroundColor: 'white', 
          color: 'var(--primary)', 
          border: 'none', 
          padding: '0.25rem 1rem', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontSize: '0.8rem'
        }}
      >
        BACK TO ADMIN
      </button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <ImpersonationBanner />
          <Navbar /> 
          <Routes>
            <Route path="/login" element={<Auth />} />
            
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/stores" element={
              <ProtectedRoute roles={['user']}>
                <StoreExplorer />
              </ProtectedRoute>
            } />
            
            <Route path="/owner" element={
              <ProtectedRoute roles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<HomeRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
