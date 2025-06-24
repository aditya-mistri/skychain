"use client"

import { Plane, Settings, Users, BarChart3, Shield, Home, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "aircraft", label: "Aircraft", icon: Plane },
    { id: "parts", label: "Parts", icon: Package },
    { id: "maintenance", label: "Maintenance", icon: Settings },
    { id: "mechanics", label: "Mechanics", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#003366] text-white shadow-lg">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-[#FF6B35]" />
          <div>
            <h1 className="text-xl font-bold">SkyChain</h1>
            <p className="text-sm text-blue-200">Blockchain Aviation</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${
                  activeView === item.id
                    ? "bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90"
                    : "text-blue-100 hover:bg-blue-800 hover:text-white"
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-blue-800 rounded-lg p-3">
          <div className="text-xs text-blue-200 mb-1">Blockchain Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Network Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
