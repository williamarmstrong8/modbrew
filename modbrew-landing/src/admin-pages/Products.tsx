import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, Search, Edit, Trash2, Package, TrendingUp, DollarSign, Star } from "lucide-react";

const Products = () => {
  const productStats = [
    { title: "Total Products", value: "47", change: "+3 this week", icon: Package, color: "text-blue-600" },
    { title: "In Stock", value: "42", change: "5 low stock", icon: TrendingUp, color: "text-green-600" },
    { title: "Out of Stock", value: "5", change: "2 restocked today", icon: DollarSign, color: "text-red-600" },
    { title: "Avg Price", value: "$6.50", change: "+$0.25 this month", icon: Star, color: "text-purple-600" }
  ];

  const products = [
    {
      id: "COF-001",
      name: "Cappuccino",
      category: "Hot Drinks",
      price: "$4.50",
      cost: "$1.20",
      stock: 45,
      status: "In Stock",
      sales: 89,
      revenue: "$400.50",
      image: "/placeholder-coffee1.jpg"
    },
    {
      id: "COF-002",
      name: "Americano",
      category: "Hot Drinks",
      price: "$3.75",
      cost: "$0.95",
      stock: 38,
      status: "In Stock",
      sales: 67,
      revenue: "$251.25",
      image: "/placeholder-coffee2.jpg"
    },
    {
      id: "COF-003",
      name: "Latte",
      category: "Hot Drinks",
      price: "$5.00",
      cost: "$1.35",
      stock: 32,
      status: "In Stock",
      sales: 54,
      revenue: "$270.00",
      image: "/placeholder-coffee3.jpg"
    },
    {
      id: "COF-004",
      name: "Cold Brew",
      category: "Cold Drinks",
      price: "$4.25",
      cost: "$1.10",
      stock: 28,
      status: "In Stock",
      sales: 42,
      revenue: "$178.50",
      image: "/placeholder-coffee4.jpg"
    },
    {
      id: "COF-005",
      name: "Espresso",
      category: "Hot Drinks",
      price: "$2.50",
      cost: "$0.65",
      stock: 0,
      status: "Out of Stock",
      sales: 35,
      revenue: "$87.50",
      image: "/placeholder-coffee5.jpg"
    },
    {
      id: "FOOD-001",
      name: "Croissant",
      category: "Pastries",
      price: "$3.25",
      cost: "$1.50",
      stock: 12,
      status: "Low Stock",
      sales: 23,
      revenue: "$74.75",
      image: "/placeholder-pastry1.jpg"
    },
    {
      id: "FOOD-002",
      name: "Muffin",
      category: "Pastries",
      price: "$2.75",
      cost: "$1.25",
      stock: 18,
      status: "In Stock",
      sales: 31,
      revenue: "$85.25",
      image: "/placeholder-pastry2.jpg"
    },
    {
      id: "FOOD-003",
      name: "Bagel",
      category: "Pastries",
      price: "$3.50",
      cost: "$1.75",
      stock: 8,
      status: "Low Stock",
      sales: 19,
      revenue: "$66.50",
      image: "/placeholder-pastry3.jpg"
    }
  ];

  const categories = [
    { name: "Hot Drinks", count: 4, revenue: "$1,008.75" },
    { name: "Cold Drinks", count: 1, revenue: "$178.50" },
    { name: "Pastries", count: 3, revenue: "$226.50" },
    { name: "Sandwiches", count: 2, revenue: "$145.00" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-800";
      case "Low Stock": return "bg-yellow-100 text-yellow-800";
      case "Out of Stock": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Hot Drinks": return "bg-amber-100 text-amber-800";
      case "Cold Drinks": return "bg-blue-100 text-blue-800";
      case "Pastries": return "bg-orange-100 text-orange-800";
      case "Sandwiches": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-600">Manage your coffee shop menu and inventory</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productStats.map((stat, index) => (
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

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="drinks">Drinks</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">All Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="p-6 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                          <Badge className={getCategoryColor(product.category)}>{product.category}</Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                        <p className="text-sm text-slate-600">ID: {product.id}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-800">{product.price}</span>
                          <span className="text-sm text-slate-500">Cost: {product.cost}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Stock</p>
                          <p className="font-medium text-slate-800">{product.stock} units</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Sales</p>
                          <p className="font-medium text-slate-800">{product.sales} sold</p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-sm text-slate-600">Revenue</p>
                        <p className="font-medium text-green-600">{product.revenue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drinks" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Drinks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.category.includes("Drinks")).map((product) => (
                  <div key={product.id} className="p-6 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-800">{product.price}</span>
                          <span className="text-sm text-slate-500">Stock: {product.stock}</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-sm text-slate-600">Revenue: {product.revenue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="food" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Food Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.category === "Pastries" || p.category === "Sandwiches").map((product) => (
                  <div key={product.id} className="p-6 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-800">{product.price}</span>
                          <span className="text-sm text-slate-500">Stock: {product.stock}</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-sm text-slate-600">Revenue: {product.revenue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Product Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div key={category.name} className="p-6 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-800">{category.name}</h3>
                      <p className="text-sm text-slate-600">{category.count} products</p>
                      <p className="text-sm font-medium text-green-600">{category.revenue} revenue</p>
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

export default Products;

