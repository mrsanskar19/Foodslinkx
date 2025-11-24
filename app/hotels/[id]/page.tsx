"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import MainLayout from "@/components/layout/MainLayout"
import MenuList from "@/components/hotel/MenuList"
import MenuDetailsModal from "@/components/hotel/MenuDetailsModal"
import HotelNavbar from "@/components/hotel/HotelNavbar"
import { setWithExpiry, getWithExpiry } from "@/lib/utils/localStorageWithExpiry"


interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: any
  available: boolean
  image?: string
}

interface Hotel {
  _id: string
  name: string
}

interface Category {
    _id: string;
    name: string;
}

export default function HotelMenuPage() {
  const params = useParams()
  const hotelId = params.id as string
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const storedTableId = getWithExpiry("tableId")

  useEffect(() => {
    setWithExpiry("hotelId",hotelId,2 * 60 * 60 * 1000)
    const fetchHotelData = async () => {
      if (!hotelId) return;
      try {
        const [hotelRes, menuRes, categoriesRes] = await Promise.all([
          fetch(`/api/hotels/${hotelId}`),
          fetch(`/api/hotels/${hotelId}/menu`),
          fetch(`/api/hotels/${hotelId}/categories`),
        ]);

        if (hotelRes.ok) {
          const data = await hotelRes.json();
          setHotel(data);
        }
        if (menuRes.ok) {
          const data = await menuRes.json();
          setMenu(data.menu || []);
        }
        if (categoriesRes.ok) {
            const data = await categoriesRes.json();
            setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching hotel data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotelData()
  }, [hotelId])

  if (loading) {
    return (
      <MainLayout hotelId={hotelId}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground">Loading menu...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!hotel) {
    return (
      <MainLayout hotelId={hotelId}>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-foreground">Hotel not found</p>
        </div>
      </MainLayout>
    )
  }

  const categoryNames = ["all", ...categories.map((c) => c.name)]

  const categoryNameToIdMap = categories.reduce((acc, category) => {
    acc[category.name] = category._id;
    return acc;
    }, {} as Record<string, string>);


  const filteredMenu = menu.filter((item) => {
    const selectedCategoryId = categoryNameToIdMap[selectedCategory];
    const matchesCategory = selectedCategory === "all" || item.category?._id === selectedCategoryId || item.category === selectedCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <MainLayout hotelId={hotelId}>
      <HotelNavbar hotelName={hotel.name} onSearch={setSearchQuery} />

      <div className="px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors">
        Table No : {storedTableId}
      </div>
      <div className="px-4 py-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4">
          {categoryNames.map((categoryName) => (
            <button
              key={categoryName}
              onClick={() => setSelectedCategory(categoryName)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === categoryName
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <MenuList items={filteredMenu} hotelId={hotelId} />
      </div>

      {/* Menu Details Modal */}
      {selectedMenuItem && (
        <MenuDetailsModal item={selectedMenuItem} onClose={() => setSelectedMenuItem(null)} hotelId={hotelId} />
      )}
    </MainLayout>
  )
}
