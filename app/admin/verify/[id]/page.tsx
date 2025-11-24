'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Calendar, Hash, Crown, Info, MapPin, DollarSign } from "lucide-react";

// Assuming a Hotel model structure
type Hotel = {
  _id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  upiId: string;
  verified: boolean;
  plan: 'free' | 'premium' | 'enterprise';
  planExpiry: string;
  maxTables: number;
};

export default function VerifyHotelPage() {
  const router = useRouter();
  const params = useParams();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) return;
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}`);
        if (!res.ok) throw new Error("Failed to fetch hotel details");
        const data = await res.json();
        // Convert date to YYYY-MM-DD for input
        data.planExpiry = data.planExpiry ? new Date(data.planExpiry).toISOString().split('T')[0] : '';
        setHotel(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [hotelId]);

  const handleUpdate = async () => {
    if (!hotel) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/hotels/${hotelId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...hotel,
            verified: true,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update hotel");
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !hotel) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <button onClick={() => router.push('/admin')} className="flex items-center gap-2 text-foreground hover:text-primary mb-8">
        <ArrowLeft size={20} />
        <span className="font-semibold">Back to Admin</span>
      </button>

      <div className="bg-card p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-primary mb-4">Verify Hotel Details</h1>
        <p className="text-muted-foreground mb-8">Review and approve the hotel to bring it online.</p>

        <div className="space-y-6">
            {/* Hotel Info */}
            <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold flex items-center gap-2"><Info size={20}/> Hotel Information</h2>
                <p><strong>Name:</strong> {hotel.name}</p>
                {/* <p><strong>Location:</strong> {hotel.location.lat}, {hotel.location.lng}</p> */}
                <p><strong>UPI ID:</strong> {hotel.upiId}</p>
            </div>

            {/* Verification Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-semibold flex items-center gap-2"><Crown size={16}/> Subscription Plan</label>
                    <select value={hotel.plan} onChange={(e) => setHotel({ ...hotel, plan: e.target.value as any })} className="w-full input">
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="font-semibold flex items-center gap-2"><Calendar size={16}/> Plan Expiry</label>
                    <input type="date" value={hotel.planExpiry} onChange={(e) => setHotel({ ...hotel, planExpiry: e.target.value })} className="w-full input" />
                </div>
                <div className="space-y-2">
                    <label className="font-semibold flex items-center gap-2"><Hash size={16}/> Max Tables</label>
                    <input type="number" value={hotel.maxTables} onChange={(e) => setHotel({ ...hotel, maxTables: parseInt(e.target.value) })} className="w-full input" />
                </div>
            </div>

            <button onClick={handleUpdate} disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2">
                <ShieldCheck size={20}/>
                {loading ? 'Verifying...' : 'Approve and Verify'}
            </button>
        </div>
      </div>
    </div>
  );
}
