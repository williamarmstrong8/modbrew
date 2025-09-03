import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Receipt, TrendingDown, Plus, Building, TrendingUp } from "lucide-react";
import { useAdminContext } from "../contexts/AdminContext";
import { useMemo } from "react";

const Expenses = () => {
  const { adminData } = useAdminContext();

  // Calculate real expense stats
  const expenseStats = useMemo(() => {
    const totalExpenses = adminData.stats.totalExpenses;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    // Calculate this month's expenses
    const thisMonthExpenses = adminData.expenses
      .filter(expense => {
        const expenseDate = new Date(expense.purchased_at);
        return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
      })
      .reduce((sum, expense) => sum + expense.price, 0);
    
    // Calculate average daily cost (monthly expenses divided by 4)
    const avgDailyCost = thisMonthExpenses / 4;
    
    // Calculate each person's share of profit
    const eachPersonGets = adminData.stats.totalProfit / 3;

    return [
      { 
        title: "Total Expenses", 
        value: `$${totalExpenses.toFixed(2)}`, 
        change: "All-time total", 
        icon: Receipt, 
        color: "text-red-400" 
      },
      { 
        title: "This Month", 
        value: `$${thisMonthExpenses.toFixed(2)}`, 
        change: "Current month", 
        icon: TrendingDown, 
        color: "text-green-400" 
      },
      { 
        title: "Avg Daily Cost", 
        value: `$${avgDailyCost.toFixed(2)}`, 
        change: "Monthly ÷ 4", 
        icon: Building, 
        color: "text-blue-400" 
      },
      { 
        title: "Each Person Gets", 
        value: `$${eachPersonGets.toFixed(2)}`, 
        change: "Profit split 3 ways", 
        icon: TrendingUp, 
        color: eachPersonGets >= 0 ? "text-green-400" : "text-red-400" 
      }
    ];
  }, [adminData.expenses, adminData.stats.totalExpenses, adminData.stats.totalProfit]);

  // Calculate expenses by purchaser (Mary, Will, Ben)
  const expenseCategories = useMemo(() => {
    const expensesByPurchaser: { [key: string]: number } = {
      'mary': 0,
      'will': 0,
      'ben': 0
    };
    
    adminData.expenses.forEach(expense => {
      expensesByPurchaser[expense.purchaser] += expense.price;
    });
    
    const total = Object.values(expensesByPurchaser).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(expensesByPurchaser)
      .filter(([_, amount]) => amount > 0)
      .map(([purchaser, amount]) => ({
        name: purchaser.charAt(0).toUpperCase() + purchaser.slice(1),
        amount: Math.round(amount),
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: purchaser === 'mary' ? '#8B5CF6' : purchaser === 'will' ? '#3B82F6' : '#10B981'
      }));
  }, [adminData.expenses]);

  // Calculate sales vs expenses for the past 7 days
  const weeklyData = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    // Get expenses for the past 7 days
    const recentExpenses = adminData.expenses.filter(expense => {
      const expenseDate = new Date(expense.purchased_at);
      return expenseDate >= sevenDaysAgo && expenseDate <= today;
    });
    
    // Get sales for the past 7 days
    const recentSales = adminData.dailySales.filter(sale => {
      const saleDate = new Date(sale.sales_date);
      return saleDate >= sevenDaysAgo && saleDate <= today;
    });
    
    // Group by day
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExpenses = recentExpenses.filter(expense => 
        expense.purchased_at.startsWith(dateStr)
      ).reduce((sum, expense) => sum + expense.price, 0);
      
      const daySales = recentSales.filter(sale => 
        sale.sales_date === dateStr
      ).reduce((sum, sale) => sum + sale.gross_sales, 0);
      
      dailyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        expenses: dayExpenses,
        sales: daySales
      });
    }
    
    return dailyData;
  }, [adminData.expenses, adminData.dailySales]);

  // Transform real expenses data
  const recentExpenses = useMemo(() => {
    // Sort expenses by purchased_at date (most recent first) and take the first 6
    const sortedExpenses = [...adminData.expenses]
      .sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime())
      .slice(0, 6);
    
    return sortedExpenses.map((expense) => ({
      id: `EXP-${String(expense.id).padStart(3, '0')}`,
      description: expense.item_name,
      amount: `$${expense.price.toFixed(2)}`,
      category: expense.purchaser.charAt(0).toUpperCase() + expense.purchaser.slice(1),
      date: new Date(expense.purchased_at).toLocaleDateString(),
      status: "Paid",
      vendor: expense.purchaser.charAt(0).toUpperCase() + expense.purchaser.slice(1)
    }));
  }, [adminData.expenses]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-white/10 text-white/80 border-white/20";
    }
  };

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Show loading state
  if (adminData.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-lg text-white/60">Loading expenses data...</p>
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
          <h1 className="text-3xl font-light text-white tracking-wide">Expenses</h1>
          <p className="text-white/60 font-light text-lg">Track and manage your business expenses</p>
        </div>
        <Button className="bg-white text-black border-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {expenseStats.map((stat) => (
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
          <TabsTrigger value="recent" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 data-[state=active]:text-black">Recent Expenses</TabsTrigger>
          <TabsTrigger value="payout" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 data-[state=active]:text-black">Payout</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Expenses by Purchaser Pie Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader>
                <CardTitle className="text-xl font-light text-white">Expenses by Purchaser</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="amount"
                      isAnimationActive={false}
                      onClick={() => {}}
                      style={{ pointerEvents: 'none' }}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {expenseCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {expenseCategories.map((category, index) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-white/60">{category.name} - ${category.amount} ({((category.amount / expenseCategories.reduce((sum, cat) => sum + cat.amount, 0)) * 100).toFixed(0)}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Sales vs Expenses */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader>
                <CardTitle className="text-xl font-light text-white">Sales vs Expenses (Past 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                    <YAxis 
                      stroke="rgba(255,255,255,0.6)" 
                      domain={[0, (dataMax: number) => Math.ceil(dataMax / 50) * 50 + 50]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sales" fill="#10B981" name="Sales" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
            <CardHeader>
              <CardTitle className="text-xl font-light text-white">Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">{expense.id}</p>
                        <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{expense.category}</Badge>
                      </div>
                      <p className="text-sm text-white/60">{expense.description}</p>
                      <p className="text-sm text-white/40">{expense.vendor} • {expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{expense.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payout" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profit Summary */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader>
                <CardTitle className="text-xl font-light text-white">Profit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm text-green-400 font-medium">Total Revenue</p>
                    <p className="text-2xl font-light text-green-400">${adminData.stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-sm text-red-400 font-medium">Total Expenses</p>
                    <p className="text-2xl font-light text-red-400">${adminData.stats.totalExpenses.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-center p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-400 font-medium">Net Profit</p>
                  <p className={`text-3xl font-light ${adminData.stats.totalProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    ${adminData.stats.totalProfit.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-400 mt-1">
                    {adminData.stats.totalProfit >= 0 ? 'Available for distribution' : 'Loss - no payout'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* All-Time Payout Breakdown */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader>
                <CardTitle className="text-xl font-light text-white">All-Time Payout Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  // Calculate all-time revenue
                  const allTimeRevenue = adminData.stats.totalRevenue;
                  
                  // Calculate all-time expenses
                  const allTimeExpenses = adminData.stats.totalExpenses;
                  
                  const allTimeProfit = allTimeRevenue - allTimeExpenses;
                  const individualPayout = allTimeProfit / 3;
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <p className="text-sm text-green-400 font-medium">All-Time Revenue</p>
                          <p className="text-lg font-light text-green-400">${allTimeRevenue.toFixed(2)}</p>
                        </div>
                        <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <p className="text-sm text-red-400 font-medium">All-Time Expenses</p>
                          <p className="text-lg font-light text-red-400">${allTimeExpenses.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-sm text-blue-400 font-medium">All-Time Profit</p>
                        <p className={`text-xl font-light ${allTimeProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                          ${allTimeProfit.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-sm text-purple-400 font-medium">Each Person Gets</p>
                        <p className={`text-xl font-light ${individualPayout >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                          ${individualPayout.toFixed(2)}
                        </p>
                        <p className="text-xs text-purple-400 mt-1">Split 3 ways</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Team Member Expense Summary */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
            <CardHeader>
              <CardTitle className="text-xl font-light text-white">Team Member Expense Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  const expensesByPurchaser: { [key: string]: number } = {
                    'mary': 0,
                    'will': 0,
                    'ben': 0
                  };
                  
                  adminData.expenses.forEach(expense => {
                    expensesByPurchaser[expense.purchaser] += expense.price;
                  });
                  
                  return Object.entries(expensesByPurchaser).map(([purchaser, totalExpenses]) => {
                    const purchaserName = purchaser.charAt(0).toUpperCase() + purchaser.slice(1);
                    
                    return (
                      <div key={purchaser} className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="font-medium text-white mb-3">{purchaserName}</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-white/60">Total Expenses</p>
                            <p className="text-lg font-light text-white">${totalExpenses.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-white/60">Profit Split</p>
                            <p className="text-lg font-light text-green-400">${(adminData.stats.totalProfit / 3).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-white/60">Team Payout</p>
                            <p className="text-lg font-light text-blue-400">${(totalExpenses + (adminData.stats.totalProfit / 3)).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;

