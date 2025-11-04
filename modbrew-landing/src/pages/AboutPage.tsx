import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import { Separator } from '../components/ui/separator'
import { Button } from '../components/ui/button'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

const aboutImages = [
  { src: '/images/about-1.JPG', alt: 'ModBrew' },
  { src: '/images/about-2.JPG', alt: 'ModBrew' },
  { src: '/images/about-3.jpeg', alt: 'ModBrew' },
  { src: '/images/about-4.jpg', alt: 'ModBrew' },
  { src: '/images/about-5.jpeg', alt: 'ModBrew' }
]

export default function AboutPage() {
  const navigate = useNavigate()
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    slidesToScroll: 1,
    align: 'center',
    containScroll: 'trimSnaps',
    loop: true,
    dragFree: false,
    watchDrag: false
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])
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
      <div className="relative pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-10"
          >
            <h1 className="text-5xl font-light tracking-wide mb-4">About ModBrew</h1>
            <p className="text-xl text-white/60 font-light max-w-2xl mx-auto">
              Crafting exceptional coffee experiences for our community
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Mobile Carousel */}
              <div className="block sm:hidden mb-10 py-4 overflow-visible relative">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex py-4">
                    {aboutImages.map((image, index) => {
                      const isCenter = index === selectedIndex
                      return (
                        <div key={index} className="flex-[0_0_33.333%] min-w-0 px-1">
                          <div 
                            className={`transition-all duration-300 ${
                              isCenter ? 'scale-110 z-10' : 'scale-95 opacity-70'
                            }`}
                          >
                            <img 
                              src={image.src} 
                              alt={image.alt} 
                              className="w-full h-auto rounded-lg object-cover"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  onClick={scrollPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-white h-10 w-10 rounded-full p-0 z-20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={scrollNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-white h-10 w-10 rounded-full p-0 z-20"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Desktop Grid */}
              <div className="hidden sm:flex justify-center gap-4 mb-10 flex-wrap">
                {aboutImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image.src} 
                    alt={image.alt} 
                    className="w-48 h-auto rounded-lg object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                  />
                ))}
              </div>
              <h2 className="text-3xl font-light text-white mb-4">Our Story</h2>
              <div className="space-y-4 text-white/80 font-light leading-relaxed">
                <p>
                  ModBrew started from our love for quality coffee. It began as a little coffee operation 
                  out of a college dorm and evolved into a campus wide community movement. People from all 
                  ages all around Boston College started raving about ModBrew, and lines and members grew rapidly.
                </p>
                <p>
                  What made ModBrew special wasn't just the coffee, it was the community. People would come 
                  for the coffee and stay for the new friends made. This community first approach became 
                  the heart of everything we do.
                </p>
                <p>
                  Boston College loved the initiative so much that ModBrew evolved to become fully funded 
                  by the university. Now, coffee is free for all students, funded by Boston College, 
                  allowing us to continue serving quality coffee and building community across campus.
                </p>
              </div>
            </motion.div>

            <Separator className="bg-white/10" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl font-light text-white mb-4">Our Mission</h2>
              <div className="space-y-4 text-white/80 font-light leading-relaxed">
                <p>
                  Our mission is to serve quality coffee to BC students and provide both exceptional 
                  coffee and a strong sense of community. Community is huge for us, it's the reason we 
                  started this in the first place.
                </p>
                <p>
                  We believe that coffee brings people together. Students come for the coffee and stay 
                  for the connections, conversations, and friendships that form around every cup. Through 
                  our commitment to quality and community, we're building a space where everyone belongs.
                </p>
              </div>
            </motion.div>

            <Separator className="bg-white/10" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-light text-white mb-4">Join Us</h2>
              <div className="space-y-4 text-white/80 font-light leading-relaxed">
                <p>
                  Become part of the ModBrew community. Whether you're a casual coffee drinker or 
                  a dedicated enthusiast, there's a place for you here. Join our membership program 
                  to access exclusive content, events, and products, and be part of the movement that 
                  started in a dorm room and became a campus wide community.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-8 sm:p-12 max-w-2xl mx-auto">
              <h2 className="text-3xl font-light text-white mb-4">Ready to Join the Community?</h2>
              <p className="text-white/60 font-light text-lg mb-8">
                Become a member and be part of the ModBrew movement. Access exclusive content, events, and products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/store')}
                  className="bg-white text-black hover:bg-white/90 transition-all duration-200 h-12 text-lg"
                >
                  Visit Store
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  onClick={() => navigate('/auth?mode=signup')}
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white transition-all duration-200 h-12 text-lg"
                >
                  Sign Up
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

