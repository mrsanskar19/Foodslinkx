"use client"

import type { ReactNode } from "react"
import ResponsiveNav from "./ResponsiveNav"
import OrderStack from "./OrderStack"
import { useMediaQuery } from "@/hooks/use-mobile"

interface MainLayoutProps {
  children: ReactNode
  hotelId: string
}

/**
 * Renders the main layout for the application, which includes a responsive navigation bar and the primary content area.
 * - Adapts the layout based on the screen size, moving the navigation to the bottom on mobile devices.
 * - Provides a consistent structure for all pages in the application.
 *
 * @param {MainLayoutProps} props - The props for the MainLayout component.
 * @param {ReactNode} props.children - The child components to be rendered within the main content area.
 * @param {string} props.hotelId - The ID of the hotel, used for navigation and data fetching.
 * @returns {JSX.Element} The rendered main layout component.
 */
export default function MainLayout({ children, hotelId }: MainLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className={`flex min-h-screen bg-background ${!isMobile ? "md:ml-64" : ""}`}>
      <ResponsiveNav hotelId={hotelId} />
      <main className={`flex-1 ${isMobile ? "pb-20" : ""}`}>{children}</main>
      {/* <OrderStack /> */}
    </div>
  )
}
