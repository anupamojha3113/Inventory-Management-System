import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedUser && storedAccessToken && storedRefreshToken) {
      try {
        const fullName = JSON.parse(storedUser);
        setUser(fullName);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);

  const login = (data) => {
    setUser(data.fullName);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    localStorage.setItem('user', JSON.stringify(fullName));
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
