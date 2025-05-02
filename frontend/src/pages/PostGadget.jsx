import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/PostGadget.css';

export default function PostGadget() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Smartphone',
    price: '',
    phoneNumber: '',
    upiId: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const categories = ['Smartphone', 'Laptop', 'Tablet', 'Camera', 'Other'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setFormData({
        ...formData,
        image: files[0],
      });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User not found. Please login again.');
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append('sellerEmail', user.email);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post('/gadgets', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to post gadget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-gadget-page">
      <div className="post-gadget-card">
        <h1>Post a New Gadget</h1>

        <form onSubmit={handleSubmit} className="post-gadget-form">
          {error && <div className="error-box">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="input"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="input"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              className="input"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="input"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="upiId">UPI ID</label>
            <input
              type="text"
              id="upiId"
              name="upiId"
              className="input"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="example@upi"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              className="input"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Posting...' : 'Post Gadget'}
          </button>
        </form>
      </div>
    </div>
  );
}
