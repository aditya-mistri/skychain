"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, User, Wrench, CheckCircle, AlertTriangle, Plus, Search, Filter } from "lucide-react"

export function MaintenanceManagement() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const maintenanceTasks = [
    {
      id: 1,
      aircraft: "N737BA",
      type: "Scheduled Inspection",
      description: "100-hour inspection required",
      dueDate: "2024-02-15",
      priority: "high",
      status: "pending",
      assignedTo: "John Smith",
      estimatedHours: 8,
      workOrder: "WO-2024-001",
    },
    {
      id: 2,
      aircraft: "N320AC",
      type: "Engine Service",
      description: "Engine oil change and filter replacement",
      dueDate: "2024-01-25",
      priority: "critical",
      status: "overdue",
      assignedTo: "Sarah Johnson",
      estimatedHours: 4,
      workOrder: "WO-2024-002",
    },
    {
      id: 3,
      aircraft: "N190ER",
      type: "Avionics Check",
      description: "Navigation system calibration",
      dueDate: "2024-03-10",
      priority: "medium",
      status: "scheduled",
      assignedTo: "Mike Wilson",
      estimatedHours: 6,
      workOrder: "WO-2024-003",
    },
    {
      id: 4,
      aircraft: "N777WA",
      type: "Landing Gear Service",
      description: "Hydraulic system inspection",
      dueDate: "2024-02-20",
      priority: "high",
      status: "in-progress",
      assignedTo: "John Smith",
      estimatedHours: 12,
      workOrder: "WO-2024-004",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredTasks = maintenanceTasks.filter(
    (task) =>
      task.aircraft.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (selectedTask) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedTask(null)}>
            ← Back to Tasks
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{selectedTask.workOrder}</h1>
            <p className="text-gray-600">
              {selectedTask.type} - {selectedTask.aircraft}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Work Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Work Order</label>
                  <p className="text-lg font-semibold">{selectedTask.workOrder}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Aircraft</label>
                  <p className="text-lg font-semibold">{selectedTask.aircraft}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-lg font-semibold">{selectedTask.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p className="text-lg font-semibold">{selectedTask.dueDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned To</label>
                  <p className="text-lg font-semibold">{selectedTask.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estimated Hours</label>
                  <p className="text-lg font-semibold">{selectedTask.estimatedHours}h</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">{selectedTask.description}</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Maintenance Checklist</h3>
                <div className="space-y-2">
                  {[
                    { task: "Visual inspection of components", completed: true },
                    { task: "Check fluid levels", completed: true },
                    { task: "Test system functionality", completed: false },
                    { task: "Replace worn parts", completed: false },
                    { task: "Final inspection and sign-off", completed: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input type="checkbox" checked={item.completed} className="rounded" readOnly />
                      <span className={item.completed ? "line-through text-gray-500" : ""}>{item.task}</span>
                    </div>
                  ))}
                </div>
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
                    {getStatusIcon(selectedTask.status)}
                    <Badge className={getStatusColor(selectedTask.status)}>{selectedTask.status.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(selectedTask.priority)}>
                      {selectedTask.priority.toUpperCase()} PRIORITY
                    </Badge>
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
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Reassign Task
                </Button>
                <Button variant="outline" className="w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Reschedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">FAA Compliance</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Passed
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EASA Compliance</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Passed
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manufacturer Spec</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="text-gray-600">Schedule and track aircraft maintenance tasks</p>
        </div>
        <Button className="bg-[#003366] hover:bg-[#003366]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Work Order
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by aircraft, task type, or mechanic..."
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{task.workOrder}</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Aircraft</p>
                        <p className="font-semibold">{task.aircraft}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-semibold">{task.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-semibold">{task.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Assigned To</p>
                        <p className="font-semibold">{task.assignedTo}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mt-2">{task.description}</p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      className="bg-[#003366] hover:bg-[#003366]/90"
                      onClick={() => setSelectedTask(task)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">247</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600">12</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">18</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">217</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
