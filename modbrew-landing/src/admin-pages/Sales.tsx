import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const Sales = () => {
  // State for sales data
  const [salesData, setSalesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [weeklyCustomers, setWeeklyCustomers] = useState(0);

  // Fetch sales data from database
  const fetchSalesData = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_sales')
        .select('*')
        .order('sales_date', { ascending: false });

      if (error) {
        console.error('Error fetching sales data:', error);
        return;
      }

      setSalesData(data || []);

      // Calculate totals
      const totalRev = data?.reduce((sum, sale) => sum + (sale.gross_sales || 0), 0) || 0;
      const totalCust = data?.reduce((sum, sale) => sum + (sale.customer_count || 0), 0) || 0;

      // Calculate weekly data (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      
      const weeklyData = data?.filter(sale => sale.sales_date >= weekAgoStr) || [];
      const weeklyRev = weeklyData.reduce((sum, sale) => sum + (sale.gross_sales || 0), 0);
      const weeklyCust = weeklyData.reduce((sum, sale) => sum + (sale.customer_count || 0), 0);

      setTotalRevenue(totalRev);
      setTotalCustomers(totalCust);
      setWeeklyRevenue(weeklyRev);
      setWeeklyCustomers(weeklyCust);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const avgOrderValue = totalCustomers > 0 ? (totalRevenue / totalCustomers) : 0;

  const salesStats = [
    { 
      title: "Weekly Sales", 
      value: isLoading ? "Loading..." : `$${weeklyRevenue.toLocaleString()}`, 
      change: "Last 7 days revenue", 
      icon: DollarSign, 
      color: "text-green-600" 
    },
    { 
      title: "Weekly Customers", 
      value: isLoading ? "Loading..." : weeklyCustomers.toString(), 
      change: "Last 7 days customers", 
      icon: ShoppingCart, 
      color: "text-blue-600" 
    },
    { 
      title: "Avg Order Value", 
      value: isLoading ? "Loading..." : `$${avgOrderValue.toFixed(2)}`, 
      change: "Revenue per customer", 
      icon: TrendingUp, 
      color: "text-purple-600" 
    },
    { 
      title: "Total Sales", 
      value: isLoading ? "Loading..." : `$${totalRevenue.toLocaleString()}`, 
      change: "All time revenue", 
      icon: Clock, 
      color: "text-orange-600" 
    }
  ];

  // Generate chart data from actual sales data
  const getWeeklySalesData = () => {
    if (!salesData.length) return [];
    
    // Get last 7 days of data
    const last7Days = salesData.slice(0, 7).reverse();
    
    return last7Days.map(sale => {
      const date = new Date(sale.sales_date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayName,
        sales: sale.gross_sales || 0,
        orders: sale.customer_count || 0
      };
    });
  };

  const weeklySalesData = getWeeklySalesData();

  // Generate recent sales from actual data
  const getRecentSales = () => {
    if (!salesData.length) return [];
    
    return salesData.slice(0, 6).map((sale, index) => {
      const date = new Date(sale.sales_date);
      const timeAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      const timeText = timeAgo === 0 ? "Today" : timeAgo === 1 ? "Yesterday" : `${timeAgo} days ago`;
      
      return {
        id: `#${String(index + 1).padStart(3, '0')}`,
        date: sale.sales_date,
        customers: sale.customer_count || 0,
        total: `$${(sale.gross_sales || 0).toFixed(2)}`,
        status: "Completed",
        time: timeText
      };
    });
  };

  const recentSales = getRecentSales();

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
            {/* Sales Summary Chart */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Sales Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-slate-500">Loading sales data...</p>
                  </div>
                ) : salesData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-slate-500">No sales data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Total Revenue</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{totalCustomers.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Total Customers</p>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">${avgOrderValue.toFixed(2)}</p>
                      <p className="text-sm text-slate-600">Average Order Value</p>
                    </div>
                  </div>
                )}
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
              <CardTitle className="text-xl font-bold text-slate-800">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-slate-500">Loading sales data...</p>
                </div>
              ) : recentSales.length === 0 ? (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-slate-500">No sales data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-slate-800">{sale.id}</p>
                          <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-600">Date: {sale.date}</p>
                        <p className="text-sm text-slate-500">{sale.customers} customers</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-800">{sale.total}</p>
                        <p className="text-xs text-slate-500">{sale.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

