import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Clock } from "lucide-react";
import { useAdminContext } from "../contexts/AdminContext";
import { useMemo } from "react";

const Sales = () => {
  const { adminData } = useAdminContext();

  // Calculate real sales stats
  const salesStats = [
    { 
      title: "Total Sales", 
      value: `$${adminData.stats.totalRevenue.toFixed(2)}`, 
      change: "All-time total", 
      icon: DollarSign, 
      color: "text-green-600" 
    },
    { 
      title: "Total Orders", 
      value: adminData.stats.totalCustomers.toString(), 
      change: "All-time total", 
      icon: ShoppingCart, 
      color: "text-blue-600" 
    },
    { 
      title: "Total Profit", 
      value: `$${adminData.stats.totalProfit.toFixed(2)}`, 
      change: "Revenue - Expenses", 
      icon: TrendingUp, 
      color: adminData.stats.totalProfit >= 0 ? "text-green-600" : "text-red-600" 
    },
    { 
      title: "Avg Order Value", 
      value: `$${adminData.stats.averageOrderValue.toFixed(2)}`, 
      change: "All-time average", 
      icon: Clock, 
      color: "text-purple-600" 
    }
  ];

  // Calculate weekly sales data for last 7 days (today as rightmost)
  const weeklySalesData = useMemo(() => {
    if (!adminData.dailySales.length) return [];
    
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days including today
    
    const salesByDate: { [key: string]: { sales: number; orders: number } } = {};
    
    // Initialize all 7 days with 0
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      salesByDate[dateKey] = { sales: 0, orders: 0 };
    }
    
    // Filter sales from last 7 days
    adminData.dailySales.forEach(sale => {
      const saleDate = new Date(sale.sales_date);
      if (saleDate >= sevenDaysAgo && saleDate <= today) {
        const dateKey = sale.sales_date.split('T')[0];
        if (salesByDate[dateKey]) {
          salesByDate[dateKey].sales += sale.gross_sales;
          salesByDate[dateKey].orders += sale.customer_count;
        }
      }
    });
    
    // Create array with last 7 days, today as rightmost
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      result.push({
        day: dayName,
        date: dateKey,
        sales: Math.round(salesByDate[dateKey]?.sales || 0),
        orders: salesByDate[dateKey]?.orders || 0
      });
    }
    
    return result;
  }, [adminData.dailySales]);

  // Calculate weekly sales by day of week for last 7 days (today as rightmost)
  const weeklySalesByDay = useMemo(() => {
    if (!adminData.dailySales.length) return [];
    
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days including today
    
    const salesByDate: { [key: string]: { sales: number; orders: number } } = {};
    
    // Initialize all 7 days with 0
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      salesByDate[dateKey] = { sales: 0, orders: 0 };
    }
    
    // Filter sales from last 7 days
    adminData.dailySales.forEach(sale => {
      const saleDate = new Date(sale.sales_date);
      if (saleDate >= sevenDaysAgo && saleDate <= today) {
        const dateKey = sale.sales_date.split('T')[0];
        if (salesByDate[dateKey]) {
          salesByDate[dateKey].sales += sale.gross_sales;
          salesByDate[dateKey].orders += sale.customer_count;
        }
      }
    });
    
    // Create array with last 7 days, today as rightmost
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      result.push({
        day: dayName,
        date: dateKey,
        sales: Math.round(salesByDate[dateKey]?.sales || 0),
        orders: salesByDate[dateKey]?.orders || 0
      });
    }
    
    return result;
  }, [adminData.dailySales]);

  // Transform daily sales to recent orders format
  const recentOrders = useMemo(() => {
    return adminData.dailySales.slice(0, 6).map((sale, index) => ({
      id: `#${String(index + 1).padStart(3, '0')}`,
      customer: `${sale.customer_count} customers`,
      items: "Daily sales",
      total: `$${sale.gross_sales.toFixed(2)}`,
      status: "Completed",
      time: new Date(sale.sales_date).toLocaleDateString()
    }));
  }, [adminData.dailySales]);

  // Note: Individual product sales data not available in current structure
  const topSellingItems = [
    { name: "Daily Sales", sales: adminData.dailySales.length, revenue: `$${adminData.stats.totalRevenue.toFixed(2)}`, growth: "All-time total" },
    { name: "Note", sales: 0, revenue: "Individual product data", growth: "Not tracked" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Show loading state
  if (adminData.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (adminData.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Data</h2>
          <p className="text-slate-600 mb-4">{adminData.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            {/* Weekly Sales by Day Chart */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Weekly Sales by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklySalesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
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

