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
        color: "text-red-600" 
      },
      { 
        title: "This Month", 
        value: `$${thisMonthExpenses.toFixed(2)}`, 
        change: "Current month", 
        icon: TrendingDown, 
        color: "text-green-600" 
      },
      { 
        title: "Avg Daily Cost", 
        value: `$${avgDailyCost.toFixed(2)}`, 
        change: "Monthly ÷ 4", 
        icon: Building, 
        color: "text-blue-600" 
      },
      { 
        title: "Each Person Gets", 
        value: `$${eachPersonGets.toFixed(2)}`, 
        change: "Profit split 3 ways", 
        icon: TrendingUp, 
        color: eachPersonGets >= 0 ? "text-green-600" : "text-red-600" 
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

  const monthlyExpenses = [
    { month: "Jan", amount: 2100, budget: 2500 },
    { month: "Feb", amount: 2300, budget: 2500 },
    { month: "Mar", amount: 1950, budget: 2500 },
    { month: "Apr", amount: 2400, budget: 2500 },
    { month: "May", amount: 2200, budget: 2500 },
    { month: "Jun", amount: 2347, budget: 2500 }
  ];

  // Transform real expenses data
  const recentExpenses = useMemo(() => {
    return adminData.expenses.slice(0, 6).map((expense, index) => ({
      id: `EXP-${String(index + 1).padStart(3, '0')}`,
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
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };



  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Show loading state
  if (adminData.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading expenses data...</p>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Expenses</h1>
          <p className="text-slate-600">Track and manage your business expenses</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {expenseStats.map((stat, index) => (
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
          <TabsTrigger value="recent">Recent Expenses</TabsTrigger>
          <TabsTrigger value="payout">Payout</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Expenses by Purchaser Pie Chart */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Expenses by Purchaser</CardTitle>
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
                    >
                      {expenseCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {expenseCategories.map((category, index) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-slate-600">{category.name}: ${category.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Budget vs Actual */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Monthly Budget vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#EF4444" name="Actual" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="budget" fill="#10B981" name="Budget" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-slate-800">{expense.id}</p>
                        <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">{expense.category}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{expense.description}</p>
                      <p className="text-sm text-slate-500">{expense.vendor} • {expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{expense.amount}</p>
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
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Profit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-700">${adminData.stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-700">${adminData.stats.totalExpenses.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Net Profit</p>
                  <p className={`text-3xl font-bold ${adminData.stats.totalProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    ${adminData.stats.totalProfit.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {adminData.stats.totalProfit >= 0 ? 'Available for distribution' : 'Loss - no payout'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* All-Time Payout Breakdown */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">All-Time Payout Breakdown</CardTitle>
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
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">All-Time Revenue</p>
                          <p className="text-lg font-bold text-green-700">${allTimeRevenue.toFixed(2)}</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-600 font-medium">All-Time Expenses</p>
                          <p className="text-lg font-bold text-red-700">${allTimeExpenses.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">All-Time Profit</p>
                        <p className={`text-xl font-bold ${allTimeProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                          ${allTimeProfit.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600 font-medium">Each Person Gets</p>
                        <p className={`text-xl font-bold ${individualPayout >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
                          ${individualPayout.toFixed(2)}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">Split 3 ways</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Team Member Expense Summary */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Team Member Expense Summary</CardTitle>
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
                      <div key={purchaser} className="text-center p-4 bg-slate-50 rounded-lg">
                        <h3 className="font-semibold text-slate-800 mb-3">{purchaserName}</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-slate-600">Total Expenses</p>
                            <p className="text-lg font-bold text-slate-800">${totalExpenses.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Profit Split</p>
                            <p className="text-lg font-bold text-green-700">${(adminData.stats.totalProfit / 3).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Team Payout</p>
                            <p className="text-lg font-bold text-blue-700">${(totalExpenses + (adminData.stats.totalProfit / 3)).toFixed(2)}</p>
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

