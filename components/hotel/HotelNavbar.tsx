"use client"

import { useState } from "react"
import { Search } from "lucide-react"

interface HotelNavbarProps {
  hotelName: string
  onSearch: (query: string) => void
}

export default function HotelNavbar({ hotelName, onSearch }: HotelNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 glass text-primary-foreground">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold truncate bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">{hotelName}</h1>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-primary/80 rounded-lg transition-colors"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search menu..."
              onChange={(e) => onSearch(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-primary-foreground text-foreground placeholder-muted-foreground focus:outline-none"
            />
          </div>
        )}
      </div>
    </nav>
  )
}
