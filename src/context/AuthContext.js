import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Define mock user at the top level
const MOCK_USER = {
  email: 'demo@clydro.com',
  password: 'Demo123!',
  name: 'Demo User',
  phone: '555-0123',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Check if it's the demo account
      if (email === MOCK_USER.email) {
        if (password === MOCK_USER.password) {
          const userData = { ...MOCK_USER };
          delete userData.password; // Don't store password in state
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          return userData;
        } else {
          throw new Error('Invalid password');
        }
      }

      // Check for registered users
      const registeredUsers = localStorage.getItem('registeredUsers');
      const users = registeredUsers ? JSON.parse(registeredUsers) : {};

      if (users[email]) {
        if (users[email].password === password) {
          const userData = { ...users[email] };
          delete userData.password;
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          return userData;
        } else {
          throw new Error('Invalid password');
        }
      }

      throw new Error('User not found');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Get existing users or initialize empty object
      const registeredUsers = localStorage.getItem('registeredUsers');
      const users = registeredUsers ? JSON.parse(registeredUsers) : {};

      // Check if email already exists
      if (users[formData.email] || formData.email === MOCK_USER.email) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        email: formData.email,
        password: formData.password, // In a real app, this should be hashed
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        createdAt: new Date().toISOString()
      };

      // Save to "database"
      users[formData.email] = newUser;
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      // Log user in
      const userData = { ...newUser };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 