"use client"

import { useState } from "react"
import MenuDetailsModal from "./MenuDetailsModal"

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: any
  available: boolean
  image?: string
}

interface MenuListProps {
  items: MenuItem[]
  hotelId:string
}

const MenuList = ({ items,hotelId }: MenuListProps) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-1">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => item.available && handleSelectItem(item)}
            className={`
              group relative aspect-square w-full overflow-hidden rounded-xl shadow-md transition-all duration-300
              ${
                item.available
                  ? "cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                  : "cursor-not-allowed"
              }
            `}
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
              <h3 className="font-bold text-lg drop-shadow-md">{item.name}</h3>
              <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-extrabold drop-shadow-lg">
                  ₹{item.price}
                </p>
              </div>
            </div>

            {/* Unavailable State */}
            {!item.available && (
              <div className="absolute inset-0 bg-gray-500/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-destructive text-destructive-foreground font-semibold py-1 px-4 rounded-full text-sm">
                  Unavailable
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <MenuDetailsModal
          item={selectedItem}
          onClose={handleCloseModal}
          hotelId={hotelId}
        />
      )}
    </>
  )
}

export default MenuList
