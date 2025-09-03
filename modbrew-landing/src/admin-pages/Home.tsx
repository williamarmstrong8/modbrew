import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Users, DollarSign, TrendingUp, UserPlus, Minus } from "lucide-react";
import { useState } from "react";
import { useAdminContext } from "../contexts/AdminContext";
import { toast } from "sonner";

const Home = () => {
  // Daily Sales state
  const [salesDate, setSalesDate] = useState(() => {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    return easternTime.toISOString().split('T')[0];
  });
  const [customerCount, setCustomerCount] = useState("");
  const [grossSales, setGrossSales] = useState("");

  // Expenses state
  const [expenseDate, setExpenseDate] = useState(() => {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    return easternTime.toISOString().split('T')[0];
  });
  const [expenseName, setExpenseName] = useState("");
  const [expenseItem, setExpenseItem] = useState("");
  const [expensePrice, setExpensePrice] = useState("");

  // Use AdminContext for data
  const { adminData, addDailySale, addExpense } = useAdminContext();

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
      } catch (error) {
        console.error('Error adding daily sales:', error);
      }
    } else {
      toast.error('Please enter valid numbers for customer count and gross sales');
    }
  };

  const handleAddExpense = async () => {
    const price = parseFloat(expensePrice);
    
    if (expenseName.trim() && expenseItem.trim() && !isNaN(price) && price > 0) {
      try {
        await addExpense({
          purchased_at: expenseDate + 'T00:00:00Z', // Convert date to timestamp
          item_name: `${expenseName.trim()} - ${expenseItem.trim()}`, // Combine name and item
          price: price,
          purchaser: 'will' // Default purchaser, you can modify this logic
        });
        
        setExpenseName("");
        setExpenseItem("");
        setExpensePrice("");
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    } else {
      toast.error('Please fill in all fields with valid values');
    }
  };

  const stats = [
    { 
      title: "Total Revenue", 
      value: `$${adminData.stats.totalRevenue.toFixed(2)}`, 
      change: adminData.stats.totalRevenue > 0 ? "All-time total" : "No sales recorded", 
      icon: DollarSign, 
      color: "text-green-600" 
    },
    { 
      title: "Total Customers", 
      value: adminData.stats.totalCustomers.toString(), 
      change: adminData.stats.totalCustomers > 0 ? "From sales data" : "No customers recorded", 
      icon: Users, 
      color: "text-blue-600" 
    },
    { 
      title: "Total Members", 
      value: adminData.stats.totalMembers.toString(), 
      change: adminData.stats.totalMembers > 0 ? "All-time total" : "No members recorded", 
      icon: UserPlus, 
      color: "text-purple-600" 
    },
    { 
      title: "Total Profit", 
      value: `$${adminData.stats.totalProfit.toFixed(2)}`, 
      change: adminData.stats.totalProfit > 0 ? "Revenue - Expenses" : "No profit recorded", 
      icon: TrendingUp, 
      color: adminData.stats.totalProfit >= 0 ? "text-green-600" : "text-red-600" 
    }
  ];

  const quickActions = [
    { 
      title: "Sales", 
      icon: UserPlus, 
      color: "from-green-500 to-green-600",
      isModal: true,
      modalType: "sales"
    },
    { 
      title: "Expenses", 
      icon: Minus, 
      color: "from-blue-500 to-blue-600",
      isModal: true,
      modalType: "expense"
    },
  ];

  const recentOrders = adminData.dailySales.slice(0, 5).map((sale, index) => ({
    id: `#${String(index + 1).padStart(3, '0')}`,
    customer: `${sale.customer_count} customers`,
    items: `Daily sales`,
    total: `$${sale.gross_sales.toFixed(2)}`,
    time: new Date(sale.sales_date).toLocaleDateString()
  }));



  // Show loading state
  if (adminData.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading your business data...</p>
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
        <h1 className="text-3xl font-bold text-slate-800">Welcome to Mod Brew! ☕</h1>
        <p className="text-slate-600">Here's your business overview with live data from your database.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              action.isModal ? (
                <Dialog key={action.title}>
                  <DialogTrigger asChild>
                    <Button
                      className={`w-full h-14 bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-200 text-white border-0`}
                    >
                      <action.icon className="w-5 h-5 mr-3" />
                      {action.title}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {action.modalType === "sales" ? "Add Sales" : "Add Expense"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {action.modalType === "expense" ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input
                              type="date"
                              value={expenseDate}
                              onChange={(e) => setExpenseDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                              type="text"
                              placeholder="Enter name"
                              value={expenseName}
                              onChange={(e) => setExpenseName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Item</label>
                            <Input
                              type="text"
                              placeholder="Enter item"
                              value={expenseItem}
                              onChange={(e) => setExpenseItem(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Price ($)</label>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              value={expensePrice}
                              onChange={(e) => setExpensePrice(e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setExpenseName("");
                                setExpenseItem("");
                                setExpensePrice("");
                              }}
                            >
                              Clear
                            </Button>
                            <Button
                              className={`bg-gradient-to-r ${action.color}`}
                              onClick={handleAddExpense}
                            >
                              Add Expense
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input
                              type="date"
                              value={salesDate}
                              onChange={(e) => setSalesDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Customer Count</label>
                            <Input
                              type="number"
                              placeholder="Enter number of customers"
                              value={customerCount}
                              onChange={(e) => setCustomerCount(e.target.value)}
                              min="1"
                              step="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Sales ($)</label>
                            <Input
                              type="number"
                              placeholder="Enter sales amount"
                              value={grossSales}
                              onChange={(e) => setGrossSales(e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setCustomerCount("");
                                setGrossSales("");
                              }}
                            >
                              Clear
                            </Button>
                            <Button
                              className={`bg-gradient-to-r ${action.color}`}
                              onClick={handleAddDailySales}
                            >
                              Add Sales
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button
                  key={action.title}
                  className={`w-full h-14 bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-200 text-white border-0`}
                >
                  <action.icon className="w-5 h-5 mr-3" />
                  {action.title}
                </Button>
              )
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-800">{order.id} - {order.customer}</p>
                    <p className="text-sm text-slate-600">{order.items}</p>
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
      </div>


    </div>
  );
};

export default Home;

