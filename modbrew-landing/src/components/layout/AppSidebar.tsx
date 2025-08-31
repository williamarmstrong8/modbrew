import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  DollarSign,
  Receipt,
  Package,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "../ui/sidebar";

const menuItems = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "Customers", url: "/admin/customers", icon: Users },
  { title: "Sales", url: "/admin/sales", icon: DollarSign },
  { title: "Expenses", url: "/admin/expenses", icon: Receipt },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">☕</span>
          </div>
          <span className="font-bold text-xl text-slate-800">Mod Brew</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50">
                  <NavLink 
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Landing</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-amber-100 data-[active=true]:to-orange-100 data-[active=true]:text-amber-700">
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 text-slate-700 font-medium ${
                          isActive ? "text-amber-700" : ""
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

