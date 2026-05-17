import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, MapPin, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        redirectBasedOnRole(user.role);
      } else {
        // Validation for registration
        if (formData.name.length < 20 || formData.name.length > 60) {
          return setError('Name must be between 20 and 60 characters');
        }
        if (formData.address.length > 400) {
          return setError('Address must be max 400 characters');
        }
        // Password validation: 8-16 chars, 1 upper, 1 special
        const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passRegex.test(formData.password)) {
          return setError('Password: 8-16 chars, 1 uppercase, 1 special character');
        }

        const user = await register(formData.name, formData.email, formData.password, formData.address);
        redirectBasedOnRole(user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleQuickLogin = async (role) => {
    let credentials = {};
    if (role === 'admin') credentials = { email: 'admin@test.com', password: 'Password123!' };
    else if (role === 'owner') credentials = { email: 'owner@test.com', password: 'Password123!' };
    else credentials = { email: 'user@test.com', password: 'Password123!' };

    try {
      const user = await login(credentials.email, credentials.password);
      redirectBasedOnRole(user.role);
    } catch (err) {
      setError('Quick login failed');
    }
  };

  const redirectBasedOnRole = (role) => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'owner') navigate('/owner');
    else navigate('/stores');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label><User size={14} style={{ marginRight: '4px' }}/> Full Name</label>
              <input 
                type="text" 
                placeholder="20-60 characters" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div className="form-group">
            <label><Mail size={14} style={{ marginRight: '4px' }}/> Email Address</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label><MapPin size={14} style={{ marginRight: '4px' }}/> Address</label>
              <textarea 
                placeholder="Your full address" 
                required 
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
          )}
          <div className="form-group">
            <label><Lock size={14} style={{ marginRight: '4px' }}/> Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Join Now'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Quick Access Roles (Demo)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('admin')}
              className="btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
            >
              Admin
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('owner')}
              className="btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
            >
              Owner
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('user')}
              className="btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
            >
              User
            </button>
          </div>
        </div>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', marginLeft: '0.5rem', cursor: 'pointer' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
