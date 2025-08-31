import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small coffee shops just getting started',
      features: [
        'Up to 100 transactions/month',
        'Basic inventory management',
        'Customer database',
        'Email support',
        'Basic analytics'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Ideal for growing coffee businesses',
      features: [
        'Unlimited transactions',
        'Advanced inventory management',
        'Customer loyalty programs',
        'Priority support',
        'Advanced analytics',
        'Multi-location support',
        'Staff management'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$149',
      period: '/month',
      description: 'For large coffee chains and franchises',
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom reporting',
        'API access',
        'White-label options'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-amber-700 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your coffee business. All plans include a 30-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative hover:shadow-lg transition-shadow ${
                  plan.popular ? 'ring-2 ring-amber-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-amber-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-amber-600">{plan.price}</span>
                    <span className="text-amber-700">{plan.period}</span>
                  </div>
                  <CardDescription className="text-amber-700 mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0" />
                        <span className="text-amber-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                        : 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
