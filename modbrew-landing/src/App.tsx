import { Routes, Route } from 'react-router-dom'
import { TooltipProvider } from './components/ui/tooltip'
import { SidebarProvider } from './components/ui/sidebar'
import LandingPage from './pages/LandingPage'
import GalleryPage from './pages/GalleryPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './admin-pages/Home'
import Customers from './admin-pages/Customers'
import Sales from './admin-pages/Sales'
import Expenses from './admin-pages/Expenses'
import Products from './admin-pages/Products'
import Analytics from './admin-pages/Analytics'
import NotFound from './admin-pages/NotFound'
import './App.css'

function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admin" element={
          <SidebarProvider>
            <DashboardLayout />
          </SidebarProvider>
        }>
          <Route index element={<Home />} />
          <Route path="customers" element={<Customers />} />
          <Route path="sales" element={<Sales />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="products" element={<Products />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </TooltipProvider>
  )
}

export default App
