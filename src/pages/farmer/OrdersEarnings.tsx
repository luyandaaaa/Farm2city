import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  Wallet, 
  TrendingUp,
  Calendar,
  Download,
  X
} from "lucide-react";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getOrdersByUser, updateOrderStatus, getUserProfile } from '@/lib/localStorageUtils';

export default function OrdersEarnings() {
  const user = localStorage.getItem('farm2city_user');
  const [orders, setOrders] = useState(() => {
    if (user) {
      const farmerProfile = getUserProfile(user);
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      return allOrders.filter(order => {
        // Match by farmerProfile.id, farmerProfile.name, farmerProfile.email, or farmer field
        return (
          order.farmerProfile?.id === user ||
          order.farmerProfile?.name === farmerProfile?.name ||
          order.farmerProfile?.email === farmerProfile?.email ||
          order.farmer === user ||
          order.farmer === farmerProfile?.name ||
          order.farmer === farmerProfile?.farmName
        );
      });
    }
    return [];
  });

  const [earnings] = useState({
    thisMonth: 3420.50,
    lastMonth: 2890.00,
    totalEarnings: 12540.00,
    pendingPayments: 637.50
  });

  const earningsData = [
    { month: 'Jan', earnings: 2100 },
    { month: 'Feb', earnings: 2400 },
    { month: 'Mar', earnings: 2890 },
    { month: 'Apr', earnings: 3420 },
    { month: 'May', earnings: 3200 },
    { month: 'Jun', earnings: 3800 }
  ];

  const handleAcceptOrder = (orderId) => {
    // Update order status in localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.map(order =>
      order.id === orderId ? { ...order, status: 'confirmed' } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders.filter(order => {
      const farmerProfile = getUserProfile(user);
      return (
        order.farmerProfile?.id === user ||
        order.farmerProfile?.name === farmerProfile?.name ||
        order.farmerProfile?.email === farmerProfile?.email ||
        order.farmer === user ||
        order.farmer === farmerProfile?.name ||
        order.farmer === farmerProfile?.farmName
      );
    }));
    toast({
      title: "Order Accepted",
      description: "Order has been confirmed and customer notified.",
    });
  };

  const handleDeclineOrder = (orderId) => {
    updateOrderStatus(orderId, 'declined');
    setOrders(prevOrders =>
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'declined' } : order
      )
    );
    toast({
      title: "Order Declined",
      description: "Order has been declined and customer notified.",
      variant: "destructive"
    });
  };

  const handleTrackOrder = (orderId) => {
    toast({
      title: "Tracking Order",
      description: "Opening delivery tracking interface...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'delivered': return 'outline';
      default: return 'secondary';
    }
  };

  // Utility to clean up blob URLs in localStorage products
  function cleanUpBlobImages() {
    const products = JSON.parse(localStorage.getItem('farm2city_products') || '[]');
    const cleaned = products.map(p => {
      if (typeof p.image === 'string' && p.image.startsWith('blob:')) {
        // Replace with placeholder
        return { ...p, image: '/placeholder.svg' };
      }
      return p;
    });
    localStorage.setItem('farm2city_products', JSON.stringify(cleaned));
  }
  // Run cleanup on load
  cleanUpBlobImages();

  return (
    <FarmerLayout currentPage="Orders & Earnings">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Orders & Earnings 📊</h1>
          <p className="text-muted-foreground">
            Track your orders and manage your earnings
          </p>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R{earnings.thisMonth.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R{earnings.totalEarnings.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R{earnings.pendingPayments.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-glow/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary-glow" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Orders and Analytics */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Current Orders</TabsTrigger>
            <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Current Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{order.id}</h3>
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        {/* Render each item in the order */}
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={item.id || idx} className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                              <span className="text-xs">R{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{order.location} • {order.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">R{order.total.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleAcceptOrder(order.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeclineOrder(order.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                          {/* No action buttons for confirmed, delivered, or declined orders */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Monthly Earnings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`R${value}`, 'Earnings']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Organic Spinach</span>
                      <span className="font-semibold">45 sales</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Heritage Tomatoes</span>
                      <span className="font-semibold">32 sales</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sweet Corn</span>
                      <span className="font-semibold">28 sales</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Payment History</CardTitle>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Payment from Green Market Co-op</p>
                      <p className="text-sm text-muted-foreground">Order #ORD-002 • Jan 14, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">+R250.00</p>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Payment from Urban Fresh Store</p>
                      <p className="text-sm text-muted-foreground">Order #ORD-003 • Jan 12, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">+R320.00</p>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FarmerLayout>
  );
}