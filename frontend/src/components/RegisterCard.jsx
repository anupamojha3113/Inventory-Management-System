import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { registerUser } from '../utils/authUtils';

const RegisterCard = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null); // 'error' or 'success'
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setAlertMessage('All fields are required');
      setAlertType('error');
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match');
      setAlertType('error');
      return;
    }

    try {
      const { userobject, accessToken, refreshToken } = await registerUser(fullName, username, email, password);
      login(userobject, accessToken, refreshToken);
      setAlertMessage('Registration successful!');
      setAlertType('success');
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Registration error');
      setAlertType('error');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {alertMessage && (
        <div className={`p-4 mb-4 text-white rounded ${alertType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterCard;
