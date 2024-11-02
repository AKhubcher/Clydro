import React from 'react';
import { FaCog, FaUser, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/profile.css';

const ProfileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: FaUser, label: 'Account', path: '/profile/account' },
    { icon: FaCog, label: 'Settings', path: '/profile/settings' },
    { icon: FaBell, label: 'Notifications', path: '/profile/notifications' }
  ];

  if (!isOpen) return null;

  return (
    <div className="profile-menu-overlay" onClick={onClose}>
      <div className="profile-menu" onClick={e => e.stopPropagation()}>
        {menuItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            className="profile-menu-item"
            onClick={() => {
              navigate(path);
              onClose();
            }}
          >
            <Icon className="profile-menu-icon" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileMenu; 