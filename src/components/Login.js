import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, FaLock, FaWater, FaEye, FaEyeSlash 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import SignupSteps from './Signup/SignupSteps';
import Loader from './common/Loader';
import '../styles/auth.css';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(credentials.email, credentials.password);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  if (isLoading) {
    return <Loader message={isSigningUp ? "Creating your account..." : "Welcome back..."} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <FaWater className="logo-icon" />
          <h1>Clydro</h1>
        </div>
        <h2>{isSigningUp ? 'Create Account' : 'Welcome Back'}</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        {isSigningUp ? (
          <SignupSteps 
            onComplete={async (formData) => {
              setIsLoading(true);
              try {
                await login(formData.email, formData.password);
                navigate('/');
              } catch (error) {
                setError(error.message);
                setIsLoading(false);
              }
            }}
          />
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <FaEnvelope className="form-icon" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock className="form-icon" />
                <span>Password</span>
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>
        )}

        <div className="auth-footer">
          <button 
            className="text-button"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </button>
          <button 
            className="text-button"
            onClick={() => {
              setIsSigningUp(!isSigningUp);
              setError('');
              setCredentials({ email: '', password: '' });
            }}
          >
            {isSigningUp ? 'Already have an account?' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;