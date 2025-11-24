'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface Hotel {
  _id: string;
  name: string;
  address: string;
  plan: "free" | "basic" | "premium";
  planExpiry: Date;
  maxTables: number;
  verified: boolean;
}

export default function EditHotelPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    plan: 'free' as "free" | "basic" | "premium",
    planExpiry: '',
    maxTables: 10,
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/admin/hotels/${params.id}`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          setHotel(data.hotel);
          setFormData({
            plan: data.hotel.plan,
            planExpiry: new Date(data.hotel.planExpiry).toISOString().split('T')[0],
            maxTables: data.hotel.maxTables,
          });
        } else {
          alert('Failed to fetch hotel');
        }
      } catch (error) {
        console.error('Error fetching hotel:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/hotels/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plan: formData.plan,
          planExpiry: new Date(formData.planExpiry),
          maxTables: formData.maxTables,
        }),
      });
      if (res.ok) {
        alert('Hotel updated successfully');
        router.push('/admin/hotels');
      } else {
        alert('Failed to update hotel');
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Hotel: {hotel.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Plan</label>
          <select
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value as "free" | "basic" | "premium" })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Plan Expiry</label>
          <input
            type="date"
            value={formData.planExpiry}
            onChange={(e) => setFormData({ ...formData, planExpiry: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Tables</label>
          <input
            type="number"
            value={formData.maxTables}
            onChange={(e) => setFormData({ ...formData, maxTables: parseInt(e.target.value) })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}