"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Award, Star, CheckCircle, Search, Filter, Plus } from "lucide-react"

export function MechanicDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null)

  const mechanics = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@skychain.com",
      certifications: ["A&P License", "IA Certificate", "Boeing 737 Type"],
      rating: 4.8,
      tasksCompleted: 247,
      tasksInProgress: 3,
      specialties: ["Engine Maintenance", "Avionics", "Structural Repair"],
      joinDate: "2020-03-15",
      lastActive: "2024-01-24 14:30",
      reputationScore: 950,
      blockchainSignatures: 247,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@skychain.com",
      certifications: ["A&P License", "Airbus A320 Type", "Composite Repair"],
      rating: 4.9,
      tasksCompleted: 189,
      tasksInProgress: 2,
      specialties: ["Hydraulic Systems", "Landing Gear", "Composite Materials"],
      joinDate: "2019-08-22",
      lastActive: "2024-01-24 16:45",
      reputationScore: 1020,
      blockchainSignatures: 189,
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@skychain.com",
      certifications: ["A&P License", "Embraer Type", "NDT Level II"],
      rating: 4.7,
      tasksCompleted: 156,
      tasksInProgress: 1,
      specialties: ["Non-Destructive Testing", "Electrical Systems", "Fuel Systems"],
      joinDate: "2021-01-10",
      lastActive: "2024-01-24 12:15",
      reputationScore: 875,
      blockchainSignatures: 156,
    },
  ]

  const filteredMechanics = mechanics.filter(
    (mechanic) =>
      mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (selectedMechanic) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedMechanic(null)}>
            ← Back to Mechanics
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/placeholder-user.jpg`} />
              <AvatarFallback>
                {selectedMechanic.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedMechanic.name}</h1>
              <p className="text-gray-600">{selectedMechanic.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mechanic Profile */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Join Date</label>
                  <p className="text-lg font-semibold">{selectedMechanic.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Active</label>
                  <p className="text-lg font-semibold">{selectedMechanic.lastActive}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rating</label>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{selectedMechanic.rating}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reputation Score</label>
                  <p className="text-lg font-semibold">{selectedMechanic.reputationScore}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {selectedMechanic.certifications.map((cert: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      <Award className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {selectedMechanic.specialties.map((specialty: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Blockchain Signatures</h3>
                <p className="text-sm text-gray-600 mb-3">
                  All maintenance work is cryptographically signed and recorded on the blockchain
                </p>
                <div className="space-y-2">
                  {[
                    { date: "2024-01-24", task: "Engine Inspection - N737BA", hash: "0x1a2b3c..." },
                    { date: "2024-01-23", task: "Hydraulic Service - N320AC", hash: "0x4d5e6f..." },
                    { date: "2024-01-22", task: "Avionics Check - N190ER", hash: "0x7g8h9i..." },
                  ].map((signature, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{signature.task}</p>
                          <p className="text-sm text-gray-600">{signature.date}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 font-mono mt-1">{signature.hash}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasks Completed</span>
                  <span className="font-bold text-2xl">{selectedMechanic.tasksCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasks In Progress</span>
                  <span className="font-bold text-2xl">{selectedMechanic.tasksInProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blockchain Signatures</span>
                  <span className="font-bold text-2xl">{selectedMechanic.blockchainSignatures}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-xl">{selectedMechanic.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Work Quality</span>
                    <span>96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "96%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>On-Time Completion</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "94%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Rate</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#003366] hover:bg-[#003366]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Task
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
                <Button variant="outline" className="w-full">
                  <Award className="mr-2 h-4 w-4" />
                  Update Certifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mechanic Dashboard</h1>
          <p className="text-gray-600">Manage mechanic profiles and track performance</p>
        </div>
        <Button className="bg-[#003366] hover:bg-[#003366]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Mechanic
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or specialty..."
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

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMechanics.map((mechanic) => (
          <Card key={mechanic.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/placeholder-user.jpg`} />
                  <AvatarFallback>
                    {mechanic.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{mechanic.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{mechanic.rating}</span>
                    <span className="text-sm text-gray-500">({mechanic.tasksCompleted} tasks)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Completed</p>
                    <p className="font-semibold">{mechanic.tasksCompleted}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">In Progress</p>
                    <p className="font-semibold">{mechanic.tasksInProgress}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {mechanic.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {mechanic.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{mechanic.specialties.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Reputation Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#FF6B35] h-2 rounded-full"
                        style={{ width: `${(mechanic.reputationScore / 1000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{mechanic.reputationScore}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#003366] hover:bg-[#003366]/90"
                  onClick={() => setSelectedMechanic(mechanic)}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mechanics</p>
                <p className="text-3xl font-bold text-gray-900">47</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Today</p>
                <p className="text-3xl font-bold text-green-600">32</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-600">4.8</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certifications</p>
                <p className="text-3xl font-bold text-purple-600">156</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
