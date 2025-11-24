"use client"

import Link from "next/link"
import { Home, ShoppingCart, ClipboardList, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"

interface BottomNavProps {
  hotelId: string
}

export default function BottomNav({ hotelId }: BottomNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname.includes(path)

  const navItems = [
    { icon: Home, label: "Menu", path: `/hotels/${hotelId}` },
    { icon: ShoppingCart, label: "Cart", path: `/hotels/${hotelId}/cart` },
    { icon: ClipboardList, label: "Orders", path: `/hotels/${hotelId}/orders` },
    { icon: MessageSquare, label: "Feedback", path: `/hotels/${hotelId}/feedback` },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
