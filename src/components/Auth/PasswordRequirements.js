import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PasswordRequirements = ({ password }) => {
  const requirements = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8
    },
    {
      label: 'Contains uppercase letter',
      met: /[A-Z]/.test(password)
    },
    {
      label: 'Contains lowercase letter',
      met: /[a-z]/.test(password)
    },
    {
      label: 'Contains number',
      met: /[0-9]/.test(password)
    },
    {
      label: 'Contains special character',
      met: /[!@#$%^&*]/.test(password)
    }
  ];

  return (
    <div className="password-requirements">
      <h4>Password Requirements</h4>
      <div className="requirements-grid">
        {requirements.map((req, index) => (
          <div 
            key={index} 
            className={`requirement-item ${req.met ? 'met' : ''}`}
          >
            {req.met ? <FaCheck /> : <FaTimes />}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements; 