import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download,
} from "lucide-react"

export function Analytics() {
  const kpiData = [
    {
      title: "Maintenance Cost Reduction",
      value: "80%",
      change: "+12%",
      trend: "up",
      description: "Compared to traditional methods",
    },
    {
      title: "Annual Savings per Aircraft",
      value: "$2.1M",
      change: "+8%",
      trend: "up",
      description: "Average across fleet",
    },
    {
      title: "Compliance Audit Speed",
      value: "95%",
      change: "+25%",
      trend: "up",
      description: "Faster than manual audits",
    },
    {
      title: "Counterfeit Parts Detected",
      value: "0",
      change: "100%",
      trend: "up",
      description: "Zero counterfeit parts in verified supply chain",
    },
  ]

  const monthlyData = [
    { month: "Jan", incidents: 2, savings: 180000, compliance: 98 },
    { month: "Feb", incidents: 1, savings: 220000, compliance: 99 },
    { month: "Mar", incidents: 0, savings: 250000, compliance: 100 },
    { month: "Apr", incidents: 1, savings: 210000, compliance: 98 },
    { month: "May", incidents: 0, savings: 280000, compliance: 100 },
    { month: "Jun", incidents: 0, savings: 300000, compliance: 100 },
  ]

  const fleetMetrics = [
    { aircraft: "Boeing 737", count: 89, compliance: 98, avgSavings: 2100000 },
    { aircraft: "Airbus A320", count: 76, compliance: 99, avgSavings: 1950000 },
    { aircraft: "Embraer 190", count: 45, compliance: 97, avgSavings: 1800000 },
    { aircraft: "Boeing 777", count: 37, compliance: 100, avgSavings: 2800000 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & ROI</h1>
          <p className="text-gray-600">Performance metrics and return on investment</p>
        </div>
        <Button className="bg-[#003366] hover:bg-[#003366]/90">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                <Badge className={kpi.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {kpi.change}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Avg Incidents</p>
                  <p className="text-2xl font-bold text-red-600">0.7</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Savings</p>
                  <p className="text-2xl font-bold text-green-600">$240K</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Compliance</p>
                  <p className="text-2xl font-bold text-blue-600">99%</p>
                </div>
              </div>

              <div className="space-y-3">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium w-8">{data.month}</span>
                      <div className="flex items-center gap-2">
                        {data.incidents === 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">{data.incidents} incidents</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-medium">${(data.savings / 1000).toFixed(0)}K saved</span>
                      <span className="text-blue-600 font-medium">{data.compliance}% compliant</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>ROI Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Traditional Costs</p>
                  <p className="text-2xl font-bold text-blue-900">$12.5M</p>
                  <p className="text-xs text-blue-700">Annual maintenance costs</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">SkyChain Costs</p>
                  <p className="text-2xl font-bold text-green-900">$2.5M</p>
                  <p className="text-xs text-green-700">With blockchain optimization</p>
                </div>
              </div>

              <div className="p-4 bg-[#FF6B35]/10 rounded-lg border border-[#FF6B35]/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-[#FF6B35]" />
                  <p className="font-semibold text-[#FF6B35]">Total Annual Savings</p>
                </div>
                <p className="text-3xl font-bold text-[#FF6B35]">$10.0M</p>
                <p className="text-sm text-gray-600">80% cost reduction</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Maintenance Error Reduction</span>
                  <span className="font-medium">$4.2M saved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Faster Compliance Audits</span>
                  <span className="font-medium">$2.1M saved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Counterfeit Part Prevention</span>
                  <span className="font-medium">$1.8M saved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Insurance Premium Reduction</span>
                  <span className="font-medium">$1.2M saved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Regulatory Fine Avoidance</span>
                  <span className="font-medium">$700K saved</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Performance by Aircraft Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fleetMetrics.map((fleet, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{fleet.aircraft}</p>
                    <p className="text-sm text-gray-600">{fleet.count} aircraft</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Compliance</p>
                    <div className="flex items-center gap-1">
                      <p className="font-bold">{fleet.compliance}%</p>
                      {fleet.compliance >= 99 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg Savings</p>
                    <p className="font-bold">${(fleet.avgSavings / 1000000).toFixed(1)}M</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Network Stats */}
      <Card className="bg-gradient-to-r from-[#003366] to-blue-700 text-white">
        <CardHeader>
          <CardTitle className="text-white">Blockchain Network Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <p className="text-2xl font-bold">99.99%</p>
              <p className="text-sm text-blue-200">Network Uptime</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <p className="text-2xl font-bold">2.3s</p>
              <p className="text-sm text-blue-200">Avg Transaction Time</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <p className="text-2xl font-bold">1,247,392</p>
              <p className="text-sm text-blue-200">Total Transactions</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <p className="text-2xl font-bold">156.7 TH/s</p>
              <p className="text-sm text-blue-200">Network Hash Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
