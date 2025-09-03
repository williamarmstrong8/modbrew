import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Search, Plus, Eye, Mail } from "lucide-react";
import { useAdminContext } from "../contexts/AdminContext";
import { useState } from "react";

const Customers = () => {
  const { adminData } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Transform memberships data to customer format
  const customers = adminData.memberships.map((membership) => ({
    id: membership.id,
    name: membership.name || "Unknown",
    email: membership.email,
    phone: "N/A", // Not available in memberships table
    address: "N/A", // Not available in memberships table
    totalOrders: 0, // Not available in memberships table
    totalSpent: "$0.00", // Not available in memberships table
    lastVisit: new Date(membership.updated_at).toLocaleDateString(),
    status: membership.membership_type,
    role: membership.role || "Member", // Add role field from Supabase
    avatar: "/placeholder-avatar1.jpg"
  }));

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "vip": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "premium": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "basic": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-white/10 text-white/80 border-white/20";
    }
  };

  // Calculate real customer stats
  const customerStats = [
    { title: "Total Customers", value: adminData.stats.totalCustomers.toString(), change: "From sales data" },
    { title: "Total Members", value: adminData.stats.totalMembers.toString(), change: "Live data" },
    { title: "New Members This Week", value: adminData.stats.newMembersThisWeek.toString(), change: "Live data" },
    { title: "VIP Members", value: adminData.memberships.filter(m => m.membership_type === 'vip').length.toString(), change: "Live data" }
  ];

  // Show loading state
  if (adminData.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-lg text-white/60">Loading customer data...</p>
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
          <h1 className="text-3xl font-light text-white tracking-wide">Customers</h1>
          <p className="text-white/60 font-light text-lg">Manage your customer relationships and loyalty</p>
        </div>
        <Button className="bg-white text-black border-white hover:bg-gray-100 hover:border-gray-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat) => (
          <Card key={stat.title} className="bg-white/5 border-white/10 backdrop-blur-sm card-override hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">{stat.title}</p>
                  <p className="text-2xl font-light text-white">{stat.value}</p>
                  <p className="text-sm text-green-400">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/20"
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
        <CardHeader>
          <CardTitle className="text-xl font-light text-white">Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/40 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-light text-white mb-2">No customers found</h3>
                <p className="text-white/60">
                  {searchTerm ? `No customers match "${searchTerm}"` : "No customers have been added yet"}
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback className="bg-white/10 text-white">{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{customer.name}</h3>
                        <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{customer.role}</Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <Mail className="w-3 h-3" />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white text-black border-white">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black border-white/10 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white text-xl font-light">Member Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Member Header */}
                            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={customer.avatar} alt={customer.name} />
                                <AvatarFallback className="bg-white/10 text-white text-lg">{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-light text-white">{customer.name}</h3>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{customer.role}</Badge>
                                </div>
                              </div>
                            </div>
                            
                            {/* Member Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                  <h4 className="text-sm font-medium text-white/60 mb-2">Contact Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Mail className="w-4 h-4 text-white/40" />
                                      <span className="text-white">{customer.email}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                  <h4 className="text-sm font-medium text-white/60 mb-2">Membership Details</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-white/60">Type:</span>
                                      <span className="text-white">{customer.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-white/60">Role:</span>
                                      <span className="text-white">{customer.role}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-white/60">Member Since:</span>
                                      <span className="text-white">{customer.lastVisit}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                  <h4 className="text-sm font-medium text-white/60 mb-2">Activity Summary</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-white/60">Total Orders:</span>
                                      <span className="text-white">{customer.totalOrders}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-white/60">Total Spent:</span>
                                      <span className="text-white">{customer.totalSpent}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                  <h4 className="text-sm font-medium text-white/60 mb-2">Quick Actions</h4>
                                  <div className="space-y-2">
                                    <Button className="w-full bg-white text-black border-white hover:bg-white hover:text-black">
                                      <Mail className="w-4 h-4 mr-2" />
                                      Send Email
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
