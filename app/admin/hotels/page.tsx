'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Hotel {
  _id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  description: string;
  pricePerNight: number;
  rating: number;
  verified: boolean;
  images: string[];
  locationVerificationRadius: number;
  plan: "free" | "basic" | "premium";
  planExpiry: Date;
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState<"free" | "basic" | "premium">("free");

  useEffect(() => {
    const fetchHotels = async () => {
      const res = await fetch('/api/admin/hotels', { credentials: 'include' });
      const data = await res.json();
      setHotels(data.hotels);
    };
    fetchHotels();
  }, []);

  const handleChangePlan = async () => {
    if (!selectedHotel) return;

    try {
      const response = await fetch(`/api/admin/hotels/${selectedHotel._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setHotels((prev) => prev.map((h) => (h._id === selectedHotel._id ? data.hotel : h)));
        setShowPlanModal(false);
        setSelectedHotel(null);
      }
    } catch (error) {
      console.error("Error changing plan:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Hotels</h1>
        <Link href="/admin/hotels/create">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
            Add New Hotel
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Hotel Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Plan</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Verification Status</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Rating</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels?.map((hotel) => (
              <tr key={hotel._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{hotel.name}</td>
                <td className="px-4 py-3">{hotel.address}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {hotel.plan}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      hotel.verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {hotel.verified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-4 py-3">{hotel.rating || '--'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Link href={`/admin/verify/${hotel._id}`}>
                    <button className="text-blue-600 hover:underline">Verify</button>
                  </Link>
                  <Link href={`/admin/hotels/${hotel._id}/edit`}>
                    <button className="text-yellow-600 hover:underline">Edit</button>
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setNewPlan(hotel.plan);
                      setShowPlanModal(true);
                    }}
                    className="text-purple-600 hover:underline"
                  >
                    Change Plan
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plan Modal */}
      {showPlanModal && selectedHotel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Change Plan</h2>
            <p className="text-slate-600 mb-6">{selectedHotel.name}</p>

            <div className="space-y-3 mb-8">
              {(["free", "basic", "premium"] as const).map((plan) => (
                <label
                  key={plan}
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    newPlan === plan
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan}
                    checked={newPlan === plan}
                    onChange={(e) => setNewPlan(e.target.value as "free" | "basic" | "premium")}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 capitalize">{plan}</span>
                    <p className="text-sm text-slate-600">
                      {plan === 'free' && 'Basic features, limited tables'}
                      {plan === 'basic' && 'Enhanced features, more tables'}
                      {plan === 'premium' && 'All features, unlimited tables'}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePlan}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-150 shadow-lg hover:shadow-xl"
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
