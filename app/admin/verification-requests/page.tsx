'use client'

import { useState, useEffect } from 'react';
import { Check, X, Shield, Clock, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import Link from "next/link"

interface Hotel {
  _id: string;
  name: string;
  address: string;
  upiId: string;
  plan: 'free' | 'basic' | 'premium';
  createdAt: string;
}

export default function VerificationRequestsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnverifiedHotels = async () => {
      try {
        const res = await fetch('/api/admin/hotels/unverified');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUnverifiedHotels();
  }, []);

  const handleVerification = async (id: string, approve: boolean) => {
    try {
      const endpoint = approve ? `/api/admin/hotels/verify/${id}` : `/api/admin/hotels/reject/${id}`;
      const method = approve ? 'PATCH' : 'DELETE'; // Assuming DELETE for rejection

      const res = await fetch(endpoint, { method });

      if (!res.ok) {
        throw new Error(`Failed to ${approve ? 'approve' : 'reject'}`);
      }

      // Update the UI by removing the processed hotel
      setHotels(hotels.filter(hotel => hotel._id !== id));
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100"><div className="text-xl font-semibold">Loading...</div></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-red-100 text-red-700">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Shield size={32} className="mr-3 text-indigo-600" />
            Hotel Verification Requests
          </h1>
          <div className="text-lg font-medium text-gray-500">
            Pending Requests: <span className="font-bold text-indigo-600">{hotels.length}</span>
          </div>
        </div>

        {hotels.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">All caught up!</h2>
            <p className="text-gray-500 mt-2">There are no pending verification requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate w-3/4">{hotel.name}</h2>
                    <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${hotel.plan === 'premium' ? 'bg-purple-600' : hotel.plan === 'basic' ? 'bg-blue-600' : 'bg-gray-500'}`}>
                      {hotel.plan}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-3 mt-4">
                    <p className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      {hotel.address}
                    </p>
                    <p className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      Requested: {new Date(hotel.createdAt).toLocaleDateString()}
                    </p>
                    <p className="flex items-center text-indigo-600 font-medium">
                      <ExternalLink size={16} className="mr-2" />
                      <a href={`/hotel/${hotel._id}`} target="_blank" rel="noopener noreferrer">View Full Profile</a>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <Link href={`/admin/verify/${hotel._id}`} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                    <Shield size={18} />
                    Verify
                  </Link>
                  <button
                    onClick={() => handleVerification(hotel._id, false)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all shadow-sm"
                  >
                    <X size={18} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
