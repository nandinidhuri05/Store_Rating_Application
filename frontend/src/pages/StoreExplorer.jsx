import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, Search, MapPin, Store } from 'lucide-react';
import { motion } from 'framer-motion';

const StoreExplorer = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState('desc'); // Best ratings first by default

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchStores = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/user/stores?search=${search}`, config);
      const sorted = [...data].sort((a, b) => {
        return sortDir === 'desc' ? b.avgRating - a.avgRating : a.avgRating - b.avgRating;
      });
      setStores(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortDir]);

  const handleRate = async (storeId, rating) => {
    try {
      await axios.post('http://localhost:5000/api/user/rate', { storeId, rating }, config);
      fetchStores(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Explore Stores</h1>
          <p style={{ color: 'var(--text-muted)' }}>Discover and rate your favorite local businesses</p>
        </div>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name or address..." 
            style={{ padding: '1rem 1rem 1rem 3.5rem', borderRadius: '100px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {stores.map((store, idx) => (
          <motion.div 
            key={store.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card"
            style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {/* Store Image */}
            <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
              <img 
                src={store.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop'} 
                alt={store.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 0.8rem', 
                borderRadius: '100px', 
                color: '#eab308',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid rgba(255,255,255,0.1)',
                fontWeight: '600'
              }}>
                <Star size={16} fill="#eab308" />
                {store.avgRating.toFixed(1)}
              </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: '700' }}>{store.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                {store.address}
              </div>

              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {store.userRating > 0 ? 'Your Rating' : 'Rate this store'}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star}
                          onClick={() => handleRate(store.id, star)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
                        >
                          <Star 
                            size={22} 
                            fill={star <= store.userRating ? 'var(--primary)' : 'none'} 
                            color={star <= store.userRating ? 'var(--primary)' : 'rgba(255,255,255,0.2)'} 
                            style={{ transition: 'all 0.2s' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '0.6rem', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Store size={22} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoreExplorer;
