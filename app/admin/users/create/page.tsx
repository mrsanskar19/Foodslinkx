'use client';

import { useState, useEffect } from 'react';

// Hotel type definition
interface Hotel {
  _id: string;
  name: string;
}

export default function CreateUserPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all hotels for dropdown selection
  useEffect(() => {
    async function fetchHotels() {
      try {
        const response = await fetch('/api/hotels'); // Replace with your actual endpoint
        if (!response.ok) throw new Error('Failed to fetch hotels');
        const data = await response.json();
        setHotels(data);
      } catch (error: any) {
        console.error('Error fetching hotels:', error);
        setMessage(`Error fetching hotels: ${error.message}`);
      }
    }
    fetchHotels();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage('');

    // Determine user role by selected dropdown value
    const role = hotelId === 'admin' ? 'admin' : 'hotel';
    const payload = {
      username,
      password,
      role,
      hotelId: hotelId === 'admin' ? null : hotelId
    };

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'User created successfully.');
        setUsername('');
        setPassword('');
        setHotelId('');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New User</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotelId">
            Role / Hotel:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="hotelId"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            required
          >
            <option value="">Select a role/hotel</option>
            <option value="admin">Admin (No hotel assigned)</option>
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
      {message && (
        <p className={`text-center text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
