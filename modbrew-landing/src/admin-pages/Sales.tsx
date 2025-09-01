import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Clock } from "lucide-react";

const Sales = () => {
  const salesStats = [
    { title: "Today's Sales", value: "$1,247", change: "+12% from yesterday", icon: DollarSign, color: "text-green-600" },
    { title: "Orders Today", value: "89", change: "+5 from yesterday", icon: ShoppingCart, color: "text-blue-600" },
    { title: "Avg Order Value", value: "$14.01", change: "+$0.75 this week", icon: TrendingUp, color: "text-purple-600" },
    { title: "Pending Orders", value: "12", change: "3 ready for pickup", icon: Clock, color: "text-orange-600" }
  ];

  const hourlySalesData = [
    { hour: "6 AM", sales: 45, orders: 8 },
    { hour: "7 AM", sales: 120, orders: 15 },
    { hour: "8 AM", sales: 280, orders: 32 },
    { hour: "9 AM", sales: 320, orders: 28 },
    { hour: "10 AM", sales: 180, orders: 22 },
    { hour: "11 AM", sales: 150, orders: 18 },
    { hour: "12 PM", sales: 420, orders: 45 },
    { hour: "1 PM", sales: 380, orders: 38 },
    { hour: "2 PM", sales: 290, orders: 31 },
    { hour: "3 PM", sales: 220, orders: 25 },
    { hour: "4 PM", sales: 180, orders: 20 },
    { hour: "5 PM", sales: 160, orders: 18 },
    { hour: "6 PM", sales: 95, orders: 12 },
    { hour: "7 PM", sales: 60, orders: 8 },
    { hour: "8 PM", sales: 30, orders: 4 }
  ];

  const weeklySalesData = [
    { day: "Mon", sales: 850, orders: 67 },
    { day: "Tue", sales: 920, orders: 72 },
    { day: "Wed", sales: 1100, orders: 89 },
    { day: "Thu", sales: 1250, orders: 95 },
    { day: "Fri", sales: 1450, orders: 108 },
    { day: "Sat", sales: 1680, orders: 125 },
    { day: "Sun", sales: 1200, orders: 89 }
  ];

  const recentOrders = [
    { id: "#001", customer: "Sarah Johnson", items: "Cappuccino, Croissant", total: "$12.50", status: "Completed", time: "2 min ago" },
    { id: "#002", customer: "Mike Chen", items: "Americano, Muffin", total: "$8.75", status: "In Progress", time: "5 min ago" },
    { id: "#003", customer: "Emma Davis", items: "Latte, Bagel", total: "$10.25", status: "Completed", time: "8 min ago" },
    { id: "#004", customer: "Alex Rodriguez", items: "Espresso, Danish", total: "$9.50", status: "Pending", time: "12 min ago" },
    { id: "#005", customer: "Lisa Wang", items: "Cold Brew, Sandwich", total: "$14.00", status: "Completed", time: "15 min ago" },
    { id: "#006", customer: "David Kim", items: "Frappuccino, Cookie", total: "$11.75", status: "In Progress", time: "18 min ago" }
  ];

  const topSellingItems = [
    { name: "Cappuccino", sales: 45, revenue: "$337.50", growth: "+12%" },
    { name: "Americano", sales: 38, revenue: "$285.00", growth: "+8%" },
    { name: "Latte", sales: 32, revenue: "$320.00", growth: "+15%" },
    { name: "Cold Brew", sales: 28, revenue: "$196.00", growth: "+22%" },
    { name: "Espresso", sales: 25, revenue: "$125.00", growth: "+5%" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Sales Dashboard</h1>
        <p className="text-slate-600">Track your sales performance and order management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hourly Sales Chart */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Today's Hourly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Sales Trend */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Weekly Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: "#8B5CF6", strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-slate-800">{order.id}</p>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{order.customer}</p>
                      <p className="text-sm text-slate-500">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{order.total}</p>
                      <p className="text-xs text-slate-500">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingItems.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-sm text-slate-600">{item.sales} sold today</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{item.revenue}</p>
                      <p className="text-sm text-green-600">{item.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;

