import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { ArrowLeft } from 'lucide-react'

export default function ContactSupportPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <motion.header 
        className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/brewery')}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Button>
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <h1 className="text-lg font-light tracking-wide">Contact Support</h1>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-3xl font-light text-white mb-6 text-center">Get in Touch</h2>
              <p className="text-xl text-white/60 font-light mb-8 text-center">
                For support, questions, or inquiries, please email us at:
              </p>
              <div className="text-center mb-8">
                <a 
                  href="mailto:drinkmodbrew@gmail.com" 
                  className="text-2xl text-white underline hover:text-white/80 transition-colors"
                >
                  drinkmodbrew@gmail.com
                </a>
              </div>
              
              <Separator className="bg-white/10 mb-8" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-white mb-3">We can help with:</h3>
                  <ul className="space-y-3 text-white/80 font-light">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Product questions and orders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Event information and registration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Refund and return requests</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Member status and account issues</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Shipping and delivery inquiries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>General questions and feedback</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4">
                  <p className="text-white/60 font-light text-sm">
                    We typically respond within 24-48 hours. For urgent matters, please include "URGENT" in your subject line.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

