import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Activity,
  Calendar,
  MapPin,
  Star
} from "lucide-react";

export default function Analytics() {
  const monthlyRevenue = [
    { month: "Jan", revenue: 12400, orders: 145 },
    { month: "Feb", revenue: 15600, orders: 180 },
    { month: "Mar", revenue: 18200, orders: 210 },
    { month: "Apr", revenue: 22100, orders: 255 },
    { month: "May", revenue: 25800, orders: 290 },
    { month: "Jun", revenue: 28900, orders: 325 }
  ];

  const userGrowth = [
    { month: "Jan", farmers: 45, consumers: 120 },
    { month: "Feb", farmers: 52, consumers: 140 },
    { month: "Mar", farmers: 61, consumers: 165 },
    { month: "Apr", farmers: 68, consumers: 195 },
    { month: "May", farmers: 75, consumers: 220 },
    { month: "Jun", farmers: 84, consumers: 250 }
  ];

  const categoryData = [
    { name: "Vegetables", value: 45, color: "#10b981" },
    { name: "Fruits", value: 30, color: "#f59e0b" },
    { name: "Grains", value: 15, color: "#8b5cf6" },
    { name: "Herbs", value: 10, color: "#06b6d4" }
  ];

  const topFarmers = [
    { name: "Green Valley Farm", revenue: 5240, orders: 45, rating: 4.9 },
    { name: "Sunny Acres", revenue: 4890, orders: 42, rating: 4.8 },
    { name: "Riverside Gardens", revenue: 4320, orders: 38, rating: 4.7 },
    { name: "Mountain View", revenue: 3980, orders: 35, rating: 4.6 },
    { name: "Prairie Gold", revenue: 3750, orders: 32, rating: 4.8 }
  ];

  return (
    <AdminLayout currentPage="Analytics">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Platform Analytics 📊</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into platform performance and user behavior
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">$123,400</p>
                    <p className="text-xs text-primary">+12.5% from last month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">1,405</p>
                    <p className="text-xs text-primary">+8.2% from last month</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">334</p>
                    <p className="text-xs text-primary">+15.3% from last month</p>
                  </div>
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-2xl font-bold">$87.80</p>
                    <p className="text-xs text-primary">+5.1% from last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Monthly Revenue & Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
                    <Bar dataKey="orders" fill="hsl(var(--secondary))" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="farmers" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Farmers"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="consumers" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={2}
                      name="Consumers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Top Performing Farmers */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performing Farmers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topFarmers.map((farmer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{farmer.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{farmer.orders} orders</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{farmer.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${farmer.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Platform Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border-l-4 border-primary bg-primary/5">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">5 new farmers registered today</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border-l-4 border-secondary bg-secondary/5">
                  <ShoppingCart className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-medium">142 orders completed this week</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border-l-4 border-accent bg-accent/5">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">New delivery zone added: Downtown</p>
                    <p className="text-sm text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}