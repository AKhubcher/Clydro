import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaWater } from 'react-icons/fa';
import Loader from './common/Loader';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({
        type: 'success',
        text: 'Password reset instructions have been sent to your email.'
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send reset instructions. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader message="Sending reset instructions..." />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <FaWater className="logo-icon pulse" />
          <h1>Clydro</h1>
        </div>
        <h2>Reset Password</h2>
        
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <FaEnvelope className="form-icon" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <button type="submit" className="auth-button">
            Send Reset Instructions
          </button>
        </form>

        <div className="auth-footer">
          <button 
            className="text-button"
            onClick={() => navigate('/login')}
          >
            <FaArrowLeft /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 