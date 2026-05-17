import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Store, Star, Plus, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user, loginAs } = useAuth();
  const navigate = useNavigate(); // I might need to import useNavigate or just use window.location
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [viewStore, setViewStore] = useState(null);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', config),
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/stores', config)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredUsers = sortData(users.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    u.role.toLowerCase().includes(filter.toLowerCase())
  ));

  const filteredStores = sortData(stores.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) || 
    s.email.toLowerCase().includes(filter.toLowerCase())
  ));

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your store rating platform</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard icon={<Users />} title="Total Users" value={stats.totalUsers} color="#6366f1" />
        <StatCard icon={<Store />} title="Registered Stores" value={stats.totalStores} color="#ec4899" />
        <StatCard icon={<Star />} title="Total Ratings" value={stats.totalRatings} color="#eab308" />
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', padding: '0 1rem' }}>
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users</TabButton>
          <TabButton active={activeTab === 'stores'} onClick={() => setActiveTab('stores')}>Stores</TabButton>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ paddingLeft: '2.5rem' }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={() => activeTab === 'users' ? setShowAddUser(true) : setShowAddStore(true)}>
              <Plus size={18} /> Add {activeTab === 'users' ? 'User' : 'Store'}
            </button>
          </div>

          <div className="table-container">
            {activeTab === 'users' ? (
              users.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('role')} style={{ cursor: 'pointer' }}>Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th>Business Details / Rating</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="animate-fade-in">
                        <td style={{ fontWeight: '600' }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '100px', 
                            fontSize: '0.8rem', 
                            backgroundColor: u.role === 'admin' ? 'rgba(153, 27, 27, 0.15)' : 'rgba(255,255,255,0.05)',
                            color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                            border: u.role === 'admin' ? '1px solid var(--border)' : '1px solid transparent'
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {u.role === 'owner' && u.managedStore ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{u.managedStore.name}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', fontSize: '0.85rem' }}>
                                <Star size={14} fill="#eab308" />
                                {Number(u.managedStore.avgRating || 0).toFixed(1)} (Avg Rating)
                              </div>
                            </div>
                          ) : '-'}
                        </td>
                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.address}</td>
                        <td>
                          {u.id !== user.id && (
                            <button 
                              onClick={async () => {
                                try {
                                  const res = await axios.get(`http://localhost:5000/api/admin/impersonate/${u.id}`, config);
                                  loginAs(res.data);
                                  window.location.href = u.role === 'owner' ? '/owner' : (u.role === 'admin' ? '/admin' : '/stores');
                                } catch (err) {
                                  alert('Failed to impersonate');
                                }
                              }}
                              className="btn-secondary" 
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              Login as
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users found.</div>
            ) : (
              stores.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>Store Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th>Image</th>
                      <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('avgRating')} style={{ cursor: 'pointer' }}>Avg Rating {sortConfig.key === 'avgRating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.map(s => (
                      <tr key={s.id} className="animate-fade-in" onClick={() => setViewStore(s)} style={{ cursor: 'pointer' }}>
                        <td style={{ fontWeight: '600' }}>{s.name}</td>
                        <td>
                          <img 
                            src={s.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=20&w=40&auto=format&fit=crop'} 
                            alt="" 
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>{s.email}</td>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Star size={16} fill="#eab308" color="#eab308" />
                          {Number(s.avgRating || 0).toFixed(1)}
                        </td>
                        <td>{s.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No stores found.</div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddUser && <AdminAddModal type="user" onClose={() => setShowAddUser(false)} onAdd={fetchData} token={user.token} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAddStore && <AdminAddModal type="store" onClose={() => setShowAddStore(false)} onAdd={fetchData} token={user.token} />}
      </AnimatePresence>
      <AnimatePresence>
        {viewStore && <StoreReviewsModal store={viewStore} onClose={() => setViewStore(null)} />}
      </AnimatePresence>
    </div>
  );
};

const StoreReviewsModal = ({ store, onClose }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '2rem', overflowY: 'auto' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="glass-card" style={{ maxWidth: '800px', width: '100%', position: 'relative', margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{store.name} - All Reviews</h2>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>Close</button>
        </div>
        
        <div className="table-container">
          {store.Ratings && store.Ratings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {store.Ratings.map(r => (
                  <tr key={r.id}>
                    <td>{r.user_id}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={14} fill={s <= r.rating ? '#eab308' : 'none'} color={s <= r.rating ? '#eab308' : 'var(--text-muted)'} />
                        ))}
                      </div>
                    </td>
                    <td>{r.comment || '-'}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No reviews found for this store.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const AdminAddModal = ({ type, onClose, onAdd, token }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: 'Password123!', address: '', role: 'user', ownerEmail: '', image: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = type === 'user' ? 'http://localhost:5000/api/admin/users' : 'http://localhost:5000/api/admin/stores';
      await axios.post(url, formData, { headers: { Authorization: `Bearer ${token}` } });
      onAdd();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '2rem', overflowY: 'auto' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="glass-card" style={{ maxWidth: '500px', width: '100%', position: 'relative', margin: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Add New {type === 'user' ? 'User' : 'Store'}</h2>
        <form onSubmit={handleSubmit}>
           <div className="form-group">
            <label>Name (Min 20 characters)</label>
            <input type="text" placeholder="Minimum 20 characters required" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
           </div>
           <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="email@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
           </div>
           {type === 'user' && (
             <div className="form-group">
               <label>Role</label>
               <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                 <option value="user">Normal User</option>
                 <option value="owner">Store Owner</option>
                 <option value="admin">Admin</option>
               </select>
             </div>
           )}
           {type === 'store' && (
             <>
               <div className="form-group">
                 <label>Owner Email (Optional)</label>
                 <input type="email" value={formData.ownerEmail} onChange={e => setFormData({...formData, ownerEmail: e.target.value})} />
               </div>
               <div className="form-group">
                 <label>Store Image URL</label>
                 <input type="text" placeholder="https://images.unsplash.com/..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
               </div>
             </>
           )}
           <div className="form-group">
            <label>Address (Max 400 characters)</label>
            <input type="text" placeholder="Full address..." required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
           </div>
           <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
           </div>
        </form>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: `${color}20`, color: color }}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{title}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  </motion.div>
);

const TabButton = ({ children, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      padding: '1.25rem 2rem', 
      background: 'none', 
      border: 'none', 
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s'
    }}
  >
    {children}
  </button>
);

export default AdminDashboard;
