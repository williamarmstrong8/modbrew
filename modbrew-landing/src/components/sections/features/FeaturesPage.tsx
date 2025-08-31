import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { BarChart3, Users, Coffee, Settings, Clock, DollarSign } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
            Powerful Features for Your Coffee Business
          </h1>
          <p className="text-xl text-amber-700 mb-8 max-w-3xl mx-auto">
            Discover all the tools and features that make ModBrew the perfect solution for coffee shop management.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-amber-600 mb-4" />
                <CardTitle className="text-amber-900">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  Track sales performance, customer trends, and business insights with detailed analytics and reporting.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-amber-600 mb-4" />
                <CardTitle className="text-amber-900">Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  Build lasting relationships with your customers through comprehensive management tools and loyalty programs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Coffee className="h-12 w-12 text-amber-600 mb-4" />
                <CardTitle className="text-amber-900">Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  Manage your coffee inventory, track stock levels, and optimize your product offerings with smart alerts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Settings className="h-12 w-12 text-amber-600 mb-4" />
                <CardTitle className="text-amber-900">Easy Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  Get started in minutes with our intuitive setup process and comprehensive onboarding experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-amber-600 mb-4" />
                <CardTitle className="text-amber-900">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  Stay updated with real-time data synchronization across all your devices and locations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-amber-600 mb-4" />
                <CardTitle className="text-amber-900">Financial Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  Monitor expenses, track revenue, and manage your coffee shop's financial health with detailed reports.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
