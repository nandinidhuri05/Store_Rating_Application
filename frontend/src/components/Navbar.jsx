import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Store, Settings, User } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <nav className="glass-nav">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={28} />
            <span>StoreRate</span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">Dashboard</Link>
            )}
            {user.role === 'user' && (
              <Link to="/stores" className="nav-link">Explore Stores</Link>
            )}
            {user.role === 'owner' && (
              <Link to="/owner" className="nav-link">My Store</Link>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role.toUpperCase()}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setShowPasswordModal(true)} 
                  className="btn-secondary" 
                  style={{ padding: '0.5rem', borderRadius: '50%' }}
                  title="Change Password"
                >
                  <Settings size={18} />
                </button>
                <button 
                  onClick={handleLogout} 
                  className="btn-secondary" 
                  style={{ padding: '0.5rem', borderRadius: '50%' }}
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          .nav-link {
            color: var(--text-main);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
          }
          .nav-link:hover {
            color: var(--primary);
          }
        `}</style>
      </nav>
      <AnimatePresence>
        {showPasswordModal && (
          <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
