"use client"

import { useParams } from "next/navigation"
import type { ReactNode } from "react"

import {DashboardLayout,Navbar} from '@/components/dashboard/Layout'


interface LayoutProps {
  children: ReactNode
}
const Layout = ({ children}: LayoutProps) => {
   const params = useParams()
    const hotelId = params.id as string
  return (
    <div className="min-h-screen md:flex">
    {/* Sidebar */}
    <aside className="w-64 bg-white border-r border-gray-200">
      <DashboardLayout hotelId={hotelId} />
    </aside>
  
    {/* Main Area */}
    <div className="flex-1 flex flex-col">
      {/* Navbar (starts after sidebar) */}
      <Navbar hotelName="FoodsLinkX" hotelId={hotelId} />
  
      {/* Page Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  </div>
  
  )
}

export default Layout
