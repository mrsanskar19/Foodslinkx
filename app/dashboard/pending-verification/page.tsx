"use client"

import Link from "next/link"
import { Hourglass, Mail, Home } from "lucide-react"

export default function PendingVerificationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-xl shadow-md text-center max-w-lg w-full">
        <div className="mb-6">
          <Hourglass className="mx-auto text-yellow-500 animate-spin" size={60} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Verification Pending
        </h1>
        <p className="text-gray-600 mb-8 px-4">
          Your account has been created successfully and is currently under review by our administration team. 
          You will receive a notification once your hotel is verified. Thank you for your patience.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/" className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-sm">
              <Home size={20} />
              <span>Back to Home</span>
          </Link>
          <a
            href="mailto:foodslinkx@gmail.com"
            className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-sm"
          >
            <Mail size={20} />
            <span>Contact Admin</span>
          </a>
        </div>
      </div>
    </div>
  )
}
