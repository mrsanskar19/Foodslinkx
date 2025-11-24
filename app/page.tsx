"use client";

import React from "react";
import { useState, useEffect } from "react"
import {
  BookOpen,
  Users,
  Smile,
  CreditCard,
  PhoneCall,
  User,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch('/api/hotels');
        if (!res.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const data = await res.json();
        // just show the first 4 hotels
        setHotels(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);
  return (
    <main className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900 relative overflow-hidden bg-pattern">
      {/* Advanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 float morph"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-2xl opacity-25 float morph animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-gradient-to-bl from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 float morph animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 float animation-delay-6000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-l from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 float animation-delay-8000"></div>
      </div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-noise pointer-events-none"></div>
      {/* Header */}
      <header className="flex items-center justify-between py-6 px-4 sm:px-6 glass backdrop-blur-xl sticky top-0 z-50 fade-in shadow-luxury">
        <div className="text-3xl font-bold gradient-text text-shadow">FoodsLinkx</div>
        <nav className="hidden md:flex space-x-8 text-gray-700">
          <a href="https://foodslinkx.com/about" className="hover:text-indigo-600 transition-colors duration-300 relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="https://foodslinkx.com/pricing" className="hover:text-indigo-600 transition-colors duration-300 relative group">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="https://blog.foodslinkx.com/" className="hover:text-indigo-600 transition-colors duration-300 relative group">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="https://foodslinkx.com/contact" className="hover:text-indigo-600 transition-colors duration-300 relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </a>
        </nav>
        <div className="hidden md:flex space-x-4 items-center">
          {/* Dark Mode Toggle */}
          <button className="p-3 glass rounded-xl hover:bg-white/20 transition-all duration-300 group">
            <svg className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <Link href="/auth/login" className="flex items-center space-x-2 px-6 py-3 glass rounded-xl hover:bg-white/20 transition-all duration-300 group">
            <span className="group-hover:scale-110 transition-transform duration-300">Login</span>
          </Link>
          <Link href="/auth/login" className="px-6 py-3 btn-gradient text-white rounded-xl font-semibold shadow-luxury hover:shadow-glow transition-all duration-300 transform hover:scale-105 inline-block">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 glass rounded-xl hover:bg-white/20 transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass backdrop-blur-xl mx-4 sm:mx-6 rounded-xl mt-2 p-4 shadow-luxury">
          <nav className="flex flex-col space-y-4 text-gray-700">
            <a href="https://foodslinkx.com/about" className="hover:text-indigo-600 transition-colors duration-300 py-2">
              About Us
            </a>
            <a href="https://foodslinkx.com/pricing" className="hover:text-indigo-600 transition-colors duration-300 py-2">
              Pricing
            </a>
            <a href="https://blog.foodslinkx.com/" className="hover:text-indigo-600 transition-colors duration-300 py-2">
              Blog
            </a>
            <a href="https://foodslinkx.com/contact" className="hover:text-indigo-600 transition-colors duration-300 py-2">
              Contact
            </a>
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
              <Link href="/auth/login" className="block w-full text-center py-2 glass rounded-xl hover:bg-white/20 transition-all duration-300">
                Login
              </Link>
              <Link href="/auth/login" className="w-full py-2 btn-gradient text-white rounded-xl font-semibold inline-block text-center">
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex-grow relative z-10">
        <div className="max-w-xl space-y-6 md:space-y-8 slide-up">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Empower Your <span className="gradient-text">Productivity</span> with Our Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Streamline your workflow, collaborate effortlessly, and grow your business with the tools designed for success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/login" className="px-6 sm:px-8 py-3 sm:py-4 btn-gradient text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg inline-block text-center">
              Get Started Free
            </Link>
            <button className="px-6 sm:px-8 py-3 sm:py-4 glass rounded-xl font-semibold text-base sm:text-lg hover:bg-white/20 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="mt-8 md:mt-0 md:ml-10">
          <img
            src="/Assets/hero.webp"
            alt="Hero Image"
            className="w-full max-w-sm md:max-w-lg h-auto object-cover rounded-lg"
          />
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-16 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto text-center bg-gray-50 rounded-3xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">About Us</h2>
        <p className="max-w-4xl mx-auto text-gray-700 text-lg md:text-xl">
          MyCompany is dedicated to helping professionals and teams maximize their efficiency. Founded by industry experts, we focus on delivering innovative solutions tailored to your needs.
        </p>
      </section>

      {/* Our Partners */}
      {/* Our Partners */}
      <section className="py-12 md:py-20 bg-gray-50 rounded-3xl mx-4 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 md:sm:text-4xl">
              Our Partners
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-500">
              We are proud to partner with some of the best restaurants in the industry.
            </p>
          </div>
          <div className="mt-8 md:mt-12">
            {loading ? (
              <div className="text-center">Loading partners...</div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-4 lg:grid-cols-4">
                {hotels.map((hotel, index) => (
                  <div
                    key={hotel._id}
                    className={`glass rounded-2xl overflow-hidden card-hover bounce-in shadow-depth group cursor-pointer transform transition-all duration-500 hover:shadow-luxury stagger-${(index % 5) + 1}`}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        className="h-32 sm:h-40 md:h-48 w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        src={hotel.image || '/placeholder.svg'}
                        alt={`Image of ${hotel.name}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 relative">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">{hotel.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4">{hotel.address}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300">View Menu</span>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-110">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section id="products" className="hidden md:block glass py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto rounded-3xl">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Product Features</h2>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
          <FeatureCard icon={Users} title="Collaboration" description="Work with your team seamlessly in real-time." />
          <FeatureCard icon={Smile} title="User Friendly" description="Intuitive design for easy adoption and use." />
          <FeatureCard icon={CreditCard} title="Secure Payments" description="Safe and fast payment processing integrated." />
          <FeatureCard icon={BookOpen} title="Comprehensive Docs" description="Complete documentation and API guides." />
          <FeatureCard icon={PhoneCall} title="24/7 Support" description="Our team is here to help anytime you need." />
          <FeatureCard icon={User} title="Personalized" description="Tailored solutions to fit your unique needs." />
        </div>
      </section>

      {/* Pricing
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto bg-gray-100 rounded-lg">
        <h2 className="text-4xl font-bold mb-12 text-center">Pricing Plans</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Basic"
            price="Free"
            features={["Up to 3 Projects", "Basic Support", "Community Access"]}
          />
          <PricingCard
            title="Pro"
            price="$29/mo"
            features={["Unlimited Projects", "Priority Support", "Advanced Analytics"]}
          />
          <PricingCard
            title="Enterprise"
            price="Contact Us"
            features={["Custom Solutions", "Dedicated Support", "Onboarding & Training"]}
          />
        </div>
      </section> */}

      {/* Contact us */}
      {/* <section id="contact" className="py-20 px-6 max-w-7xl mx-auto bg-white rounded-lg">
        <h2 className="text-4xl font-bold mb-8 text-center">Contact Us</h2>
        <form className="max-w-xl mx-auto space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold">Name</label>
            <input id="name" type="text" required className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-semibold">Email</label>
            <input id="email" type="email" required className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="message" className="mb-2 font-semibold">Message</label>
            <textarea id="message" rows={4} required className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
            Send Message
          </button>
        </form>
      </section> */}

      {/* Footer */}
      <footer className="py-6 md:py-8 text-center text-gray-600 border-t border-gray-300 mt-12 md:mt-16 select-none rounded-t-3xl mx-4">
        &copy; 2025 MyCompany. All rights reserved.
      </footer>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
}) {
  return (
    <div className="glass rounded-lg p-4 flex flex-col items-center text-center space-y-3 hover:shadow-md transition">
      <div className="text-blue-600">
        <Icon size={32} />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
}

