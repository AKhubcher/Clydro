import React, { useState, useRef } from 'react';
import { 
  FaUser, FaEnvelope, FaLock, FaArrowLeft, 
  FaCamera, FaPhone, FaHome, FaCity, FaGlobe, FaEdit,
  FaExclamationCircle, FaMapMarked 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  validateName, validateEmail, validatePhone, 
  validateAddress, validateCity, validateState, 
  validateZipCode, validateCountry 
} from '../../utils/validation';
import '../../styles/account.css';

const Account = () => {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [profile, setProfile] = useState(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const userData = JSON.parse(savedData);
      return {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        photo: null,
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      };
    }
    return {
      name: '',
      email: '',
      phone: '',
      photo: null,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    };
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    const newErrors = {
      name: validateName(profile.name),
      email: validateEmail(profile.email),
      phone: validatePhone(profile.phone),
      'address.street': validateAddress(profile.address.street),
      'address.city': validateCity(profile.address.city),
      'address.state': validateState(profile.address.state),
      'address.zipCode': validateZipCode(profile.address.zipCode),
      'address.country': validateCountry(profile.address.country)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSave = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const updatedUser = {
        ...currentUser,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        photo: profile.photo
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      const registeredUsers = localStorage.getItem('registeredUsers');
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        if (users[profile.email]) {
          users[profile.email] = {
            ...users[profile.email],
            name: profile.name,
            phone: profile.phone,
            address: profile.address,
            photo: profile.photo
          };
          localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const FormGroup = ({ label, icon: Icon, error, field, children }) => (
    <div className={`form-group ${error && touched[field] ? 'error' : ''}`}>
      <label>
        <Icon /> {label}
      </label>
      {React.cloneElement(children, {
        onBlur: () => setTouched(prev => ({ ...prev, [field]: true }))
      })}
      {error && touched[field] && (
        <span className="error-message">
          <FaExclamationCircle /> {error}
        </span>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div className="page-content">
        {submitError && (
          <div className="error-banner">
            <FaExclamationCircle /> {submitError}
          </div>
        )}

        <div className="profile-grid">
          {/* Profile Photo Section */}
          <section className="profile-photo-section">
            <div className="profile-photo-container">
              <div 
                className="profile-photo"
                style={{ backgroundImage: profile.photo ? `url(${profile.photo})` : 'none' }}
              >
                {!profile.photo && <FaUser />}
                <button 
                  className="upload-photo-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCamera />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <h3>{profile.name}</h3>
              <p className="profile-email">{profile.email}</p>
            </div>
          </section>

          {/* Personal Information Section */}
          <section className="profile-section">
            <div className="section-header">
              <h3>Personal Information</h3>
              <button 
                className="edit-button"
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                <FaEdit /> {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="form-grid">
              <FormGroup label="Full Name" icon={FaUser} field="name" error={errors.name}>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup label="Email" icon={FaEnvelope} field="email" error={errors.email}>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup label="Phone" icon={FaPhone} field="phone" error={errors.phone}>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </FormGroup>
            </div>
          </section>

          {/* Address Section */}
          <section className="profile-section">
            <div className="section-header">
              <h3>Address Information</h3>
            </div>

            <div className="form-grid">
              <FormGroup label="Street Address" icon={FaHome} field="address.street" error={errors['address.street']}>
                <input
                  type="text"
                  value={profile.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup label="City" icon={FaCity} field="address.city" error={errors['address.city']}>
                <input
                  type="text"
                  value={profile.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup label="State" icon={FaMapMarked} field="address.state" error={errors['address.state']}>
                <input
                  type="text"
                  value={profile.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup label="ZIP Code" icon={FaMapMarked} field="address.zipCode" error={errors['address.zipCode']}>
                <input
                  type="text"
                  value={profile.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup label="Country" icon={FaGlobe} field="address.country" error={errors['address.country']}>
                <input
                  type="text"
                  value={profile.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  disabled={!isEditing}
                />
              </FormGroup>
            </div>
          </section>

          {/* Security Section */}
          <section className="security-section">
            <div className="section-header">
              <h3>Security</h3>
            </div>
            <div className="security-options">
              <button className="change-password-button">
                <FaLock /> Change Password
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Account; 