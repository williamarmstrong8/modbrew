import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Coffee, Heart, Users, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
            About ModBrew
          </h1>
          <p className="text-xl text-amber-700 mb-8 max-w-3xl mx-auto">
            We're passionate about helping coffee shop owners succeed with technology that's as rich and complex as the perfect cup of coffee.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-amber-900 mb-6">Our Story</h2>
              <p className="text-lg text-amber-700 mb-6">
                ModBrew was born from a simple observation: coffee shop owners were spending more time on paperwork 
                than perfecting their craft. We saw an opportunity to create a solution that would let them focus 
                on what they do best - creating amazing coffee experiences.
              </p>
              <p className="text-lg text-amber-700 mb-6">
                Founded by coffee enthusiasts and technology experts, ModBrew combines the warmth of coffee culture 
                with the efficiency of modern software. We believe that every coffee shop deserves tools that are 
                as carefully crafted as their signature blend.
              </p>
            </div>
            <div className="bg-amber-100 rounded-lg p-8">
              <Coffee className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-amber-900 text-center mb-4">Our Mission</h3>
              <p className="text-amber-700 text-center">
                To empower coffee shop owners with intuitive technology that helps them grow their business 
                while staying true to their passion for exceptional coffee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">Our Values</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              The principles that guide everything we do at ModBrew.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-amber-900">Passion</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  We're driven by our love for coffee and the communities that coffee shops create.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-amber-900">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  We believe in supporting the coffee community and helping each other succeed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-amber-900">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-amber-700">
                  We strive for excellence in everything we do, from our code to our customer service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">Meet the Team</h2>
          <p className="text-xl text-amber-700 mb-12 max-w-2xl mx-auto">
            A passionate group of coffee lovers and technology experts working together to make your coffee business thrive.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Coffee className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Coffee Enthusiasts</h3>
                <p className="text-amber-700">Our team includes certified baristas and coffee roasters who understand the industry from the inside out.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Tech Experts</h3>
                <p className="text-amber-700">Experienced developers and designers who create intuitive, powerful software solutions.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Business Partners</h3>
                <p className="text-amber-700">We work closely with coffee shop owners to understand their needs and challenges.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
