import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import DatePicker from "../components/ui/date-picker";
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
  const [expenseItem, setExpenseItem] = useState("");
  const [expensePrice, setExpensePrice] = useState("");
  const [expensePurchaser, setExpensePurchaser] = useState<"will" | "mary" | "ben">("will");

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
    
    if (expenseItem.trim() && !isNaN(price) && price > 0 && expensePurchaser) {
      try {
        await addExpense({
          purchased_at: expenseDate + 'T00:00:00Z', // Convert date to timestamp
          item_name: expenseItem.trim(), // Use just the item description
          price: price,
          purchaser: expensePurchaser
        });
        
        setExpenseItem("");
        setExpensePrice("");
        setExpensePurchaser("will");
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
      color: "text-green-400" 
    },
    { 
      title: "Total Customers", 
      value: adminData.stats.totalCustomers.toString(), 
      change: adminData.stats.totalCustomers > 0 ? "From sales data" : "No customers recorded", 
      icon: Users, 
      color: "text-blue-400" 
    },
    { 
      title: "Total Members", 
      value: adminData.stats.totalMembers.toString(), 
      change: adminData.stats.totalMembers > 0 ? "All-time total" : "No members recorded", 
      icon: UserPlus, 
      color: "text-purple-400" 
    },
    { 
      title: "Total Profit", 
      value: `$${adminData.stats.totalProfit.toFixed(2)}`, 
      change: adminData.stats.totalProfit > 0 ? "Revenue - Expenses" : "No profit recorded", 
      icon: TrendingUp, 
      color: adminData.stats.totalProfit >= 0 ? "text-green-400" : "text-red-400" 
    }
  ];

  const quickActions = [
    { 
      title: "Sales", 
      icon: UserPlus, 
      isModal: true,
      modalType: "sales"
    },
    { 
      title: "Expenses", 
      icon: Minus, 
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-lg text-white/60">Loading your business data...</p>
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
          <h1 className="text-3xl font-light text-white tracking-wide">Welcome to Mod Brew! ☕</h1>
          <p className="text-white/60 font-light text-lg">Here's your business overview with live data from your database.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 bg-white/5 border-white/10 backdrop-blur-sm card-override h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-light text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {quickActions.map((action) => (
              action.isModal ? (
                <Dialog key={action.title}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full h-14 bg-white text-black border-white hover:bg-white hover:text-black transition-all duration-200"
                    >
                      <action.icon className="w-5 h-5 mr-3" />
                      {action.title}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        {action.modalType === "sales" ? "Add Sales" : "Add Expense"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {action.modalType === "expense" ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Date</label>
                            <DatePicker
                              value={expenseDate}
                              onChange={setExpenseDate}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Item</label>
                            <Input
                              type="text"
                              placeholder="Enter item description"
                              value={expenseItem}
                              onChange={(e) => setExpenseItem(e.target.value)}
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Price ($)</label>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              value={expensePrice}
                              onChange={(e) => setExpensePrice(e.target.value)}
                              min="0"
                              step="0.01"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Purchaser</label>
                            <Select value={expensePurchaser} onValueChange={(value: "will" | "mary" | "ben") => setExpensePurchaser(value)}>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-white/20">
                                <SelectValue placeholder="Select purchaser" />
                              </SelectTrigger>
                              <SelectContent className="bg-black border-white/10">
                                <SelectItem value="mary" className="text-white hover:bg-white/10">Mary</SelectItem>
                                <SelectItem value="will" className="text-white hover:bg-white/10">Will</SelectItem>
                                <SelectItem value="ben" className="text-white hover:bg-white/10">Ben</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setExpenseItem("");
                                setExpensePrice("");
                              }}
                              className="bg-white text-black border-white hover:bg-white hover:text-black"
                            >
                              Clear
                            </Button>
                            <Button
                              className="bg-white text-black border-white hover:bg-white hover:text-black"
                              onClick={handleAddExpense}
                            >
                              Add Expense
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
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
                            <label className="text-sm font-medium text-white">Sales ($)</label>
                            <Input
                              type="number"
                              placeholder="Enter sales amount"
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
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button
                  key={action.title}
                  className="w-full h-14 bg-white text-black border-white hover:bg-white hover:text-black transition-all duration-200"
                >
                  <action.icon className="w-5 h-5 mr-3" />
                  {action.title}
                </Button>
              )
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm card-override">
          <CardHeader>
            <CardTitle className="text-xl font-light text-white">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
                  <div className="space-y-1">
                    <p className="font-medium text-white">{order.id} - {order.customer}</p>
                    <p className="text-sm text-white/60">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{order.total}</p>
                    <p className="text-xs text-white/40">{order.time}</p>
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

