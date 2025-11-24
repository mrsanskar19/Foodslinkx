"use client";

import React, { useState, useEffect } from "react";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: any;
  available?: boolean;
  image?: string;
}

interface CreateInvoiceModalProps {
  hotelId: string;
  onClose: () => void;
  onInvoiceCreated: () => void;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ hotelId, onClose, onInvoiceCreated }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/hotels/${hotelId}/menu`);
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        setMenuItems(data.menu || []);
      } catch (err) {
        setError("Error loading menu items");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [hotelId]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      if (prev[id]) {
        const newSelected = { ...prev };
        delete newSelected[id];
        return newSelected;
      } else {
        return { ...prev, [id]: 1 };
      }
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setSelectedItems((prev) => ({ ...prev, [id]: qty }));
  };

  const handleCreateInvoice = async () => {
    if (Object.keys(selectedItems).length === 0) {
      alert("Please select at least one menu item.");
      return;
    }

    try {
      setLoading(true);
      // Construct the invoice payload
      const items = Object.entries(selectedItems).map(([id, qty]) => {
        const menuItem = menuItems.find((item) => item._id === id);
        return {
          menuItemId: id,
          name: menuItem?.name || "",
          price: menuItem?.price || 0,
          quantity: qty,
        };
      });

      // This example assumes an API endpoint to create orders/invoices, adapt as needed
      const res = await fetch(`/api/dashboard/hotels/${hotelId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Failed to create invoice");
      onInvoiceCreated();
      onClose();
    } catch (err) {
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 overflow-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item._id} className="border rounded p-3 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedItems[item._id]}
                      onChange={() => toggleSelectItem(item._id)}
                    />
                    <span className="font-semibold">{item.name}</span>
                  </label>
                  <span>₹{item.price}</span>
                </div>
                {selectedItems[item._id] && (
                  <input
                    type="number"
                    min={1}
                    className="border rounded w-20 text-center"
                    value={selectedItems[item._id]}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateInvoice}
            className="py-2 px-6 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
