import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexamed_token') || null);
  const [userProfile, setUserProfile] = useState(null);
  const [userAllergies, setUserAllergies] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [userContacts, setUserContacts] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('nexamed_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexamed_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const fetchProfile = async (authToken) => {
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setUserProfile(data.profile);
        setUserAllergies(data.allergies || []);
        setUserHistory(data.history || []);
        setUserContacts(data.contacts || []);
        setUserReports(data.reports || []);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('nexamed_token', newToken);
    setToken(newToken);
    setUser(userData);
    fetchProfile(newToken);
  };

  const logout = () => {
    localStorage.removeItem('nexamed_token');
    setToken(null);
    setUser(null);
    setUserProfile(null);
    setUserAllergies([]);
    setUserHistory([]);
    setUserContacts([]);
    setUserReports([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userProfile,
        userAllergies,
        userHistory,
        userContacts,
        userReports,
        theme,
        toggleTheme,
        login,
        logout,
        fetchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
