import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GenerateQRCodePage = () => {
  const [name, setName] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [quantity, setQuantity] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null); // 'error' or 'success'
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedDate = new Date(dateReceived);

    if (!name || !dateReceived || !quantity) {
      setAlertMessage('All fields are required');
      setAlertType('error');
      return;
    }

    if (selectedDate > currentDate) {
      setAlertMessage('Date Received cannot be in the future');
      setAlertType('error');
      return;
    }

    try {
      const response = await fetch('/api/inventory/createInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, dateReceived, balanceItems: quantity }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Log the response data
      console.log('Response data:', data);

      setAlertMessage('QR Code generated successfully!');
      setAlertType('success');
      setQrCodeImage(data.data.qrCodeImage); // Set the QR code image
      setTimeout(() => {
        navigate('/');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error creating inventory:', error);
      setAlertMessage(error.message || 'An error occurred');
      setAlertType('error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Generate QR Code</h2>
      {alertMessage && (
        <div className={`p-4 mb-4 text-white rounded ${alertType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <select
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          >
            <option value="">Select Name</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
            <option value="C3">C3</option>
            <option value="C4">C4</option>
            <option value="C5">C5</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date Received</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={dateReceived}
            onChange={(e) => setDateReceived(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Generate QR Code
        </button>
      </form>
      {qrCodeImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">QR Code</h3>
          <img src={qrCodeImage} alt="QR Code" className="mt-2" />
        </div>
      )}
    </div>
  );
};

export default GenerateQRCodePage;
