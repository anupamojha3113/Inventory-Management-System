import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { logoutUser } from '../utils/authUtils';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Call logoutUser to clear localStorage
    logout(); // Call logout from AuthContext to update state
    navigate('/login'); // Redirect to login page after logout
  };

  const handleGenerateQRCode = () => {
    // Logic to generate QR Code
  };

  const handleScanQRCode = () => {
    // Logic to scan QR Code
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="text-white text-center md:text-left mb-4 md:mb-0">
          <div className="text-lg md:text-xl font-semibold">
            {user ? `Welcome, ${user}` : 'Welcome'} To Our
          </div>
          <div className="text-xl md:text-2xl font-bold">
            Inventory Management System
          </div>
        </div>
        <div className="flex flex-wrap items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm md:text-base hover:bg-blue-600">
                Login
              </Link>
              <Link to="/register" className="bg-green-500 text-white py-2 px-4 rounded-lg text-sm md:text-base hover:bg-green-600">
                Register
              </Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm md:text-base hover:bg-red-600">
                Logout
              </button>
              <Link to="/generate-qrcode" className="bg-yellow-500 text-white py-2 px-4 rounded-lg text-sm md:text-base hover:bg-yellow-600">
                Generate QR Code
              </Link>
              <button onClick={handleScanQRCode} className="bg-purple-500 text-white py-2 px-4 rounded-lg text-sm md:text-base hover:bg-purple-600">
                Scan QR Code
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
