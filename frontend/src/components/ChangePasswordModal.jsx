import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, CheckCircle } from 'lucide-react';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passRegex.test(password)) {
      return setError('Password must be 8-16 characters, with 1 uppercase and 1 special character');
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '2rem', overflowY: 'auto' }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-card" 
        style={{ maxWidth: '400px', width: '100%', position: 'relative', margin: 'auto' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle size={60} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>Success!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Your password has been updated.</p>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Lock size={24} color="var(--primary)" /> Change Password
            </h2>
            
            {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="8-16 chars, 1 uppercase, 1 special" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Re-enter new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ChangePasswordModal;
