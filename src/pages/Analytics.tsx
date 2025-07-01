import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Activity, 
  RefreshCw, 
  Download, 
  HeartPulse, 
  UserCheck, 
  UserPlus, 
  Server, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  Clock,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import {
  ChartContainer,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

const Analytics = () => {
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("month");

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info("Analytics data refreshed");
    }, 1500);
  };

  const handleExport = () => {
    const rows = [
      ["Project KPIs"],
      ["Label", "Value"],
      ...projectStats.map(s => [s.label, s.value]),
      [],
      ["Departments"],
      ["Name", "Patients", "Revenue", "Satisfaction"],
      ...departmentStats.map(d => [d.name, d.patients, d.revenue, d.satisfaction]),
      [],
      ["Doctors"],
      ["Name", "Department", "Appointments", "Rating", "Completion"],
      ...doctorPerformance.map(doc => [doc.name, doc.department, doc.appointments, doc.rating, doc.completion]),
      [],
      ["Trends"],
      ["Month", "Count", "Previous"],
      ...appointmentTrends.map(t => [t.month, t.count, t.prev]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `analytics-export-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("Analytics data exported as CSV");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600";
      case "good": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BarChart2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive insights into patient care, appointments, and performance metrics
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
              <Button
                variant={timeRange === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("week")}
              >
                Week
              </Button>
              <Button
                variant={timeRange === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("month")}
              >
                Month
              </Button>
              <Button
                variant={timeRange === "quarter" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("quarter")}
              >
                Quarter
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((stat) => (
            <Card key={stat.label} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30">
              Overview
            </TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30">
              Departments
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30">
              Performance
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Appointment Trends Chart */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Appointment Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={appointmentTrends}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3B82F6" 
                          fillOpacity={1} 
                          fill="url(#colorCount)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Department Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* System Health */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-600" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealth.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${getStatusColor(item.status)}`}>
                            {item.value}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((act, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(act.priority).replace('bg-', '').replace('text-', 'bg-')}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {act.action}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {act.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Doctors */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-red-600" />
                    Top Doctors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topDoctors.map((doc, index) => (
                      <div key={doc.name} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                          {doc.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {doc.department}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {doc.appointments}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ⭐ {doc.rating}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Statistics Table */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Department Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Department</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Patients</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Revenue (EGP)</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Satisfaction</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentStats.map((dept) => (
                        <tr key={dept.name} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{dept.name}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{dept.patients.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{dept.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Progress value={dept.satisfaction} className="w-20 h-2" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{dept.satisfaction}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={dept.growth > 10 ? "default" : "secondary"} className="text-xs">
                              +{dept.growth}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-8">
            {/* Department Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentStats.map((dept) => (
                <Card key={dept.name} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Patients</span>
                      <span className="font-bold text-gray-900 dark:text-white">{dept.patients.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                      <span className="font-bold text-gray-900 dark:text-white">{dept.revenue.toLocaleString()} EGP</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</span>
                        <span className="font-bold text-gray-900 dark:text-white">{dept.satisfaction}%</span>
                      </div>
                      <Progress value={dept.satisfaction} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Growth</span>
                      <Badge variant={dept.growth > 10 ? "default" : "secondary"}>
                        +{dept.growth}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-8">
            {/* Doctor Performance Chart */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-red-600" />
                  Doctor Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={doctorPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Performance Table */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  Doctor Performance Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Doctor</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Department</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Appointments</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Patients</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Rating</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorPerformance.map((doc) => (
                        <tr key={doc.name} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{doc.name}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{doc.department}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{doc.appointments}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{doc.patients}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="font-medium text-gray-900 dark:text-white">{doc.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Progress value={doc.completion} className="w-20 h-2" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{doc.completion}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-8">
            {/* Revenue Trends Chart */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={appointmentTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 2, fill: "#fff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Chart */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-purple-600" />
                  Appointment Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Current" />
                      <Bar dataKey="prev" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Previous" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics; 