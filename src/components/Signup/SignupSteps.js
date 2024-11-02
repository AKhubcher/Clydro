import React, { useState } from 'react';
import { 
  FaUser, FaEnvelope, FaLock, FaHome, 
  FaShieldAlt, FaArrowRight, FaArrowLeft, FaCheck,
  FaBuilding, FaMapMarkerAlt, FaPhone, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import PasswordRequirements from '../Auth/PasswordRequirements';

// Define FormGroup component
const FormGroup = ({ label, icon: Icon, error, field, value, onChange, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`form-group ${error ? 'error' : ''}`}>
      <label>
        <Icon className="form-icon" />
        <span>{label}</span>
      </label>
      <div className="password-input-container">
        <input
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={`Enter your ${label.toLowerCase()}`}
          required
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

// Define step icons and titles
const stepIcons = {
  1: <FaShieldAlt className="step-icon" />,
  2: <FaUser className="step-icon" />,
  3: <FaHome className="step-icon" />
};

const stepTitles = {
  1: 'Account Security',
  2: 'Personal Information',
  3: 'Address Details'
};

const SignupSteps = ({ onComplete }) => {
  const { setError } = useAuth();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (formData.password.length < 8) newErrors.password = 'Password too short';
        break;

      case 2:
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        break;

      case 3:
        if (!formData.address.street) newErrors['address.street'] = 'Street is required';
        if (!formData.address.city) newErrors['address.city'] = 'City is required';
        if (!formData.address.state) newErrors['address.state'] = 'State is required';
        if (!formData.address.zipCode) newErrors['address.zipCode'] = 'ZIP code is required';
        if (!formData.address.country) newErrors['address.country'] = 'Country is required';
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      try {
        localStorage.setItem('userData', JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        }));
        
        await onComplete(formData);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="signup-step">
            <div className="step-header">
              {stepIcons[1]}
              <h3>{stepTitles[1]}</h3>
            </div>
            <FormGroup 
              label="Email Address"
              icon={FaEnvelope}
              error={errors.email}
              field="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <FormGroup 
              label="Password"
              icon={FaLock}
              error={errors.password}
              field="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <FormGroup 
              label="Confirm Password"
              icon={FaLock}
              error={errors.confirmPassword}
              field="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
            <PasswordRequirements password={formData.password} />
          </div>
        );

      case 2:
        return (
          <div className="signup-step">
            <div className="step-header">
              {stepIcons[2]}
              <h3>{stepTitles[2]}</h3>
            </div>
            <FormGroup 
              label="Full Name"
              icon={FaUser}
              error={errors.name}
              field="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <FormGroup 
              label="Phone Number"
              icon={FaPhone}
              error={errors.phone}
              field="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        );

      case 3:
        return (
          <div className="signup-step">
            <div className="step-header">
              {stepIcons[3]}
              <h3>{stepTitles[3]}</h3>
            </div>
            <FormGroup 
              label="Street Address"
              icon={FaHome}
              error={errors['address.street']}
              field="address.street"
              value={formData.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
            />
            <FormGroup 
              label="City"
              icon={FaBuilding}
              error={errors['address.city']}
              field="address.city"
              value={formData.address.city}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
            />
            <FormGroup 
              label="State"
              icon={FaMapMarkerAlt}
              error={errors['address.state']}
              field="address.state"
              value={formData.address.state}
              onChange={(e) => handleInputChange('address.state', e.target.value)}
            />
            <FormGroup 
              label="ZIP Code"
              icon={FaMapMarkerAlt}
              error={errors['address.zipCode']}
              field="address.zipCode"
              value={formData.address.zipCode}
              onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
            />
            <FormGroup 
              label="Country"
              icon={FaMapMarkerAlt}
              error={errors['address.country']}
              field="address.country"
              value={formData.address.country}
              onChange={(e) => handleInputChange('address.country', e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div className="steps-progress">
        {[1, 2, 3].map(num => (
          <div key={num} className="step-wrapper">
            <div className={`step-indicator ${num === step ? 'active' : ''} ${num < step ? 'completed' : ''}`}>
              {num}
            </div>
            <div className="step-label">
              {stepIcons[num]}
              <span>{stepTitles[num]}</span>
            </div>
          </div>
        ))}
      </div>

      {renderStepContent()}

      <div className="step-buttons">
        {step > 1 && (
          <button 
            type="button" 
            onClick={() => setStep(prev => prev - 1)} 
            className="step-button prev-button"
          >
            <FaArrowLeft />
            <span>Previous</span>
          </button>
        )}
        {step < 3 ? (
          <button 
            type="button" 
            onClick={handleNext} 
            className="step-button next-button"
          >
            <span>Next</span>
            <FaArrowRight />
          </button>
        ) : (
          <button 
            type="submit" 
            className="step-button submit-button"
          >
            <span>Complete</span>
            <FaCheck />
          </button>
        )}
      </div>
    </form>
  );
};

export default SignupSteps; 