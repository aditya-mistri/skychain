"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Plus,
  Shield,
  ShieldAlert,
  QrCode,
  Package,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export function PartsTracking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPart, setSelectedPart] = useState<any>(null)

  const parts = [
    {
      id: 1,
      partNumber: "CFM56-7B24",
      name: "Engine Turbine Blade",
      manufacturer: "CFM International",
      serialNumber: "TB-2024-001",
      aircraft: "N737BA",
      installDate: "2024-01-15",
      status: "authentic",
      location: "Engine Bay 1",
      blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      qrCode: "QR-TB-2024-001",
      nextInspection: "2024-07-15",
    },
    {
      id: 2,
      partNumber: "A320-LG-001",
      name: "Landing Gear Assembly",
      manufacturer: "Safran Landing Systems",
      serialNumber: "LG-2023-456",
      aircraft: "N320AC",
      installDate: "2023-12-10",
      status: "counterfeit",
      location: "Main Landing Gear",
      blockchainHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a",
      qrCode: "QR-LG-2023-456",
      nextInspection: "2024-06-10",
    },
    {
      id: 3,
      partNumber: "E190-AV-789",
      name: "Avionics Control Unit",
      manufacturer: "Honeywell",
      serialNumber: "AV-2024-789",
      aircraft: "N190ER",
      installDate: "2024-01-20",
      status: "authentic",
      location: "Cockpit Panel",
      blockchainHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
      qrCode: "QR-AV-2024-789",
      nextInspection: "2024-12-20",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "authentic":
        return "bg-green-100 text-green-800"
      case "counterfeit":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "authentic":
        return <Shield className="h-4 w-4" />
      case "counterfeit":
        return <ShieldAlert className="h-4 w-4" />
      case "pending":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredParts = parts.filter(
    (part) =>
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (selectedPart) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedPart(null)}>
            ← Back to Parts
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{selectedPart.name}</h1>
            <p className="text-gray-600">{selectedPart.partNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Part Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Part Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Part Number</label>
                  <p className="text-lg font-semibold">{selectedPart.partNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Serial Number</label>
                  <p className="text-lg font-semibold">{selectedPart.serialNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Manufacturer</label>
                  <p className="text-lg font-semibold">{selectedPart.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Aircraft</label>
                  <p className="text-lg font-semibold">{selectedPart.aircraft}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Install Date</label>
                  <p className="text-lg font-semibold">{selectedPart.installDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-lg font-semibold">{selectedPart.location}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-gray-600">Blockchain Hash</label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {selectedPart.blockchainHash}
                </p>
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-gray-600">QR Code</label>
                <div className="mt-2 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">{selectedPart.qrCode}</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Download QR Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Verification */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authenticity Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedPart.status)}
                    <Badge className={getStatusColor(selectedPart.status)}>{selectedPart.status.toUpperCase()}</Badge>
                  </div>

                  {selectedPart.status === "authentic" && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Verified Authentic</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        This part has been verified through blockchain authentication
                      </p>
                    </div>
                  )}

                  {selectedPart.status === "counterfeit" && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Counterfeit Detected</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        This part failed blockchain verification. Immediate action required.
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600">Next Inspection</p>
                    <p className="font-semibold">{selectedPart.nextInspection}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#003366] hover:bg-[#003366]/90">
                  <Shield className="mr-2 h-4 w-4" />
                  Re-verify Authenticity
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Inspection
                </Button>
                <Button variant="outline" className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Print QR Code
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lifecycle Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Part Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: "2024-01-15",
                  event: "Part Installed",
                  details: "Installed on N737BA by John Smith",
                  status: "completed",
                },
                {
                  date: "2024-01-10",
                  event: "Quality Verification",
                  details: "Blockchain verification completed",
                  status: "completed",
                },
                {
                  date: "2024-01-05",
                  event: "Part Registered",
                  details: "Added to SkyChain database",
                  status: "completed",
                },
                {
                  date: "2023-12-20",
                  event: "Manufacturing Complete",
                  details: "Manufactured by CFM International",
                  status: "completed",
                },
              ].map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-[#FF6B35] rounded-full"></div>
                    {index < 3 && <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{event.event}</p>
                      <Badge className="bg-green-100 text-green-800">{event.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{event.details}</p>
                    <p className="text-xs text-gray-400">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parts Tracking</h1>
          <p className="text-gray-600">Track and verify aircraft parts authenticity</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#003366] hover:bg-[#003366]/90">
            <Plus className="mr-2 h-4 w-4" />
            Register Part
          </Button>
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            Scan QR Code
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by part number, serial number, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => (
          <Card key={part.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{part.name}</CardTitle>
                  <p className="text-gray-600">{part.partNumber}</p>
                </div>
                <Badge className={getStatusColor(part.status)}>
                  {getStatusIcon(part.status)}
                  <span className="ml-1">{part.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Serial Number</p>
                    <p className="font-semibold">{part.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Aircraft</p>
                    <p className="font-semibold">{part.aircraft}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Manufacturer</p>
                  <p className="font-semibold">{part.manufacturer}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Install Date</p>
                  <p className="font-semibold">{part.installDate}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#003366] hover:bg-[#003366]/90"
                    onClick={() => setSelectedPart(part)}
                  >
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Authenticity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Authentic Parts</p>
                <p className="text-3xl font-bold text-green-600">2,847</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Counterfeit Detected</p>
                <p className="text-3xl font-bold text-red-600">12</p>
              </div>
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verification Rate</p>
                <p className="text-3xl font-bold text-blue-600">99.6%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
