import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchInventory, deleteInventoryItem } from '../utils/inventoryUtils';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getInventory = async () => {
    try {
      const data = await fetchInventory();
      setInventory(data.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setError('Failed to fetch inventory.');
    }
  };

  useEffect(() => {
    const getInventory = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data.data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        setError('Failed to fetch inventory.');
      }
    };
    getInventory();
  }, [inventory]);

  useEffect(() => {
    if (location.state?.fromUpdate) {
      getInventory();
    }
  }, [location.state]);

  const handleDelete = async (id) => {
    try {
      console.log("delete");
      await deleteInventoryItem(id);
      setInventory((prevInventory) => prevInventory.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
      setError('Failed to delete inventory item.');
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-inventory/${id}`, { state: { fromUpdate: true } });
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      {user ? (
        <div>
          <h2 className="text-2xl mb-4">Welcome, {user.fullName}!</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Date Received / Quantity</th>
                <th className="py-2 px-4 border-b">Date Dispatched / Quantity</th>
                <th className="py-2 px-4 border-b">Pending Items</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">QR Code</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map(item => (
                  <tr key={item._id}>
                    <td className="py-2 px-4 border-b">{item.name}</td>
                    <td className="py-2 px-4 border-b">{new Date(item.dateReceived).toLocaleDateString()} / {item.balanceItems}</td>
                    <td className="py-2 px-4 border-b">{item.dateDispatched ? new Date(item.dateDispatched).toLocaleDateString() : 'N/A'} / {item.quantityDispatched || 0}</td>
                    <td className="py-2 px-4 border-b">{item.pendingItems || 0}</td>
                    <td className="py-2 px-4 border-b">{item.status || 'Pending'}</td>
                    <td className="py-2 px-4 border-b">
                      <a href={item.qrCodeUrl} download>Download</a>
                      {item.qrCodeUrl && (
                        <img src={item.qrCodeUrl} alt="QR Code" className="mt-2 w-16 h-16" />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 mr-2">Delete</button>
                      <button onClick={() => handleUpdate(item._id)} className="text-blue-500 hover:text-blue-700">Update</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-2 px-4 border-b text-center">No inventory items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Home;
