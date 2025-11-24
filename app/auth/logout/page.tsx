'use client'

import { useContext, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Home } from 'lucide-react';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          You've Been Logged Out
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for choosing our platform. We hope to see you again soon!
        </p>

        <div className="flex justify-center gap-4 mt-8">
            <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md"
            >
                <LogIn size={20} />
                <span>Login Again</span>
            </Link>
            <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-md"
            >
                <Home size={20} />
                <span>Go to Home</span>
            </Link>
        </div>
      </div>
    </div>
  );
}
