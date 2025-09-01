import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Receipt, TrendingDown, AlertTriangle, Plus, CreditCard, Building } from "lucide-react";
import { useModBrew } from "../contexts/ModBrewContext";

const Expenses = () => {
  // Get data from context
  const { data } = useModBrew();

  // No need for individual data fetching - context handles this

  const expenseStats = [
    { 
      title: "Total Expenses", 
      value: data?.expensesLoading ? "Loading..." : `$${data?.expenseStats.totalExpenses.toLocaleString() || 0}`, 
      change: "All time expenses", 
      icon: Receipt, 
      color: "text-red-600" 
    },
    { 
      title: "This Month", 
      value: data?.expensesLoading ? "Loading..." : `$${data?.expenseStats.monthlyExpenses.toLocaleString() || 0}`, 
      change: "Current month expenses", 
      icon: TrendingDown, 
      color: "text-green-600" 
    },
    { 
      title: "This Week", 
      value: data?.expensesLoading ? "Loading..." : `$${data?.expenseStats.weeklyExpenses.toLocaleString() || 0}`, 
      change: "Last 7 days expenses", 
      icon: AlertTriangle, 
      color: "text-orange-600" 
    },
    { 
      title: "Avg Daily Cost", 
      value: data?.expensesLoading ? "Loading..." : `$${data?.expenseStats.avgDailyExpenses.toFixed(2) || "0.00"}`, 
      change: "Average per day", 
      icon: Building, 
      color: "text-blue-600" 
    }
  ];

  const expenseCategories = [
    { name: "Supplies", amount: 850, percentage: 30, color: "#8B5CF6" },
    { name: "Rent", amount: 1200, percentage: 42, color: "#3B82F6" },
    { name: "Utilities", amount: 320, percentage: 11, color: "#10B981" },
    { name: "Equipment", amount: 280, percentage: 10, color: "#F59E0B" },
    { name: "Marketing", amount: 197, percentage: 7, color: "#EF4444" }
  ];

  const monthlyExpenses = [
    { month: "Jan", amount: 2100, budget: 2500 },
    { month: "Feb", amount: 2300, budget: 2500 },
    { month: "Mar", amount: 1950, budget: 2500 },
    { month: "Apr", amount: 2400, budget: 2500 },
    { month: "May", amount: 2200, budget: 2500 },
    { month: "Jun", amount: 2347, budget: 2500 }
  ];

  // Generate recent expenses from actual data
  const getRecentExpenses = () => {
    if (!data?.expenses.length) return [];
    
    return data.expenses.slice(0, 6).map((expense, index) => {
      const date = new Date(expense.purchased_at);
      const timeAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      const timeText = timeAgo === 0 ? "Today" : timeAgo === 1 ? "Yesterday" : `${timeAgo} days ago`;
      
      return {
        id: `EXP-${String(index + 1).padStart(3, '0')}`,
        description: expense.item_name,
        amount: `$${(expense.price || 0).toFixed(2)}`,
        category: "General", // Since we don't have categories in our current schema
        date: expense.purchased_at.split('T')[0],
        status: "Paid",
        purchaser: expense.purchaser,
        time: timeText
      };
    });
  };

  const recentExpenses = getRecentExpenses();

  const upcomingBills = [
    { description: "Internet service", amount: "$89.99", dueDate: "Jan 20, 2024", category: "Utilities" },
    { description: "Insurance premium", amount: "$156.00", dueDate: "Jan 25, 2024", category: "Insurance" },
    { description: "Water bill", amount: "$67.50", dueDate: "Jan 28, 2024", category: "Utilities" },
    { description: "Coffee grinder repair", amount: "$125.00", dueDate: "Feb 1, 2024", category: "Equipment" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Supplies": return "bg-purple-100 text-purple-800";
      case "Rent": return "bg-blue-100 text-blue-800";
      case "Utilities": return "bg-green-100 text-green-800";
      case "Equipment": return "bg-amber-100 text-amber-800";
      case "Marketing": return "bg-red-100 text-red-800";
      case "Insurance": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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
          <TabsTrigger value="upcoming">Upcoming Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Expense Categories Pie Chart */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Expense Categories</CardTitle>
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
              {data?.expensesLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-slate-500">Loading expenses data...</p>
                </div>
              ) : recentExpenses.length === 0 ? (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-slate-500">No expenses data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-slate-800">{expense.id}</p>
                          <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                          <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                        </div>
                        <p className="text-sm text-slate-600">{expense.description}</p>
                        <p className="text-sm text-slate-500">Purchased by: {expense.purchaser} • {expense.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-800">{expense.amount}</p>
                        <p className="text-xs text-slate-500">{expense.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBills.map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-slate-800">{bill.description}</p>
                        <Badge className={getCategoryColor(bill.category)}>{bill.category}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">Due: {bill.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{bill.amount}</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        <CreditCard className="w-3 h-3 mr-1" />
                        Pay Now
                      </Button>
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

export default Expenses;

