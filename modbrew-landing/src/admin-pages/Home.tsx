import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Users, DollarSign, Coffee, TrendingUp, UserPlus, Plus, Minus } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const [dailyCustomers, setDailyCustomers] = useState(0);
  const [customerInput, setCustomerInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    return easternTime.toISOString().split('T')[0];
  });

  const [totalMoney, setTotalMoney] = useState(0);
  const [moneyInput, setMoneyInput] = useState("");
  const [moneyDate, setMoneyDate] = useState(() => {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    return easternTime.toISOString().split('T')[0];
  });

  const [expenses, setExpenses] = useState<Array<{id: number, itemName: string, date: string, buyer: string}>>([]);
  const [expenseItemName, setExpenseItemName] = useState("");
  const [expenseDate, setExpenseDate] = useState(() => {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    return easternTime.toISOString().split('T')[0];
  });
  const [expenseBuyer, setExpenseBuyer] = useState("");

  const handleAddDailyCustomers = () => {
    const num = parseInt(customerInput);
    if (!isNaN(num) && num > 0) {
      setDailyCustomers(prev => prev + num);
      setCustomerInput("");
    }
  };

  const handleAddMoney = () => {
    const amount = parseFloat(moneyInput);
    if (!isNaN(amount) && amount > 0) {
      setTotalMoney(prev => prev + amount);
      setMoneyInput("");
    }
  };

  const handleAddExpense = () => {
    if (expenseItemName.trim() && expenseBuyer) {
      const newExpense = {
        id: Date.now(),
        itemName: expenseItemName.trim(),
        date: expenseDate,
        buyer: expenseBuyer
      };
      setExpenses(prev => [...prev, newExpense]);
      setExpenseItemName("");
      setExpenseBuyer("");
    }
  };

  const stats = [
    { 
      title: "Today's Revenue", 
      value: "$1,247", 
      change: "+12% from yesterday", 
      icon: DollarSign, 
      color: "text-green-600" 
    },
    { 
      title: "Active Customers", 
      value: "89", 
      change: "+5 new today", 
      icon: Users, 
      color: "text-blue-600" 
    },
    { 
      title: "Cups Served", 
      value: "234", 
      change: "Peak: 2:30 PM", 
      icon: Coffee, 
      color: "text-amber-600" 
    },
    { 
      title: "Avg Order Value", 
      value: "$8.50", 
      change: "+$0.75 this week", 
      icon: TrendingUp, 
      color: "text-purple-600" 
    }
  ];

  const quickActions = [
    { 
      title: "Add Daily Customers", 
      icon: UserPlus, 
      color: "from-green-500 to-green-600",
      isModal: true,
      modalType: "customers"
    },
    { 
      title: "Add Money", 
      icon: Plus, 
      color: "from-amber-500 to-amber-600",
      isModal: true,
      modalType: "money"
    },
    { 
      title: "Add Expense", 
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
                        {action.modalType === "customers" ? "Add Daily Customers" : 
                         action.modalType === "money" ? "Add Money" : "Add Expense"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {action.modalType === "expense" ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Item Name</label>
                            <Input
                              type="text"
                              placeholder="Enter item name"
                              value={expenseItemName}
                              onChange={(e) => setExpenseItemName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input
                              type="date"
                              value={expenseDate}
                              onChange={(e) => setExpenseDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Who Bought</label>
                            <Select value={expenseBuyer} onValueChange={setExpenseBuyer}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select buyer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mary">Mary</SelectItem>
                                <SelectItem value="will">Will</SelectItem>
                                <SelectItem value="ben">Ben</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="text-sm text-slate-600">
                            Total expenses: <span className="font-bold text-blue-600">{expenses.length}</span>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setExpenseItemName("");
                                setExpenseBuyer("");
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
                              value={action.modalType === "customers" ? selectedDate : moneyDate}
                              onChange={(e) => action.modalType === "customers" ? setSelectedDate(e.target.value) : setMoneyDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              {action.modalType === "customers" ? "Number of customers" : "Amount ($)"}
                            </label>
                            <Input
                              type={action.modalType === "customers" ? "number" : "number"}
                              placeholder={action.modalType === "customers" ? "Enter number of customers" : "Enter amount"}
                              value={action.modalType === "customers" ? customerInput : moneyInput}
                              onChange={(e) => action.modalType === "customers" ? setCustomerInput(e.target.value) : setMoneyInput(e.target.value)}
                              min="1"
                              step={action.modalType === "money" ? "0.01" : "1"}
                            />
                          </div>
                          <div className="text-sm text-slate-600">
                            {action.modalType === "customers" ? (
                              <>Current daily customers: <span className="font-bold text-green-600">{dailyCustomers}</span></>
                            ) : (
                              <>Total money: <span className="font-bold text-amber-600">${totalMoney.toFixed(2)}</span></>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => action.modalType === "customers" ? setCustomerInput("") : setMoneyInput("")}
                            >
                              Clear
                            </Button>
                            <Button
                              className={`bg-gradient-to-r ${action.color}`}
                              onClick={action.modalType === "customers" ? handleAddDailyCustomers : handleAddMoney}
                            >
                              {action.modalType === "customers" ? "Add Customers" : "Add Money"}
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

