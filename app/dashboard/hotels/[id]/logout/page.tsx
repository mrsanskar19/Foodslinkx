"use client"
import { useContext, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context'; // Adjust according to your file structure
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 bg-white">
      <h2 className="text-2xl font-semibold text-gray-800">Thank you for using our service!</h2>
      <p className="text-gray-600">You have been successfully logged out.</p>
      <button
        onClick={() => router.push('/')}
        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
}
