import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './css/Home.css';

export default function Home() {
  const [gadgets, setGadgets] = useState([]);
  const [filteredGadgets, setFilteredGadgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        const response = await axios.get('/gadgets');
        setGadgets(response.data);
        setFilteredGadgets(response.data);
      } catch (err) {
        setError('Failed to load gadgets');
      } finally {
        setLoading(false);
      }
    };
    fetchGadgets();
  }, []);

  useEffect(() => {
    let filtered = [...gadgets];

    if (searchTerm) {
      filtered = filtered.filter(gadget =>
        gadget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gadget.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(gadget => gadget.category === categoryFilter);
    }

    if (sortOrder === 'priceLow') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'priceHigh') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredGadgets(filtered);
  }, [searchTerm, categoryFilter, sortOrder, gadgets]);

  if (loading) {
    return <LoadingSpinner message="Loading gadgets..." />;
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">Available Gadgets</h1>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-select">
              <option value="">All Categories</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Tablet">Tablet</option>
              <option value="Camera">Camera</option>
              <option value="Other">Other</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-select">
              <option value="newest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>
        {/* <hr className="home-divider" /> */}
      </div>

      {filteredGadgets.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No gadgets available</h3>
          <p className="empty-state-message">Check back later for available gadgets!</p>
        </div>
      ) : (
        <div className="marketplace-grid">
          {filteredGadgets.map((gadget) => {
            const postedDate = new Date(gadget.createdAt);
            const isNew = (Date.now() - postedDate.getTime()) < 24 * 60 * 60 * 1000;

            return (
              <Link key={gadget._id} to={`/gadgets/${gadget._id}`} className="gadget-card">
                <img src={gadget.image} alt={gadget.title} className="gadget-image" />
                <div className="gadget-content">
                  <h3 className="gadget-title">{gadget.title}</h3>
                  <div className="gadget-meta">
                    <span className="gadget-price">${gadget.price}</span>
                    <span className="gadget-status">{gadget.status}</span>
                    {isNew && <span className="badge-new">New</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
