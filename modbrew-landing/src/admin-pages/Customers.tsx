import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Search, Plus, Mail, Phone, MapPin } from "lucide-react";

const Customers = () => {
  const customers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Downtown",
      totalOrders: 47,
      totalSpent: "$342.50",
      lastVisit: "2 hours ago",
      status: "VIP",
      initials: "SJ"
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, Midtown",
      totalOrders: 23,
      totalSpent: "$189.75",
      lastVisit: "1 day ago",
      status: "Regular",
      initials: "MC"
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "(555) 345-6789",
      address: "789 Pine St, Uptown",
      totalOrders: 15,
      totalSpent: "$127.25",
      lastVisit: "3 days ago",
      status: "Regular",
      initials: "ED"
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      email: "alex.r@email.com",
      phone: "(555) 456-7890",
      address: "321 Elm St, Downtown",
      totalOrders: 8,
      totalSpent: "$67.50",
      lastVisit: "1 week ago",
      status: "New",
      initials: "AR"
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      phone: "(555) 567-8901",
      address: "654 Maple Dr, Suburbs",
      totalOrders: 31,
      totalSpent: "$245.00",
      lastVisit: "4 hours ago",
      status: "VIP",
      initials: "LW"
    },
    {
      id: 6,
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "(555) 678-9012",
      address: "987 Cedar Ln, Midtown",
      totalOrders: 12,
      totalSpent: "$98.75",
      lastVisit: "2 days ago",
      status: "Regular",
      initials: "DK"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "bg-purple-100 text-purple-800";
      case "Regular": return "bg-blue-100 text-blue-800";
      case "New": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const customerStats = [
    { title: "Total Customers", value: "1,247", change: "+23 this week" },
    { title: "VIP Members", value: "89", change: "+5 this month" },
    { title: "New This Week", value: "34", change: "+12% from last week" },
    { title: "Avg Order Value", value: "$8.50", change: "+$0.75 this month" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-600">Manage your customer relationships and loyalty</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat, index) => (
          <Card key={stat.title} className="border-0 bg-white/80 backdrop-blur-sm" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search customers..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-6 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{customer.initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-slate-800">{customer.name}</h3>
                      <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{customer.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm text-slate-600">
                    {customer.totalOrders} orders • {customer.totalSpent} spent
                  </div>
                  <div className="text-xs text-slate-500">Last visit: {customer.lastVisit}</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;

