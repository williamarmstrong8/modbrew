import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";

const Analytics = () => {
  const analyticsStats = [
    { title: "Total Revenue", value: "$12,847", change: "+15% this month", icon: DollarSign, color: "text-green-600" },
    { title: "Total Orders", value: "1,247", change: "+23% this month", icon: BarChart3, color: "text-blue-600" },
    { title: "Avg Order Value", value: "$10.30", change: "+$0.75 this month", icon: TrendingUp, color: "text-purple-600" },
    { title: "Customer Growth", value: "89", change: "+12 new customers", icon: Users, color: "text-orange-600" }
  ];

  const dailyRevenueData = [
    { day: "Mon", revenue: 850, orders: 67, customers: 45 },
    { day: "Tue", revenue: 920, orders: 72, customers: 48 },
    { day: "Wed", revenue: 1100, orders: 89, customers: 52 },
    { day: "Thu", revenue: 1250, orders: 95, customers: 58 },
    { day: "Fri", revenue: 1450, orders: 108, customers: 62 },
    { day: "Sat", revenue: 1680, orders: 125, customers: 68 },
    { day: "Sun", revenue: 1200, orders: 89, customers: 55 }
  ];

  const hourlyPerformanceData = [
    { hour: "6 AM", revenue: 45, orders: 8 },
    { hour: "7 AM", revenue: 120, orders: 15 },
    { hour: "8 AM", revenue: 280, orders: 32 },
    { hour: "9 AM", revenue: 320, orders: 28 },
    { hour: "10 AM", revenue: 180, orders: 22 },
    { hour: "11 AM", revenue: 150, orders: 18 },
    { hour: "12 PM", revenue: 420, orders: 45 },
    { hour: "1 PM", revenue: 380, orders: 38 },
    { hour: "2 PM", revenue: 290, orders: 31 },
    { hour: "3 PM", revenue: 220, orders: 25 },
    { hour: "4 PM", revenue: 180, orders: 20 },
    { hour: "5 PM", revenue: 160, orders: 18 },
    { hour: "6 PM", revenue: 95, orders: 12 },
    { hour: "7 PM", revenue: 60, orders: 8 },
    { hour: "8 PM", revenue: 30, orders: 4 }
  ];

  const productPerformanceData = [
    { name: "Cappuccino", sales: 45, revenue: 337.50, percentage: 25 },
    { name: "Americano", sales: 38, revenue: 285.00, percentage: 21 },
    { name: "Latte", sales: 32, revenue: 320.00, percentage: 18 },
    { name: "Cold Brew", sales: 28, revenue: 196.00, percentage: 16 },
    { name: "Espresso", sales: 25, revenue: 125.00, percentage: 14 },
    { name: "Pastries", sales: 22, revenue: 165.00, percentage: 6 }
  ];

  const customerSegmentsData = [
    { segment: "VIP Customers", count: 89, revenue: 4560, color: "#8B5CF6" },
    { segment: "Regular Customers", count: 234, revenue: 3120, color: "#3B82F6" },
    { segment: "New Customers", count: 156, revenue: 1248, color: "#10B981" },
    { segment: "Occasional", count: 89, revenue: 445, color: "#F59E0B" }
  ];

  const monthlyTrendData = [
    { month: "Jan", revenue: 8500, orders: 680, customers: 234 },
    { month: "Feb", revenue: 9200, orders: 720, customers: 245 },
    { month: "Mar", revenue: 11000, orders: 890, customers: 267 },
    { month: "Apr", revenue: 12500, orders: 950, customers: 278 },
    { month: "May", revenue: 14500, orders: 1080, customers: 289 },
    { month: "Jun", revenue: 12847, orders: 1247, customers: 312 }
  ];

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h1>
        <p className="text-slate-600">Comprehensive insights into your coffee shop performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Revenue Trend */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Weekly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Performance */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Peak Hours Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Product Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {productPerformanceData.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.sales} sales • ${product.revenue}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">{product.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments and Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Segments */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegmentsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {customerSegmentsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={customerSegmentsData[index].color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {customerSegmentsData.map((segment) => (
                <div key={segment.segment} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-sm text-slate-600">{segment.segment}: {segment.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Growth Trend */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Monthly Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: "#8B5CF6", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="text-3xl font-bold text-green-600">+23%</div>
              <p className="text-sm text-slate-600">Revenue Growth</p>
              <p className="text-xs text-slate-500">vs last month</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="text-3xl font-bold text-blue-600">4.8/5</div>
              <p className="text-sm text-slate-600">Customer Rating</p>
              <p className="text-xs text-slate-500">based on 127 reviews</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50">
              <div className="text-3xl font-bold text-purple-600">89%</div>
              <p className="text-sm text-slate-600">Customer Retention</p>
              <p className="text-xs text-slate-500">returning customers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

