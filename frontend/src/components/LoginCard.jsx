import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { loginUser } from '../utils/authUtils';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null); // 'error' or 'success'
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlertMessage('All fields are required');
      setAlertType('error');
      return;
    }

    try {
      const { user, accessToken, refreshToken} = await loginUser(email, password);
      login(user, accessToken, refreshToken);
      setAlertMessage('Login successful!');
      setAlertType('success');
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'no such user exists please register');
      setAlertType('error');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {alertMessage && (
        <div className={`p-4 mb-4 text-white rounded ${alertType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleLogin}>
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginCard;
