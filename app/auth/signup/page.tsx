"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle, MapPin, CreditCard, Building, User, Mail, Phone, Key } from "lucide-react"
import { useRouter } from "next/navigation"

const steps = [
  {
    title: "Restaurant Info",
    description: "Basic details about your establishment.",
    icon: <Building />,
  },
  {
    title: "Your Details",
    description: "Create your admin account.",
    icon: <User />,
  },
  {
    title: "Confirmation",
    description: "Review and submit.",
    icon: <CheckCircle />,
  },
]

export default function RestaurantSignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    hotelName: "",
    address: "",
    upiId: "",
    plan: "free",
    username: "",
    email: "",
    phone: "",
    password: "",
    latitude: 0,
    longitude: 0,
  })
  const [loading, setLoading] = useState(false)
  const [geoError, setGeoError] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState("")

  // Auto-fetch location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }))
        },
        (err) => {
          console.error(err)
          setGeoError("Unable to get your location. Please allow access or enter manually.")
        }
      )
    } else {
      setGeoError("Geolocation is not supported by your browser.")
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Add validation before proceeding
      if (currentStep === 0) {
        if (!form.hotelName || !form.address || !form.upiId) {
          setError("Please fill all restaurant details.")
          return
        }
      }
      if (currentStep === 1) {
        if (!form.username || !form.email || !form.phone || !form.password) {
          setError("Please fill all your details.")
          return
        }
      }
      setError("")
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        
        router.push("/dashboard/pending-verification")
        setForm({
          hotelName: "",
          address: "",
          upiId: "",
          plan: "free",
          username: "",
          email: "",
          phone: "",
          password: "",
          latitude: form.latitude,
          longitude: form.longitude,
        })
        setCurrentStep(0)
      } else {
        setError(data.message || "Signup failed")
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred while signing up.")
    }
    setLoading(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
               <Building className="absolute left-3 top-9 text-gray-400" size={20} />
              <input name="hotelName" value={form.hotelName} onChange={handleChange} required className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. The Grand Hotel" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <MapPin className="absolute left-3 top-9 text-gray-400" size={20} />
              <input name="address" value={form.address} onChange={handleChange} required className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="123 Main St, Anytown" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <CreditCard className="absolute left-3 top-9 text-gray-400" size={20} />
              <input name="upiId" value={form.upiId} onChange={handleChange} required className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="your-upi-id@bank" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose Plan
                </label>
                <select
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="free">Free (Trial)</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
            </div>
             <div className="bg-indigo-50 p-3 rounded-md mt-2 text-indigo-700 text-sm flex items-center gap-3">
                <MapPin size={20} />
                <div>
                  <p>Location: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>
                  {geoError && <p className="text-red-600 text-xs">{geoError}</p>}
                </div>
              </div>
          </>
        )
      case 1:
        return (
          <>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
               <User className="absolute left-3 top-9 text-gray-400" size={20} />
              <input name="username" value={form.username} onChange={handleChange} required className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="your_username" />
            </div>
             <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Mail className="absolute left-3 top-9 text-gray-400" size={20} />
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
            </div>
             <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Phone className="absolute left-3 top-9 text-gray-400" size={20} />
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="+1 234 567 890" />
            </div>
             <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Key className="absolute left-3 top-9 text-gray-400" size={20} />
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
            </div>
          </>
        )
      case 2:
        return (
            <div className="text-gray-700 space-y-2 text-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800">
                <CheckCircle size={24} /> Confirm Details
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold text-base mb-2 text-indigo-700">Restaurant Details</h3>
                <p><strong>Name:</strong> {form.hotelName || "-"}</p>
                <p><strong>Address:</strong> {form.address || "-"}</p>
                <p><strong>UPI ID:</strong> {form.upiId || "-"}</p>
                <p><strong>Plan:</strong> <span className="capitalize">{form.plan}</span></p>
                 <p><strong>Location:</strong> {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>
              </div>
               <div className="p-4 bg-gray-50 rounded-lg border">
                 <h3 className="font-semibold text-base mb-2 text-indigo-700">Your Details</h3>
                <p><strong>Username:</strong> {form.username || "-"}</p>
                <p><strong>Email:</strong> {form.email || "-"}</p>
                <p><strong>Phone:</strong> {form.phone || "-"}</p>
               </div>
            </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-2xl glass rounded-3xl shadow-2xl">
        {/* Progress Steps */}
        <div className="flex justify-between items-center px-8 py-5 bg-white rounded-t-xl border-b">
           {steps.map((step, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${idx <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                {step.icon}
              </div>
              <div className="ml-3">
                <div className={`font-semibold ${idx <= currentStep ? 'text-indigo-600' : 'text-gray-500'}`}>{step.title}</div>
                 <div className="text-xs text-gray-400">{step.description}</div>
              </div>
               {idx < steps.length - 1 && <div className="ml-6 w-12 h-px bg-gray-300" />}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-4">
           {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
          {renderStepContent()}
        </form>

        {/* Navigation Buttons */}
        <div className="px-10 py-4 bg-gray-50 rounded-b-xl border-t flex justify-between items-center">
          {currentStep > 0 ? (
            <button type="button" onClick={prevStep} className="px-6 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-100 transition">
              Back
            </button>
          ) : <div />}

          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={nextStep} className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition">
              Next
            </button>
          ) : (
            <button type="submit" onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-green-300 transition">
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
