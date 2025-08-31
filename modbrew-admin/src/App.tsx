import { Routes, Route } from 'react-router-dom'
import { TooltipProvider } from './components/ui/tooltip'
import { SidebarProvider } from './components/ui/sidebar'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home'
import Customers from './pages/Customers'
import Sales from './pages/Sales'
import Expenses from './pages/Expenses'
import Products from './pages/Products'
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="customers" element={<Customers />} />
            <Route path="sales" element={<Sales />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="products" element={<Products />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App

