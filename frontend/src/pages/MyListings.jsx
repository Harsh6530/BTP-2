import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './css/MyListings.css';

export default function MyListings() {
  const [gadgets, setGadgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchGadgets = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        let user = JSON.parse(localStorage.getItem('user'));

        if (!token) {
          setError('You must be logged in to view your listings.');
          setLoading(false);
          return;
        }

        // If we have a token but no user data, try to fetch user data
        if (!user) {
          try {
            const response = await axios.get('/auth/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
          } catch (err) {
            setError('You must be logged in to view your listings.');
            setLoading(false);
            return;
          }
        }

        // Fetch user's gadgets
        const response = await axios.get(`/gadgets/my-gadgets?email=${user.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGadgets(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load your gadgets');
          setLoading(false);
        }
      }
    };

    checkAuthAndFetchGadgets();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.delete(`/gadgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGadgets(gadgets.filter(gadget => gadget._id !== id));
    } catch (err) {
      setError('Failed to delete gadget');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your listings..." />;
  }

  if (error === 'You must be logged in to view your listings.') {
    return (
      <div className="mylistings-loader">
        <div className="mylistings-error" style={{ color: 'red' }}>{error}</div>
        <Link to="/login" className="login-redirect-button">Go to Login</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mylistings-loader">
        <div className="mylistings-error" style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="mylistings-container">
      <div className="mylistings-content">
        <h1 className="mylistings-title">My Listings</h1>
      </div>

      {gadgets.length === 0 ? (
        <div className="mylistings-empty">
          <h3>No listings yet</h3>
          <p>Your posted gadgets will appear here</p>
        </div>
      ) : (
        <div className="mylistings-grid">
          {gadgets.map((gadget) => (
            <div key={gadget._id} className="gadget-card">
              <div className="gadget-image">
                <img src={gadget.image} alt={gadget.title} />
              </div>
              <div className="gadget-details">
                <h3>{gadget.title}</h3>
                <p className="category">{gadget.category}</p>
                <p className="price">${gadget.price}</p>
                <div className="gadget-actions">
                  <Link to={`/gadgets/${gadget._id}`} className="view-link">View Details</Link>
                  <button onClick={() => handleDelete(gadget._id)} className="delete-button">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
