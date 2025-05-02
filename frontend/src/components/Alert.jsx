import React from 'react';
import { IoClose } from 'react-icons/io5';
import '../components/css/Alert.css';

const Alert = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <p className="alert-message">{message}</p>
      </div>
      <button className="alert-close" onClick={onClose}>
        <IoClose size={20} />
      </button>
    </div>
  );
};

export default Alert; 