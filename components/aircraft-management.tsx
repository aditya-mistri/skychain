"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Eye, QrCode, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function AircraftManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAircraft, setSelectedAircraft] = useState<any>(null)

  const aircraft = [
    {
      id: 1,
      registration: "N737BA",
      model: "Boeing 737-800",
      manufacturer: "Boeing",
      yearBuilt: 2018,
      flightHours: 12450,
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-02-15",
      status: "compliant",
      location: "LAX",
      blockchainHash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
    },
    {
      id: 2,
      registration: "N320AC",
      model: "Airbus A320",
      manufacturer: "Airbus",
      yearBuilt: 2020,
      flightHours: 8750,
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-01-25",
      status: "alert",
      location: "JFK",
      blockchainHash: "0x8a0fade2d1e68b8bg77bc5fbe8a0fade2d1e68b8bg77bc5fbe8d3d3fc8c22b02496",
    },
    {
      id: 3,
      registration: "N190ER",
      model: "Embraer 190",
      manufacturer: "Embraer",
      yearBuilt: 2019,
      flightHours: 9200,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-03-10",
      status: "overdue",
      location: "ORD",
      blockchainHash: "0x9b1gade3e2f79c9ch88cd6gcf9b1gade3e2f79c9ch88cd6gcf9e4e4gd9d33c13507",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800"
      case "alert":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4" />
      case "alert":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredAircraft = aircraft.filter(
    (plane) =>
      plane.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plane.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (selectedAircraft) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedAircraft(null)}>
            ← Back to Fleet
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{selectedAircraft.registration}</h1>
            <p className="text-gray-600">{selectedAircraft.model}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Aircraft Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Aircraft Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Registration</label>
                  <p className="text-lg font-semibold">{selectedAircraft.registration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Model</label>
                  <p className="text-lg font-semibold">{selectedAircraft.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Manufacturer</label>
                  <p className="text-lg font-semibold">{selectedAircraft.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Year Built</label>
                  <p className="text-lg font-semibold">{selectedAircraft.yearBuilt}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Flight Hours</label>
                  <p className="text-lg font-semibold">{selectedAircraft.flightHours.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Location</label>
                  <p className="text-lg font-semibold">{selectedAircraft.location}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-gray-600">Blockchain Hash</label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {selectedAircraft.blockchainHash}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedAircraft.status)}
                    <Badge className={getStatusColor(selectedAircraft.status)}>
                      {selectedAircraft.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Maintenance</p>
                    <p className="font-semibold">{selectedAircraft.lastMaintenance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Maintenance</p>
                    <p className="font-semibold">{selectedAircraft.nextMaintenance}</p>
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
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline" className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Maintenance History */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: "2024-01-15",
                  type: "Scheduled Inspection",
                  mechanic: "John Smith",
                  status: "Completed",
                  hash: "0x1a2b3c...",
                },
                {
                  date: "2023-12-10",
                  type: "Engine Service",
                  mechanic: "Sarah Johnson",
                  status: "Completed",
                  hash: "0x4d5e6f...",
                },
                {
                  date: "2023-11-05",
                  type: "Landing Gear Check",
                  mechanic: "Mike Wilson",
                  status: "Completed",
                  hash: "0x7g8h9i...",
                },
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{record.type}</p>
                    <p className="text-sm text-gray-600">
                      by {record.mechanic} on {record.date}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">{record.hash}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{record.status}</Badge>
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
          <h1 className="text-3xl font-bold text-gray-900">Aircraft Management</h1>
          <p className="text-gray-600">Manage your fleet and track maintenance status</p>
        </div>
        <Button className="bg-[#003366] hover:bg-[#003366]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Aircraft
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by registration or model..."
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

      {/* Aircraft Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAircraft.map((plane) => (
          <Card key={plane.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plane.registration}</CardTitle>
                  <p className="text-gray-600">{plane.model}</p>
                </div>
                <Badge className={getStatusColor(plane.status)}>
                  {getStatusIcon(plane.status)}
                  <span className="ml-1">{plane.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Flight Hours</p>
                    <p className="font-semibold">{plane.flightHours.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-semibold">{plane.location}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Next Maintenance</p>
                  <p className="font-semibold">{plane.nextMaintenance}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#003366] hover:bg-[#003366]/90"
                    onClick={() => setSelectedAircraft(plane)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
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
    </div>
  )
}
