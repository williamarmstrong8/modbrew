import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

