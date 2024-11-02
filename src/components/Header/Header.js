import React, { useState } from 'react';
import { FaUser, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import ProfileMenu from '../Profile/ProfileMenu';
import '../../styles/header.css';

const Header = ({ onProfileClick, onLogout }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="dashboard-header">
      <h1>Clydro</h1>
      <div className="header-controls">
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
        </button>
        <button 
          className="profile-button"
          onClick={() => setIsProfileMenuOpen(true)}
        >
          <FaUser />
        </button>
        <button 
          className="logout-button"
          onClick={onLogout}
        >
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>

      <ProfileMenu 
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
      />
    </header>
  );
};

export default Header; 