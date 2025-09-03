import { Routes, Route } from 'react-router-dom'
import { TooltipProvider } from './components/ui/tooltip'
import { SidebarProvider } from './components/ui/sidebar'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { AdminProvider } from './contexts/AdminContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthPage } from './components/auth/AuthPage'
import LandingPage from './pages/LandingPage'
import GalleryPage from './pages/GalleryPage'
import MemberHub from './pages/MemberHub'
import WeeklyChallenge from './pages/WeeklyChallenge'
import ChallengeSubmissions from './pages/ChallengeSubmissions'
import BrowseCoffee from './pages/BrowseCoffee'
import AccountSettings from './pages/AccountSettings'
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
    <AuthProvider>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/auth" element={
            <ProtectedRoute requireAuth={false}>
              <AuthPage />
            </ProtectedRoute>
          } />
          <Route path="/brewery" element={
            <ProtectedRoute requireAuth={true}>
              <MemberHub />
            </ProtectedRoute>
          } />
          <Route path="/brewery/account" element={
            <ProtectedRoute requireAuth={true}>
              <AccountSettings />
            </ProtectedRoute>
          } />
          <Route path="/weekly-challenge" element={
            <ProtectedRoute requireAuth={true}>
              <WeeklyChallenge />
            </ProtectedRoute>
          } />
          <Route path="/challenge-submissions" element={
            <ProtectedRoute requireAuth={true}>
              <ChallengeSubmissions />
            </ProtectedRoute>
          } />
          <Route path="/coffee" element={
            <ProtectedRoute requireAuth={true}>
              <BrowseCoffee />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAuth={true}>
              <AdminProvider>
                <SidebarProvider>
                  <DashboardLayout />
                </SidebarProvider>
              </AdminProvider>
            </ProtectedRoute>
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
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  )
}

export default App
