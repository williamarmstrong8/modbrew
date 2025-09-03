import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  DollarSign,
  Receipt,
  Coffee,
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
];

const breweryButton = {
  title: "Return to Brewery",
  url: "/brewery",
  icon: Coffee,
};

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/10 bg-black backdrop-blur-sm">
      <SidebarHeader className="pt-8 pb-2 px-6 border-b border-white/10">
        <div className="flex items-center justify-start">
          <img 
            src="/images/Mod Brew Long.png" 
            alt="Mod Brew Logo" 
            className="w-40 h-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 rounded-lg transition-all duration-200 hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 text-white/80 font-medium transition-all duration-200 ${
                          isActive ? "text-white" : "hover:text-white"
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
            
            {/* Separator */}
            <div className="my-4 border-t border-white/10" />
            
            {/* Return to Brewery Button */}
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 rounded-lg transition-all duration-200 hover:bg-white/10 text-white/80 font-medium">
                  <NavLink to={breweryButton.url} className="flex items-center gap-3 px-4 py-3 hover:text-white transition-all duration-200">
                    <breweryButton.icon className="w-5 h-5" />
                    <span>{breweryButton.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

