import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Clock, Plus } from "lucide-react";
import { useAdminContext } from "../contexts/AdminContext";
import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import DatePicker from "../components/ui/date-picker";
import { toast } from "sonner";

const Sales = () => {
  const { adminData, addDailySale } = useAdminContext();

  // Helper function to get day suffix (1st, 2nd, 3rd, etc.)
  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Sales state
  const [salesDate, setSalesDate] = useState(() => {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    return easternTime.toISOString().split('T')[0];
  });
  const [customerCount, setCustomerCount] = useState("");
  const [grossSales, setGrossSales] = useState("");

  const handleAddDailySales = async () => {
    const customerCountNum = parseInt(customerCount);
    const grossSalesNum = parseFloat(grossSales);
    
    if (!isNaN(customerCountNum) && customerCountNum > 0 && !isNaN(grossSalesNum) && grossSalesNum > 0) {
      try {
        await addDailySale({
          sales_date: salesDate,
          customer_count: customerCountNum,
          gross_sales: grossSalesNum
        });
        
        setCustomerCount("");
        setGrossSales("");
        toast.success('Sales added successfully!');
      } catch (error) {
        console.error('Error adding daily sales:', error);
        toast.error('Failed to add sales');
      }
    } else {
      toast.error('Please enter valid numbers for customer count and gross sales');
    }
  };

  // Calculate real sales stats
  const salesStats = [
    { 
      title: "Total Sales", 
      value: `$${adminData.stats.totalRevenue.toFixed(2)}`, 
      change: "All-time total", 
      icon: DollarSign, 
      color: "text-green-400" 
    },
    { 
      title: "Total Orders", 
      value: adminData.stats.totalCustomers.toString(), 
      change: "All-time total", 
      icon: ShoppingCart, 
      color: "text-blue-400" 
    },
    { 
      title: "Total Profit", 
      value: `$${adminData.stats.totalProfit.toFixed(2)}`, 
      change: "Revenue - Expenses", 
      icon: TrendingUp, 
      color: adminData.stats.totalProfit >= 0 ? "text-green-400" : "text-red-400" 
    },
    { 
      title: "All Time Profit Margin", 
      value: `${adminData.stats.totalRevenue > 0 ? ((adminData.stats.totalProfit / adminData.stats.totalRevenue) * 100).toFixed(1) : 0}%`, 
      change: "Profit ÷ Revenue", 
      icon: Clock, 
      color: "text-purple-400" 
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

  // Transform daily sales to recent orders format - sorted from most recent to least recent
  const recentOrders = useMemo(() => {
    return adminData.dailySales
      .sort((a, b) => new Date(b.sales_date).getTime() - new Date(a.sales_date).getTime())
      .slice(0, 6)
      .map((sale) => {
        const saleDate = new Date(sale.sales_date);
        const dayName = saleDate.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = saleDate.toLocaleDateString('en-US', { month: 'long' });
        const day = saleDate.getDate();
        const suffix = getDaySuffix(day);
        
        return {
          id: `#${String(sale.id).padStart(3, '0')}`,
          customer: `${sale.customer_count} customers`,
          items: "Daily sales",
          total: `$${sale.gross_sales.toFixed(2)}`,
          status: "Completed",
          time: new Date(sale.sales_date).toLocaleDateString(),
          formattedDate: `${dayName}, ${monthName} ${day}${suffix}`
        };
      });
  }, [adminData.dailySales]);

  // Calculate monthly sales data
  const monthlySalesData = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    // Filter sales from this month
    const thisMonthSales = adminData.dailySales.filter(sale => {
      const saleDate = new Date(sale.sales_date);
      return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
    });
    
    // Calculate monthly totals
    const monthlyRevenue = thisMonthSales.reduce((sum, sale) => sum + sale.gross_sales, 0);
    const monthlyCustomers = thisMonthSales.reduce((sum, sale) => sum + sale.customer_count, 0);
    const monthlyOrders = thisMonthSales.length;
    
    return {
      revenue: monthlyRevenue,
      customers: monthlyCustomers,
      orders: monthlyOrders
    };
  }, [adminData.dailySales]);

  // Calculate monthly profit margin
  const monthlyProfitMargin = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    // Filter expenses from this month
    const thisMonthExpenses = adminData.expenses.filter(expense => {
      const expenseDate = new Date(expense.purchased_at);
      return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
    });
    
    const monthlyExpenses = thisMonthExpenses.reduce((sum, expense) => sum + expense.price, 0);
    const monthlyProfit = monthlySalesData.revenue - monthlyExpenses;
    const profitMargin = monthlySalesData.revenue > 0 ? (monthlyProfit / monthlySalesData.revenue) * 100 : 0;
    
    return {
      profit: monthlyProfit,
      margin: profitMargin,
      expenses: monthlyExpenses
    };
  }, [adminData.expenses, monthlySalesData.revenue]);

  const topSellingItems = [
    { name: "Monthly Sales", sales: monthlySalesData.orders, revenue: `$${monthlySalesData.revenue.toFixed(2)}`, growth: "This month" },
    { name: "Monthly Customers", sales: monthlySalesData.customers, revenue: `${monthlySalesData.customers} customers`, growth: "This month" },
    { name: "Monthly Profit", sales: Math.round(monthlyProfitMargin.profit), revenue: `$${monthlyProfitMargin.profit.toFixed(2)}`, growth: `${monthlyProfitMargin.margin.toFixed(1)}% margin` },
    { name: "Monthly Expenses", sales: Math.round(monthlyProfitMargin.expenses), revenue: `$${monthlyProfitMargin.expenses.toFixed(2)}`, growth: "This month" },
    { name: "Avg Order Value", sales: Math.round(adminData.stats.totalRevenue / (adminData.stats.totalCustomers || 1)), revenue: `$${(adminData.stats.totalRevenue / (adminData.stats.totalCustomers || 1)).toFixed(2)}`, growth: "All-time average" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "In Progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-white/10 text-white/80 border-white/20";
    }
  };

  // Show loading state
  if (adminData.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-lg text-white/60">Loading sales data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (adminData.error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-light text-white mb-2">Error Loading Data</h2>
          <p className="text-white/60 mb-4">{adminData.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-black px-6 py-2 rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide">Sales Dashboard</h1>
          <p className="text-white/60 font-light text-lg">Track your sales performance and order management</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-white text-black border-white hover:bg-white hover:text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Sales
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Add Sales</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Date</label>
                <DatePicker
                  value={salesDate}
                  onChange={setSalesDate}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Customer Count</label>
                <Input
                  type="number"
                  placeholder="Enter number of customers"
                  value={customerCount}
                  onChange={(e) => setCustomerCount(e.target.value)}
                  min="1"
                  step="1"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Gross Sales ($)</label>
                <Input
                  type="number"
                  placeholder="Enter gross sales amount"
                  value={grossSales}
                  onChange={(e) => setGrossSales(e.target.value)}
                  min="0"
                  step="0.01"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/20"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCustomerCount("");
                    setGrossSales("");
                  }}
                  className="bg-white text-black border-white hover:bg-white hover:text-black"
                >
                  Clear
                </Button>
                <Button
                  className="bg-white text-black border-white hover:bg-white hover:text-black"
                  onClick={handleAddDailySales}
                >
                  Add Sales
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map((stat) => (
          <Card key={stat.title} className="bg-white/5 border-white/10 backdrop-blur-sm card-override hover:bg-white/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/60">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-white">{stat.value}</div>
              <p className="text-xs text-white/40 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 data-[state=active]:text-black">Overview</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 data-[state=active]:text-black">Recent Orders</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 data-[state=active]:text-black">Monthly Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Sales by Day Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader>
                <CardTitle className="text-xl font-light text-white">Weekly Sales by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={weeklySalesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                    <YAxis 
                      stroke="rgba(255,255,255,0.6)" 
                      domain={[0, (dataMax: number) => Math.ceil(dataMax / 50) * 50 + 50]}
                      tickCount={6}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="sales" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Sales Trend */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader>
                <CardTitle className="text-xl font-light text-white">Weekly Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={weeklySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                    <YAxis 
                      stroke="rgba(255,255,255,0.6)" 
                      domain={[0, (dataMax: number) => Math.ceil(dataMax / 50) * 50 + 50]}
                      tickCount={6}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white'
                      }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: "#8B5CF6", strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
            <CardHeader>
              <CardTitle className="text-xl font-light text-white">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">{order.formattedDate}</p>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-white/60">{order.customer}</p>
                      <p className="text-sm text-white/40">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{order.total}</p>
                      <p className="text-xs text-white/40">{order.items}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
            <CardHeader>
              <CardTitle className="text-xl font-light text-white">Monthly Business Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingItems.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                        <span className="text-amber-400 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-white/60">
                          {item.name === "Monthly Sales" ? `${item.sales} orders` : 
                           item.name === "Monthly Customers" ? `${item.sales} customers` : 
                           item.name === "Monthly Profit" ? `${item.sales} profit` : 
                           item.name === "Monthly Expenses" ? `${item.sales} expenses` : 
                           item.name === "Avg Order Value" ? `$${item.sales} average` : 
                           `${item.sales} items`} {item.name === "Avg Order Value" ? "all-time" : "this month"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{item.revenue}</p>
                      <p className="text-sm text-green-400">{item.growth}</p>
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

