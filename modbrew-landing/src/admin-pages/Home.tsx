import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Users, DollarSign, Coffee, TrendingUp, UserPlus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

const Home = () => {
  // Revenue state
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true);

  // Customers state
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

  // Expenses state
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);

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
  const [customItem, setCustomItem] = useState("");
  const [expensePrice, setExpensePrice] = useState("");

  // Fetch total revenue, customers, and expenses from database
  const fetchTotalRevenue = async () => {
    try {
      // Fetch sales data
      const { data: salesData, error: salesError } = await supabase
        .from('daily_sales')
        .select('gross_sales, customer_count');

      if (salesError) {
        console.error('Error fetching sales data:', salesError);
        return;
      }

      // Fetch expenses data
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('price');

      if (expensesError) {
        console.error('Error fetching expenses data:', expensesError);
        return;
      }

      const totalRevenue = salesData?.reduce((sum, sale) => sum + (sale.gross_sales || 0), 0) || 0;
      const totalCustomers = salesData?.reduce((sum, sale) => sum + (sale.customer_count || 0), 0) || 0;
      const totalExpenses = expensesData?.reduce((sum, expense) => sum + (expense.price || 0), 0) || 0;
      
      setTotalRevenue(totalRevenue);
      setTotalCustomers(totalCustomers);
      setTotalExpenses(totalExpenses);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingRevenue(false);
      setIsLoadingCustomers(false);
      setIsLoadingExpenses(false);
    }
  };

  // Load total revenue on component mount
  useEffect(() => {
    fetchTotalRevenue();
  }, []);

  const handleAddDailySales = async () => {
    const customerCountNum = parseInt(customerCount);
    const grossSalesNum = parseFloat(grossSales);
    
    if (!isNaN(customerCountNum) && customerCountNum > 0 && !isNaN(grossSalesNum) && grossSalesNum > 0) {
      try {
        const { error } = await supabase
          .from('daily_sales')
          .insert({
            sales_date: salesDate,
            customer_count: customerCountNum,
            gross_sales: grossSalesNum
          });

        if (error) {
          toast.error('Error adding daily sales: ' + error.message);
        } else {
          toast.success('Daily sales added successfully!');
          setCustomerCount("");
          setGrossSales("");
          // Refresh total revenue after adding new sales
          fetchTotalRevenue();
        }
      } catch (error) {
        toast.error('Error adding daily sales');
        console.error('Error:', error);
      }
    } else {
      toast.error('Please enter valid numbers for customer count and gross sales');
    }
  };

  const handleAddExpense = async () => {
    const price = parseFloat(expensePrice);
    const selectedItem = expenseItem === "other" ? customItem.trim() : expenseItem;
    
    if (expenseName.trim() && selectedItem && !isNaN(price) && price > 0) {
      try {
        const { error } = await supabase
          .from('expenses')
          .insert({
            purchased_at: expenseDate + 'T00:00:00Z', // Convert date to timestamp
            item_name: `${expenseName.trim()} - ${selectedItem}`, // Combine name and item
            price: price,
            purchaser: 'will' // Default purchaser, you can modify this logic
          });

        if (error) {
          toast.error('Error adding expense: ' + error.message);
        } else {
          toast.success('Expense added successfully!');
          setExpenseName("");
          setExpenseItem("");
          setCustomItem("");
          setExpensePrice("");
          // Refresh total expenses after adding new expense
          fetchTotalRevenue();
        }
      } catch (error) {
        toast.error('Error adding expense');
        console.error('Error:', error);
      }
    } else {
      toast.error('Please fill in all fields with valid values');
    }
  };

  const stats = [
    { 
      title: "Total Revenue", 
      value: isLoadingRevenue ? "Loading..." : `$${totalRevenue.toLocaleString()}`, 
      change: "All time sales", 
      icon: DollarSign, 
      color: "text-green-600" 
    },
    { 
      title: "Total Customers", 
      value: isLoadingCustomers ? "Loading..." : totalCustomers.toLocaleString(), 
      change: "All time customers", 
      icon: Users, 
      color: "text-blue-600" 
    },
    { 
      title: "Total Expenses", 
      value: isLoadingExpenses ? "Loading..." : `$${totalExpenses.toLocaleString()}`, 
      change: "All time expenses", 
      icon: Coffee, 
      color: "text-amber-600" 
    },
    { 
      title: "Avg Order Value", 
      value: isLoadingRevenue || isLoadingCustomers ? "Loading..." : 
             totalCustomers > 0 ? `$${(totalRevenue / totalCustomers).toFixed(2)}` : "$0.00", 
      change: "Revenue per customer", 
      icon: TrendingUp, 
      color: "text-purple-600" 
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

  const recentOrders = [
    { id: "#001", customer: "Sarah Johnson", items: "Cappuccino, Croissant", total: "$12.50", time: "2 min ago" },
    { id: "#002", customer: "Mike Chen", items: "Americano, Muffin", total: "$8.75", time: "5 min ago" },
    { id: "#003", customer: "Emma Davis", items: "Latte, Bagel", total: "$10.25", time: "8 min ago" },
    { id: "#004", customer: "Alex Rodriguez", items: "Espresso, Danish", total: "$9.50", time: "12 min ago" },
    { id: "#005", customer: "Lisa Wang", items: "Cold Brew, Sandwich", total: "$14.00", time: "15 min ago" },
  ];



  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Good morning! ☕</h1>
        <p className="text-slate-600">Here's what's happening at Mod Brew today.</p>
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
                            <Select value={expenseItem} onValueChange={setExpenseItem}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an item" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="milk">Milk</SelectItem>
                                <SelectItem value="syrup">Syrup</SelectItem>
                                <SelectItem value="cups">Cups</SelectItem>
                                <SelectItem value="coffee">Coffee</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {expenseItem === "other" && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Custom Item</label>
                              <Input
                                type="text"
                                placeholder="Enter custom item name"
                                value={customItem}
                                onChange={(e) => setCustomItem(e.target.value)}
                              />
                            </div>
                          )}
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

