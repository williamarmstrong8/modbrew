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
  X,
  Search,
  Clock,
  MapPin,
  Phone,
  Leaf,
  Thermometer,
  Droplets,
  Zap
} from 'lucide-react'

interface CoffeeItem {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  category: 'espresso' | 'filter' | 'cold' | 'specialty'
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
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright, floral notes with hints of jasmine and citrus. A light roast that showcases the natural sweetness of Ethiopian beans.',
    shortDescription: 'Bright, floral notes with hints of jasmine and citrus.',
    price: 18.50,
    category: 'filter',
    origin: 'Ethiopia',
    roast: 'light',
    rating: 4.8,
    isPopular: true,
    image: '/images/coffee-ethiopian.jpg',
    altitude: '1,750 - 2,200m',
    process: 'Washed',
    tastingNotes: ['Jasmine', 'Citrus', 'Bergamot', 'Honey'],
    caffeine: 'Medium-High',
    acidity: 'Bright',
    body: 'Light-Medium',
    ingredients: ['100% Arabica Beans', 'Ethiopian Yirgacheffe'],
    brewingMethod: 'Pour-over, French Press, Aeropress',
    story: 'Grown in the highlands of Ethiopia, this coffee is known for its distinctive floral and citrus notes. The Yirgacheffe region produces some of the world\'s most unique and sought-after coffees.'
  },
  {
    id: '2',
    name: 'Colombian Supremo',
    description: 'Rich, balanced flavor with notes of caramel and chocolate. Medium roast with a smooth, full-bodied finish.',
    shortDescription: 'Rich, balanced flavor with notes of caramel and chocolate.',
    price: 16.99,
    category: 'espresso',
    origin: 'Colombia',
    roast: 'medium',
    rating: 4.6,
    image: '/images/coffee-colombian.jpg',
    altitude: '1,200 - 2,000m',
    process: 'Washed',
    tastingNotes: ['Caramel', 'Chocolate', 'Nuts', 'Red Apple'],
    caffeine: 'Medium',
    acidity: 'Balanced',
    body: 'Full',
    ingredients: ['100% Arabica Beans', 'Colombian Supremo'],
    brewingMethod: 'Espresso, Moka Pot, Drip Coffee',
    story: 'Colombian Supremo represents the highest grade of Colombian coffee, known for its consistent quality and balanced flavor profile that works beautifully in espresso.'
  },
  {
    id: '3',
    name: 'Sumatra Mandheling',
    description: 'Deep, earthy tones with hints of cedar and spice. Dark roast with low acidity and a heavy body.',
    shortDescription: 'Deep, earthy tones with hints of cedar and spice.',
    price: 17.50,
    category: 'espresso',
    origin: 'Indonesia',
    roast: 'dark',
    rating: 4.7,
    image: '/images/coffee-sumatra.jpg',
    altitude: '1,100 - 1,500m',
    process: 'Semi-washed',
    tastingNotes: ['Cedar', 'Spice', 'Earth', 'Dark Chocolate'],
    caffeine: 'Medium-Low',
    acidity: 'Low',
    body: 'Heavy',
    ingredients: ['100% Arabica Beans', 'Sumatra Mandheling'],
    brewingMethod: 'Espresso, French Press, Cold Brew',
    story: 'This Indonesian coffee is known for its unique processing method and distinctive earthy flavor profile, making it perfect for those who prefer bold, full-bodied coffees.'
  },
  {
    id: '4',
    name: 'Guatemala Antigua',
    description: 'Complex flavor profile with notes of cocoa, spice, and a hint of smoke. Medium-dark roast with excellent balance.',
    shortDescription: 'Complex flavor profile with notes of cocoa, spice, and a hint of smoke.',
    price: 19.99,
    category: 'filter',
    origin: 'Guatemala',
    roast: 'medium',
    rating: 4.9,
    isNew: true,
    image: '/images/coffee-guatemala.jpg',
    altitude: '1,500 - 1,700m',
    process: 'Washed',
    tastingNotes: ['Cocoa', 'Spice', 'Smoke', 'Tobacco'],
    caffeine: 'Medium',
    acidity: 'Medium',
    body: 'Medium-Full',
    ingredients: ['100% Arabica Beans', 'Guatemala Antigua'],
    brewingMethod: 'Pour-over, Chemex, V60',
    story: 'Grown in the volcanic soil of the Antigua Valley, this coffee develops a unique complexity from the region\'s rich minerals and climate.'
  },
  {
    id: '5',
    name: 'Cold Brew Blend',
    description: 'Smooth, low-acid cold brew with notes of chocolate and nuts. Perfect for hot summer days.',
    shortDescription: 'Smooth, low-acid cold brew with notes of chocolate and nuts.',
    price: 22.50,
    category: 'cold',
    origin: 'Blend',
    roast: 'medium',
    rating: 4.5,
    image: '/images/coffee-cold-brew.jpg',
    altitude: 'Various',
    process: 'Blend',
    tastingNotes: ['Chocolate', 'Nuts', 'Vanilla', 'Caramel'],
    caffeine: 'High',
    acidity: 'Low',
    body: 'Medium',
    ingredients: ['Arabica Beans', 'Robusta Beans', 'Natural Flavors'],
    brewingMethod: 'Cold Brew, Iced Coffee',
    story: 'Our signature cold brew blend is specially crafted to extract the best flavors during the cold brewing process, resulting in a smooth, refreshing coffee experience.'
  },
  {
    id: '6',
    name: 'Blue Mountain Jamaica',
    description: 'Premium coffee with mild flavor and bright acidity. Known for its smooth, balanced profile.',
    shortDescription: 'Premium coffee with mild flavor and bright acidity.',
    price: 45.00,
    category: 'specialty',
    origin: 'Jamaica',
    roast: 'medium',
    rating: 4.9,
    isPopular: true,
    image: '/images/coffee-blue-mountain.jpg',
    altitude: '3,000 - 5,500ft',
    process: 'Washed',
    tastingNotes: ['Mild', 'Bright', 'Clean', 'Sweet'],
    caffeine: 'Medium',
    acidity: 'Bright',
    body: 'Medium',
    ingredients: ['100% Arabica Beans', 'Jamaica Blue Mountain'],
    brewingMethod: 'Pour-over, French Press, Espresso',
    story: 'One of the world\'s most prestigious coffees, Blue Mountain Jamaica is grown in the misty peaks of the Blue Mountains, producing a coffee of exceptional quality and rarity.'
  },
  {
    id: '7',
    name: 'Brazil Santos',
    description: 'Nutty, sweet flavor with low acidity. Perfect for espresso blends and dark roasts.',
    shortDescription: 'Nutty, sweet flavor with low acidity.',
    price: 15.99,
    category: 'espresso',
    origin: 'Brazil',
    roast: 'dark',
    rating: 4.4,
    image: '/images/coffee-brazil.jpg',
    altitude: '800 - 1,600m',
    process: 'Natural',
    tastingNotes: ['Nuts', 'Sweet', 'Chocolate', 'Caramel'],
    caffeine: 'Medium',
    acidity: 'Low',
    body: 'Full',
    ingredients: ['100% Arabica Beans', 'Brazil Santos'],
    brewingMethod: 'Espresso, Moka Pot, Drip Coffee',
    story: 'Brazil Santos is the foundation of many espresso blends, providing a solid base with its nutty sweetness and low acidity.'
  },
  {
    id: '8',
    name: 'Kenya AA',
    description: 'Bright, wine-like acidity with notes of black currant and tomato. Complex and full-bodied.',
    shortDescription: 'Bright, wine-like acidity with notes of black currant and tomato.',
    price: 24.99,
    category: 'filter',
    origin: 'Kenya',
    roast: 'light',
    rating: 4.8,
    isNew: true,
    image: '/images/coffee-kenya.jpg',
    altitude: '1,400 - 2,000m',
    process: 'Washed',
    tastingNotes: ['Black Currant', 'Tomato', 'Wine', 'Citrus'],
    caffeine: 'High',
    acidity: 'Bright',
    body: 'Full',
    ingredients: ['100% Arabica Beans', 'Kenya AA'],
    brewingMethod: 'Pour-over, Chemex, V60',
    story: 'Kenya AA represents the highest grade of Kenyan coffee, known for its distinctive wine-like acidity and complex flavor profile that coffee connoisseurs love.'
  }
]

const categories = [
  { id: 'all', name: 'All Coffees', icon: Coffee },
  { id: 'espresso', name: 'Espresso', icon: Coffee },
  { id: 'filter', name: 'Filter', icon: Coffee },
  { id: 'cold', name: 'Cold Brew', icon: Coffee },
  { id: 'specialty', name: 'Specialty', icon: Coffee }
]

const roastLevels = [
  { id: 'all', name: 'All Roasts', color: 'bg-gray-500' },
  { id: 'light', name: 'Light', color: 'bg-amber-300' },
  { id: 'medium', name: 'Medium', color: 'bg-amber-600' },
  { id: 'dark', name: 'Dark', color: 'bg-amber-900' }
]

export default function BrowseCoffee() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRoast, setSelectedRoast] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeItem | null>(null)

  const filteredCoffees = coffeeMenu.filter(coffee => {
    const matchesCategory = selectedCategory === 'all' || coffee.category === selectedCategory
    const matchesRoast = selectedRoast === 'all' || coffee.roast === selectedRoast
    const matchesSearch = coffee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coffee.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coffee.origin.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesRoast && matchesSearch
  })

  const getRoastColor = (roast: string) => {
    switch (roast) {
      case 'light': return 'bg-amber-300'
      case 'medium': return 'bg-amber-600'
      case 'dark': return 'bg-amber-900'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'espresso': return '☕'
      case 'filter': return '🫖'
      case 'cold': return '🧊'
      case 'specialty': return '⭐'
      default: return '☕'
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
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Coffee className="h-20 w-20 mx-auto text-white/40 mb-4" />
            </motion.div>
            <motion.h1 
              className="text-5xl font-light tracking-wide mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Coffee Gallery
            </motion.h1>
            <motion.p 
              className="text-xl text-white/60 font-light max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Explore our curated collection of premium coffee beans. Click on any coffee to discover its story, 
              tasting notes, and brewing recommendations.
            </motion.p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search coffees, origins, or flavors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 transition-all duration-200"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id 
                        ? 'bg-white text-black hover:bg-white/90' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    } transition-all duration-200`}
                  >
                    <span className="mr-2">{getCategoryIcon(category.id)}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Roast Level Filters */}
            <div className="mt-6 flex flex-wrap gap-2">
              {roastLevels.map((roast) => (
                <Button
                  key={roast.id}
                  variant={selectedRoast === roast.id ? "default" : "outline"}
                  onClick={() => setSelectedRoast(roast.id)}
                  className={`${
                    selectedRoast === roast.id 
                      ? 'bg-white text-black hover:bg-white/90' 
                      : 'border-white/20 text-white hover:bg-white/10'
                  } transition-all duration-200`}
                >
                  {roast.id !== 'all' && (
                    <div className={`w-3 h-3 rounded-full mr-2 ${roast.color}`} />
                  )}
                  {roast.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Coffee Gallery Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredCoffees.map((coffee, index) => (
              <motion.div
                key={coffee.id}
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
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
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
                    <MapPin className="h-4 w-4" />
                    <span>Visit our cafe</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <Phone className="h-4 w-4" />
                    <span>Call (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <Clock className="h-4 w-4" />
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
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span className="text-white/60 text-sm">Origin</span>
                        </div>
                        <p className="text-white font-medium">{selectedCoffee.origin}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Thermometer className="h-4 w-4 text-orange-400" />
                          <span className="text-white/60 text-sm">Altitude</span>
                        </div>
                        <p className="text-white font-medium">{selectedCoffee.altitude}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Leaf className="h-4 w-4 text-green-400" />
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
                      <Badge key={index} className="bg-white/10 text-white border-white/20">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Coffee Characteristics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-white/60 text-sm">Caffeine</span>
                    </div>
                    <p className="text-white font-medium">{selectedCoffee.caffeine}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-400" />
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
