import { motion } from 'framer-motion'
import Navigation from '../components/layout/Navigation'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'

export default function PreorderPage() {
  const { user } = useAuth()
  const isLoggedIn = !!user
  const price = isLoggedIn ? 49 : 59

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navigation />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Order Details - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Product Image - Much Smaller */}
                <div className="md:w-64 h-48 md:h-auto bg-black/20 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <img 
                    src="/images/hoodie-mockup.png" 
                    alt="Mod Brew Hoodie" 
                    className="h-full w-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/10 text-white/90 border-white/20 backdrop-blur-sm text-xs">
                    Featured
                  </Badge>
                </div>
                
                {/* Product Details */}
                <div className="flex flex-col flex-1">
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-2xl font-light text-white mb-2">
                      Mod Brew Hoodie
                    </CardTitle>
                    <p className="text-white/60 font-light text-sm">
                      A limited edition pullover hoodie crafted exclusively for ModBrew members
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-3xl font-light text-white">${price}</div>
                    </div>
                    
                    <Separator className="bg-white/10" />
                    
                    <div>
                      <h3 className="text-white/40 text-sm font-medium uppercase tracking-wide mb-2">
                        Description
                      </h3>
                      <p className="text-white/80 font-light text-sm leading-relaxed">
                        Experience premium comfort with our exclusive Mod Brew hoodie. Made from high-quality materials, 
                        this pullover features our signature branding and is perfect for representing your ModBrew membership 
                        in style.
                      </p>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Payment Information - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col relative z-10"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-white mb-4">Preorder</h1>
              <p className="text-xl text-white/60 font-light">
                Complete your order below
              </p>
            </div>

            {/* Payment Instructions */}
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-medium text-white mb-3">Payment Instructions</h3>
                <p className="text-white/80 font-light leading-relaxed mb-4">
                  To complete your preorder, please send <span className="font-semibold text-white">${price}</span> via Venmo to:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                  <p className="text-2xl font-bold text-white text-center">@William-Armstrong-79</p>
                </div>
                <p className="text-white/60 text-sm font-light">
                  Please include your email & caption "ModBrew Hoodie" in the Venmo note so we can confirm your order.
                </p>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <h3 className="text-xl font-medium text-white mb-3">Shipping Information</h3>
                <p className="text-white/80 font-light leading-relaxed">
                  Your order will be processed and shipped within <span className="font-semibold text-white">2 weeks</span> of payment confirmation. 
                  You'll receive a tracking number via email once your hoodie ships.
                </p>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <h3 className="text-xl font-medium text-white mb-3">Order Confirmation</h3>
                <p className="text-white/80 font-light leading-relaxed">
                  After sending your Venmo payment, you'll receive an email confirmation within 24 hours. 
                  If you don't receive a confirmation email or have any questions, please contact us at{' '}
                  <a 
                    href="mailto:drinkmodbrew@gmail.com" 
                    className="text-white underline hover:text-white/80 transition-colors"
                  >
                    drinkmodbrew@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto relative z-10" style={{ pointerEvents: 'auto' }}>
              <Button 
                type="button"
                className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12 text-lg cursor-pointer relative z-10"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open('https://venmo.com/William-Armstrong-79', '_blank')
                }}
              >
                Open Venmo
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

