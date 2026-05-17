import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedRatings = () => {
    if (!data.ratings) return [];
    return [...data.ratings].sort((a, b) => {
      let valA, valB;
      if (sortConfig.key === 'name') {
        valA = a.User.name;
        valB = b.User.name;
      } else if (sortConfig.key === 'email') {
        valA = a.User.email;
        valB = b.User.email;
      } else {
        valA = a[sortConfig.key];
        valB = b[sortConfig.key];
      }
      
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get('http://localhost:5000/api/owner/stats', config);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.token]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-card">Loading Dashboard...</div>
    </div>
  );

  if (!data) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-card">No store assigned to this account.</div>
    </div>
  );

  const sortedRatings = getSortedRatings();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{data.storeName}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Store Owner Performance Dashboard</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            {data.avgRating.toFixed(1)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} fill={s <= Math.round(data.avgRating) ? 'var(--primary)' : 'none'} color={s <= Math.round(data.avgRating) ? 'var(--primary)' : 'var(--text-muted)'} />
            ))}
          </div>
          <div style={{ color: 'var(--text-muted)', fontWeight: '500' }}>AVERAGE RATING</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)' }}>
               <MessageSquare size={32} />
             </div>
             <div>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Reviews</div>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{data.ratings.length}</div>
             </div>
          </div>
          <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
               <TrendingUp size={32} />
             </div>
             <div>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Growth</div>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>+12%</div>
             </div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>User Feedbacks</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>User {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => requestSort('rating')} style={{ cursor: 'pointer' }}>Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => requestSort('createdAt')} style={{ cursor: 'pointer' }}>Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedRatings.map(r => (
                <tr key={r.id}>
                  <td>{r.User.name}</td>
                  <td>{r.User.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} fill={s <= r.rating ? '#eab308' : 'none'} color={s <= r.rating ? '#eab308' : 'var(--text-muted)'} />
                      ))}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.ratings.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No ratings yet for your store.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
