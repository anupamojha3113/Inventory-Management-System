// utils/inventoryUtils.js
export const fetchInventory = async () => {
  const response = await fetch('/api/inventory/getAllInventory');
  if (!response.ok) {
    throw new Error('Failed to fetch inventory');
  }
  return await response.json();
};

export const deleteInventoryItem = async (id) => {
  const response = await fetch(`/api/inventory/deleteInventory/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete inventory item');
  }
  return await response.json();
};

// Fetch an inventory item by ID
export const fetchInventoryById = async (id) => {
  const response = await fetch(`/api/inventory/getInventoryById/${id}`,{
      method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch inventory item');
  }
  return response.json();
};

// Update an inventory item
export const updateInventoryItem = async (id, updatedData) => {
  const response = await fetch(`/api/inventory/updateInventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Failed to update inventory item');
  }
  return response.json();
};
