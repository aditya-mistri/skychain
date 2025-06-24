"use client"

import { SidebarProvider } from "@/components/ui/sidebar"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Dashboard } from "@/components/dashboard"
import { AircraftManagement } from "@/components/aircraft-management"
import { PartsTracking } from "@/components/parts-tracking"
import { MaintenanceManagement } from "@/components/maintenance-management"
import { MechanicDashboard } from "@/components/mechanic-dashboard"
import { Analytics } from "@/components/analytics"

export default function SkyChainApp() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />
      case "aircraft":
        return <AircraftManagement />
      case "parts":
        return <PartsTracking />
      case "maintenance":
        return <MaintenanceManagement />
      case "mechanics":
        return <MechanicDashboard />
      case "analytics":
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 ml-64">
          <div className="p-6">{renderActiveView()}</div>
        </main>
      </SidebarProvider>
    </div>
  )
}
