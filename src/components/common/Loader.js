import React from 'react';
import { FaTint } from 'react-icons/fa';
import '../../styles/loader.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="loader">
          <div className="spinner">
            <FaTint className="water-icon" />
          </div>
          <div className="ripples">
            <div className="ripple"></div>
            <div className="ripple"></div>
            <div className="ripple"></div>
          </div>
        </div>
        <p className="loader-message">{message}</p>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader; 