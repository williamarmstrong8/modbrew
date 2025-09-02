import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { 
  ArrowLeft, 
  Coffee, 
  Star, 
  X
} from 'lucide-react'

interface CoffeeItem {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  category: 'espresso' | 'filter' | 'cold' | 'specialty' | 'iced'
  origin: string
  roast: 'light' | 'medium' | 'dark'
  rating: number
  isPopular?: boolean
  isNew?: boolean
  image: string
  altitude: string
  process: string
  tastingNotes: string[]
  caffeine: string
  acidity: string
  body: string
  ingredients: string[]
  brewingMethod: string
  story: string
}

const coffeeMenu: CoffeeItem[] = [
  {
    id: '1',
    name: 'Iced Honey Cinnamon Latte',
    description: 'A perfectly balanced iced latte featuring the natural sweetness of honey and warm notes of cinnamon. Made with premium Blank Street coffee beans and creamy oat milk for a smooth, dairy-free experience.',
    shortDescription: 'Sweet honey and warm cinnamon in a smooth iced latte.',
    price: 6.50,
    category: 'iced',
    origin: 'Blank Street Coffee',
    roast: 'medium',
    rating: 4.8,
    isPopular: true,
    image: '/images/coffee-iced-honey-cinnamon.jpg',
    altitude: 'N/A',
    process: 'Espresso',
    tastingNotes: ['Honey', 'Cinnamon', 'Smooth', 'Sweet'],
    caffeine: 'Medium',
    acidity: 'Low',
    body: 'Medium',
    ingredients: ['Blank Street Coffee Beans', 'Oat Milk', 'Honey', 'Cinnamon'],
    brewingMethod: 'Espresso over ice with oat milk',
    story: 'Our signature iced honey cinnamon latte combines the rich, smooth flavor of Blank Street coffee with the natural sweetness of honey and the comforting warmth of cinnamon. Perfect for any time of day.'
  },
  {
    id: '2',
    name: 'Iced Maple Latte',
    description: 'A delightful iced latte featuring the rich, caramel-like sweetness of pure maple syrup. Made with premium Blank Street coffee beans and creamy oat milk for a smooth, dairy-free experience.',
    shortDescription: 'Rich maple sweetness in a smooth iced latte.',
    price: 6.50,
    category: 'iced',
    origin: 'Blank Street Coffee',
    roast: 'medium',
    rating: 4.7,
    image: '/images/coffee-iced-maple.jpg',
    altitude: 'N/A',
    process: 'Espresso',
    tastingNotes: ['Maple', 'Caramel', 'Smooth', 'Sweet'],
    caffeine: 'Medium',
    acidity: 'Low',
    body: 'Medium',
    ingredients: ['Blank Street Coffee Beans', 'Oat Milk', 'Pure Maple Syrup'],
    brewingMethod: 'Espresso over ice with oat milk',
    story: 'Experience the authentic taste of pure maple syrup in our iced maple latte. The rich, natural sweetness of maple perfectly complements the smooth, balanced flavor of Blank Street coffee.'
  },
  {
    id: '3',
    name: 'Iced Vanilla Latte',
    description: 'A classic iced latte featuring the smooth, sweet flavor of vanilla. Made with premium Blank Street coffee beans and creamy oat milk for a smooth, dairy-free experience.',
    shortDescription: 'Classic vanilla sweetness in a smooth iced latte.',
    price: 6.00,
    category: 'iced',
    origin: 'Blank Street Coffee',
    roast: 'medium',
    rating: 4.6,
    image: '/images/coffee-iced-vanilla.jpg',
    altitude: 'N/A',
    process: 'Espresso',
    tastingNotes: ['Vanilla', 'Smooth', 'Sweet', 'Creamy'],
    caffeine: 'Medium',
    acidity: 'Low',
    body: 'Medium',
    ingredients: ['Blank Street Coffee Beans', 'Oat Milk', 'Vanilla Syrup'],
    brewingMethod: 'Espresso over ice with oat milk',
    story: 'Our iced vanilla latte is a timeless favorite, featuring the smooth, sweet flavor of vanilla that perfectly complements the rich, balanced taste of Blank Street coffee.'
  },
  {
    id: '4',
    name: 'Iced Pumpkin Spice Latte',
    description: 'A seasonal favorite featuring the warm, aromatic spices of fall. Made with premium Blank Street coffee beans and creamy oat milk for a smooth, dairy-free experience.',
    shortDescription: 'Warm pumpkin spice in a smooth iced latte.',
    price: 6.75,
    category: 'iced',
    origin: 'Blank Street Coffee',
    roast: 'medium',
    rating: 4.9,
    isPopular: true,
    image: '/images/coffee-iced-pumpkin.jpg',
    altitude: 'N/A',
    process: 'Espresso',
    tastingNotes: ['Pumpkin', 'Cinnamon', 'Nutmeg', 'Cloves'],
    caffeine: 'Medium',
    acidity: 'Low',
    body: 'Medium',
    ingredients: ['Blank Street Coffee Beans', 'Oat Milk', 'Pumpkin Spice Syrup'],
    brewingMethod: 'Espresso over ice with oat milk',
    story: 'Embrace the flavors of fall with our iced pumpkin spice latte. The warm, aromatic blend of pumpkin and spices creates the perfect seasonal treat, made with our signature Blank Street coffee.'
  },
  {
    id: '5',
    name: 'Cold Brew',
    description: 'High-caffeine espresso pulled coffee, brewed cold for a smooth, bold flavor. Perfect for those who need an extra boost of energy with a smooth, low-acid profile.',
    shortDescription: 'High-caffeine cold brew with bold, smooth flavor.',
    price: 5.50,
    category: 'cold',
    origin: 'Espresso Blend',
    roast: 'dark',
    rating: 4.8,
    image: '/images/coffee-cold-brew.jpg',
    altitude: 'N/A',
    process: 'Cold Brew',
    tastingNotes: ['Bold', 'Smooth', 'Low Acid', 'Strong'],
    caffeine: 'Very High',
    acidity: 'Very Low',
    body: 'Full',
    ingredients: ['Premium Espresso Beans'],
    brewingMethod: 'Cold brewed for 18-24 hours',
    story: 'Our signature cold brew is made from high-caffeine espresso beans, cold brewed for 18-24 hours to extract maximum flavor with minimal acidity. Perfect for those who need an extra boost of energy.'
  }
]



export default function BrowseCoffee() {
  const navigate = useNavigate()
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeItem | null>(null)

  const allCoffees = coffeeMenu

  const getRoastColor = (roast: string) => {
    switch (roast) {
      case 'light': return 'bg-amber-300'
      case 'medium': return 'bg-amber-600'
      case 'dark': return 'bg-amber-900'
      default: return 'bg-gray-500'
    }
  }



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
              <h1 className="text-lg font-light tracking-wide">Coffee Gallery</h1>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence>
          {/* Hero Section */}
          <motion.div 
            key="hero-section"
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              key="hero-icon"
              className="mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Coffee className="h-20 w-20 mx-auto text-white/40 mb-4" />
            </motion.div>
            <motion.h1 
              key="hero-title"
              className="text-5xl font-light tracking-wide mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Coffee Gallery
            </motion.h1>
            <motion.p 
              key="hero-description"
              className="text-xl text-white/60 font-light max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Explore our curated collection of premium iced lattes and cold brew drinks. Click on any drink to discover its story, 
              tasting notes, and ingredients.
            </motion.p>
          </motion.div>



          {/* Coffee Gallery Grid */}
          <motion.div
            key="coffee-gallery-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {allCoffees.map((coffee, index) => (
              <motion.div
                key={`coffee-${coffee.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCoffee(coffee)}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full group hover:bg-white/10 transition-all duration-300 card-override overflow-hidden">
                  {/* Coffee Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-amber-900/20 to-amber-600/20 flex items-center justify-center">
                    <Coffee className="h-16 w-16 text-amber-400/60" />
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {coffee.isPopular && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Popular
                            </Badge>
                          )}
                          {coffee.isNew && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              New
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl font-medium text-white mb-2">
                          {coffee.name}
                        </CardTitle>
                        <CardDescription className="text-white/60 font-light text-sm">
                          {coffee.shortDescription}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Coffee Details */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-white/60">Origin: <span className="text-white">{coffee.origin}</span></span>
                          <div className="flex items-center space-x-1">
                            <span className="text-white/60">Roast:</span>
                            <div className={`w-3 h-3 rounded-full ${getRoastColor(coffee.roast)}`} />
                            <span className="text-white capitalize">{coffee.roast}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white">{coffee.rating}</span>
                        </div>
                      </div>

                      {/* Click to Explore */}
                      <div className="text-center pt-4 border-t border-white/10">
                        <span className="text-white/60 text-sm">Click to explore</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            key="contact-section"
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardContent className="p-8">
                <h3 className="text-2xl font-light text-white mb-4">Want to Try These Coffees?</h3>
                <p className="text-white/60 font-light mb-6">
                  Visit our cafe to experience these premium coffees in person. 
                  Our baristas are experts in brewing each blend to perfection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="flex items-center space-x-2 text-white/80">
                    <span>Visit our cafe</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <span>Call (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <span>Open daily 7AM-7PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Coffee Detail Modal */}
      <AnimatePresence>
        {selectedCoffee && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {selectedCoffee.isPopular && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Popular
                        </Badge>
                      )}
                      {selectedCoffee.isNew && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          New
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-3xl font-light text-white mb-2">{selectedCoffee.name}</h2>
                    <p className="text-white/60 font-light text-lg">{selectedCoffee.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedCoffee(null)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-8">
                {/* Coffee Image and Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-64 bg-gradient-to-br from-amber-900/20 to-amber-600/20 rounded-lg flex items-center justify-center">
                    <Coffee className="h-20 w-20 text-amber-400/60" />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white/60 text-sm">Origin</span>
                        </div>
                        <p className="text-white font-medium">{selectedCoffee.origin}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white/60 text-sm">Altitude</span>
                        </div>
                        <p className="text-white font-medium">{selectedCoffee.altitude}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white/60 text-sm">Process</span>
                        </div>
                        <p className="text-white font-medium">{selectedCoffee.process}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-white/60 text-sm">Rating</span>
                        </div>
                        <p className="text-white font-medium">{selectedCoffee.rating}/5.0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasting Notes */}
                <div>
                  <h3 className="text-xl font-medium text-white mb-4">Tasting Notes</h3>
                                      <div className="flex flex-wrap gap-2">
                      {selectedCoffee.tastingNotes.map((note, index) => (
                        <Badge key={`${selectedCoffee.id}-note-${index}`} className="bg-white/10 text-white border-white/20">
                          {note}
                        </Badge>
                      ))}
                    </div>
                </div>

                {/* Coffee Characteristics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-white/60 text-sm">Caffeine</span>
                    </div>
                    <p className="text-white font-medium">{selectedCoffee.caffeine}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-white/60 text-sm">Acidity</span>
                    </div>
                    <p className="text-white font-medium">{selectedCoffee.acidity}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Coffee className="h-4 w-4 text-amber-400" />
                      <span className="text-white/60 text-sm">Body</span>
                    </div>
                    <p className="text-white font-medium">{selectedCoffee.body}</p>
                  </div>
                </div>

                {/* Brewing Method */}
                <div>
                  <h3 className="text-xl font-medium text-white mb-4">Recommended Brewing</h3>
                  <p className="text-white/80">{selectedCoffee.brewingMethod}</p>
                </div>

                {/* Story */}
                <div>
                  <h3 className="text-xl font-medium text-white mb-4">The Story</h3>
                  <p className="text-white/80 leading-relaxed">{selectedCoffee.story}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
