import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const productImages = [
  { src: '/images/hoodie-mockup.png', alt: 'Mod Brew Hoodie', featured: true },
  { src: '/images/mockup2.png', alt: 'Mod Brew Hoodie Detail', featured: false }
]

export default function StorePage() {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

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
          {/* Product Images Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img 
                    src={productImages[currentImageIndex].src} 
                    alt={productImages[currentImageIndex].alt} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {productImages[currentImageIndex].featured && (
                    <Badge className="absolute top-4 left-4 bg-white/10 text-white/90 border-white/20 backdrop-blur-sm">
                      Featured
                    </Badge>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-white h-10 w-10 rounded-full p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-white h-10 w-10 rounded-full p-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 w-2 hover:bg-white/60'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col relative z-10"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="mb-6">
              <h2 className="text-5xl font-bold text-white mb-4">
                Mod Brew Hoodie
              </h2>
              <p className="text-white/60 font-light text-lg leading-relaxed mb-0">
                A limited edition pullover hoodie crafted exclusively for ModBrew members. Premium quality with the iconic Mod Brew branding.
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-light text-white mb-2">
                $59
              </div>
            </div>

            <Separator className="bg-white/10 mb-6" />

            {/* Product Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-white/40 text-sm font-medium uppercase tracking-wide mb-2">
                  Description
                </h3>
                <p className="text-white/80 font-light leading-relaxed">
                  Experience premium comfort with our exclusive Mod Brew hoodie. Made from high-quality materials, 
                  this pullover features our signature branding and is perfect for representing your ModBrew membership 
                  in style. The classic design pairs perfectly with any outfit while showcasing your connection to the 
                  ModBrew community.
                </p>
              </div>

              <div>
                <h3 className="text-white/40 text-sm font-medium uppercase tracking-wide mb-2">
                  Features
                </h3>
                <ul className="space-y-2 text-white/80 font-light">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Classic pullover design with front kangaroo pocket</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Iconic Mod Brew chest branding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Comfortable fit for everyday wear</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Exclusive member-only product</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 relative z-10" style={{ pointerEvents: 'auto' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1" style={{ pointerEvents: 'auto' }}>
                  <Button 
                    type="button"
                    className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12 text-lg cursor-pointer relative z-10"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Preorder button clicked')
                      navigate('/preorder')
                    }}
                  >
                    Preorder
                  </Button>
                </div>
                <div className="flex-1 flex flex-col relative z-10">
                  <Button 
                    type="button"
                    className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12 text-lg relative z-10 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      navigate('/auth?mode=signup')
                    }}
                  >
                    Signup/Login
                  </Button>
                  <p className="text-emerald-400 text-sm font-light text-left mt-2">
                    10$ discount for members
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

