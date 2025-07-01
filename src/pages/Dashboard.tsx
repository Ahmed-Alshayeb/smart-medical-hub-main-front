import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, Hospital, FlaskConical, DollarSign, User, FileText, Calendar, Settings, UserCog, ClipboardList, UserCheck, UserPlus, ActivitySquare, File, MessageSquare } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Bar, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts";
import Layout from "@/components/Layout";
import PageLayout, { StatsSection, TableSection } from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, isAdmin, permissions } = useAuth();

  const handleRefresh = () => {
    // Refresh dashboard data
    console.log("Refreshing dashboard...");
  };

  const handleExport = () => {
    // Export dashboard data
    console.log("Exporting dashboard data...");
  };

  const sections = [
    {
      id: "stats",
      title: "Statistics Overview",
      visible: true,
      component: <StatsSection stats={[]} columns={4} />
    },
    {
      id: "charts",
      title: "Analytics Charts",
      visible: true,
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Revenue Overview */}
          <Card className="shadow-lg bg-white/90 dark:bg-gray-900/90 animate-fade-in w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-600" /> 
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Daily Visits */}
          <Card className="shadow-lg bg-white/90 dark:bg-gray-900/90 animate-fade-in w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-green-600" /> 
                Daily Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={[]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "activities",
      title: "Recent Activities",
      visible: true,
      component: (
        <TableSection title="Recent Activities">
          <div className="space-y-4">
            {[]}
          </div>
        </TableSection>
      )
    }
  ];

  return (
    <Layout>
      <PageLayout
        title="Dashboard"
        subtitle="Overview of your medical care system"
        sections={sections}
        showSearch={false}
        showFilters={false}
        showActions={true}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold mb-2">Your Permissions</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {permissions && permissions.length > 0 ? permissions.map((perm) => (
            <span key={perm} className="px-3 py-1 rounded-full bg-muted text-foreground text-sm">{perm}</span>
          )) : (
            <span className="text-destructive">No special permissions assigned.</span>
          )}
        </div>
        {!isAdmin && (!permissions || permissions.length === 0) && (
          <div className="text-destructive text-sm">You may not have access to some features. Please contact an administrator if you need more access.</div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard; 