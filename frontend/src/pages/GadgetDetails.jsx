// GadgetDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/GadgetDetails.css';

export default function GadgetDetails() {
  const { id } = useParams();
  const [gadget, setGadget] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGadget = async () => {
      try {
        const response = await axios.get(`/gadgets/${id}`);
        setGadget(response.data);
      } catch (err) {
        setError('Failed to load gadget details');
      } finally {
        setLoading(false);
      }
    };

    fetchGadget();
  }, [id]);

  if (loading) return <div className="loading">Loading gadget details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!gadget) return <div className="not-found">Gadget not found</div>;

  const postedDate = new Date(gadget.createdAt).toLocaleString();

  return (
    <div className="gadget-details-container">
      <div className="gadget-details-card">
        <img src={gadget.image} alt={gadget.title} className="gadget-details-image" />
        <div className="gadget-details-info">
          <h2 className="gadget-title">{gadget.title}</h2>
          <p className="gadget-description">{gadget.description}</p>
          <p><strong>Category:</strong> {gadget.category}</p>
          <p><strong>Price:</strong> ${gadget.price}</p>
          <p><strong>Status:</strong> <span className={`status-tag ${gadget.status}`}>{gadget.status}</span></p>
          <div className="contact-info">
            <p><strong>Contact:</strong> <a href={`tel:${gadget.phoneNumber}`} className="call-button">{gadget.phoneNumber}</a></p>
            <p><strong>UPI ID:</strong> <span className="upi-id">{gadget.upiId}</span></p>
          </div>
          <p className="gadget-posted-date"><strong>Posted on:</strong> {postedDate}</p>
        </div>
      </div>
    </div>
  );
}