import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInventoryById, updateInventoryItem } from '../utils/inventoryUtils';

const UpdateInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [dateDispatch, setDateDispatch] = useState('');
  const [balanceItems, setBalanceItems] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInventory = async () => {
      try {
        const data = await fetchInventoryById(id);
        console.log(data);
        const inventory = data.data;
        setName(inventory.name);
        setPartNumber(inventory.partNumber || '');
        setDateReceived(new Date(inventory.dateReceived).toISOString().split('T')[0]);
        setDateDispatch(inventory.dateDispatch ? new Date(inventory.dateDispatch).toISOString().split('T')[0] : '');
        setBalanceItems(inventory.balanceItems || '');
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch inventory item:', error);
        setError('Failed to fetch inventory item.');
        setLoading(false);
      }
    };

    getInventory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    if (dateReceived > today || (dateDispatch && dateDispatch > today)) {
      setError('Dates cannot be in the future.');
      return;
    }

    try {
      const updatedData = {
        name,
        partNumber,
        dateReceived,
        dateDispatch,
        balanceItems
      };
      await updateInventoryItem(id, updatedData);
      navigate('/');
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      setError('Failed to update inventory item.');
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Update Inventory Item</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <select
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="C1">C1</option>
              <option value="C2">C2</option>
              <option value="C3">C3</option>
              <option value="C4">C4</option>
              <option value="C5">C5</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="partNumber" className="block text-sm font-medium text-gray-700">Part Number</label>
            <input
              type="text"
              id="partNumber"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dateReceived" className="block text-sm font-medium text-gray-700">Date Received</label>
            <input
              type="date"
              id="dateReceived"
              value={dateReceived}
              onChange={(e) => setDateReceived(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
          </div>
          <div className="mb-4">
            <label htmlFor="dateDispatch" className="block text-sm font-medium text-gray-700">Date Dispatch</label>
            <input
              type="date"
              id="dateDispatch"
              value={dateDispatch}
              onChange={(e) => setDateDispatch(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="balanceItems" className="block text-sm font-medium text-gray-700">Balance Items</label>
            <input
              type="number"
              id="balanceItems"
              value={balanceItems}
              onChange={(e) => setBalanceItems(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateInventory;
