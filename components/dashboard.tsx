import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, AlertTriangle, CheckCircle, Clock, Plus, QrCode, Calendar, TrendingUp, Package } from "lucide-react"

export function Dashboard() {
  const metrics = [
    { title: "Total Aircraft", value: "247", icon: Plane, color: "text-blue-600" },
    { title: "Active Alerts", value: "12", icon: AlertTriangle, color: "text-red-600" },
    { title: "Compliant Aircraft", value: "235", icon: CheckCircle, color: "text-green-600" },
    { title: "Pending Maintenance", value: "18", icon: Clock, color: "text-orange-600" },
  ]

  const alerts = [
    { id: 1, aircraft: "N737BA", type: "Overdue Maintenance", severity: "high", time: "2 hours ago" },
    { id: 2, aircraft: "N320AC", type: "Counterfeit Part Detected", severity: "critical", time: "4 hours ago" },
    { id: 3, aircraft: "N190ER", type: "Compliance Violation", severity: "medium", time: "6 hours ago" },
    { id: 4, aircraft: "N777WA", type: "Scheduled Maintenance Due", severity: "low", time: "1 day ago" },
  ]

  const recentActivity = [
    { id: 1, action: "Maintenance completed on N737BA", mechanic: "John Smith", time: "30 min ago" },
    { id: 2, action: "New part registered: Engine Turbine Blade", mechanic: "System", time: "1 hour ago" },
    { id: 3, action: "Compliance check passed for N320AC", mechanic: "Sarah Johnson", time: "2 hours ago" },
    { id: 4, action: "QR code generated for Landing Gear Assembly", mechanic: "Mike Wilson", time: "3 hours ago" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Aircraft maintenance overview and alerts</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#003366] hover:bg-[#003366]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Aircraft
          </Button>
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            Scan QR Code
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Real-time Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.aircraft}</span>
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{alert.type}</p>
                    <p className="text-xs text-gray-400">{alert.time}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">by {activity.mechanic}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="h-6 w-6" />
              Register Parts
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Status */}
      <Card className="bg-gradient-to-r from-[#003366] to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Blockchain Network Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-200">Block Height</p>
                  <p className="font-bold">2,847,392</p>
                </div>
                <div>
                  <p className="text-blue-200">Hash Rate</p>
                  <p className="font-bold">156.7 TH/s</p>
                </div>
                <div>
                  <p className="text-blue-200">Transactions</p>
                  <p className="font-bold">1,247</p>
                </div>
                <div>
                  <p className="text-blue-200">Gas Price</p>
                  <p className="font-bold">21 gwei</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>Network Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
