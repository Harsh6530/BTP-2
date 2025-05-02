import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GadgetDetails from './pages/GadgetDetails';
import MyListings from './pages/MyListings';
import PostGadget from './pages/PostGadget';

// Set up axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check both localStorage and sessionStorage for a token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Fetch user data
          const response = await axios.get('/auth/me');
          setUser(response.data);
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear auth data on error
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    initializeAuth();
  }, []);

  const handleLogin = (token, userData) => {
    // Set axios header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  // Check if current route is login or register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (loading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return (
    <div className="app">
      {!isAuthPage && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} />
        <Route path="/gadgets/:id" element={<GadgetDetails />} />
        <Route path="/my-listings" element={user ? <MyListings /> : <Navigate to="/login" />} />
        <Route path="/post-gadget" element={user ? <PostGadget /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
