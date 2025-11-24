
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Menu } from '@/lib/models/menu'; // Assuming you have a Menu model

export default function EditMenuPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;
  const menuId = params.menuId as string;

  const [menuItem, setMenuItem] = useState<Partial<Menu>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}/menu-items/${menuId}`); // Assuming a direct menu endpoint
        if (!res.ok) throw new Error('Failed to fetch menu item');
        const data = await res.json();
        setMenuItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (menuId) {
      fetchMenuItem();
    }
  }, [menuId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setMenuItem(prev => ({ ...prev, [name]: checked }));
    } else {
      setMenuItem(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/hotels/${hotelId}/menu-items/${menuId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(menuItem),
        }
      );

      if (!res.ok) throw new Error('Failed to update menu item');
      
      alert('Menu item updated successfully!');
      router.push(`/dashboard/hotels/${hotelId}/menu`);
    } catch (err: any) {
      setError(err.message);
      alert('Update failed. Please check the console for more details.');
    }
  };

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 p-8">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Menu Item</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={menuItem.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={menuItem.description || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={menuItem.price || 0}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={menuItem.image || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={menuItem.category || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Dietary Info */}
          <div className="flex items-center gap-4">
            <label className="block text-sm font-semibold text-gray-700">Dietary Information:</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVegetarian"
                name="isVegetarian"
                checked={menuItem.isVegetarian || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isVegetarian" className="ml-2 text-sm text-gray-600">Vegetarian</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVegan"
                name="isVegan"
                checked={menuItem.isVegan || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isVegan" className="ml-2 text-sm text-gray-600">Vegan</label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
