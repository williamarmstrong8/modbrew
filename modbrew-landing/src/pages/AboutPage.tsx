import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Navigation from '../components/layout/Navigation'
import { Separator } from '../components/ui/separator'
import { Button } from '../components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

const aboutImages = [
  { src: '/images/about-1.JPG', alt: 'ModBrew' },
  { src: '/images/about-2.JPG', alt: 'ModBrew' },
  { src: '/images/about-3.jpeg', alt: 'ModBrew' },
  { src: '/images/about-4.jpg', alt: 'ModBrew' },
  { src: '/images/about-5.jpeg', alt: 'ModBrew' }
]

export default function AboutPage() {
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
            className="text-center mb-8 sm:mb-16"
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
              <div className="block sm:hidden mb-6 py-4 overflow-visible relative">
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
              <div className="hidden sm:flex justify-center gap-4 mb-6 flex-wrap">
                {aboutImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image.src} 
                    alt={image.alt} 
                    className="w-48 h-auto rounded-lg object-cover"
                  />
                ))}
              </div>
              <h2 className="text-3xl font-light text-white mb-4">Our Story</h2>
              <div className="space-y-4 text-white/80 font-light leading-relaxed">
                <p>
                  ModBrew was born from a passion for exceptional coffee and a desire to create a 
                  community around the craft. We believe that great coffee is more than just a drink—it's 
                  an experience that brings people together.
                </p>
                <p>
                  Our commitment is to source the finest beans, perfect our brewing techniques, and 
                  share our love of coffee with a community of enthusiasts who appreciate quality, 
                  artistry, and the ritual of a perfect cup.
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
                  To provide our community with exceptional coffee experiences while fostering 
                  connections and appreciation for the craft. We're dedicated to quality, 
                  sustainability, and creating a space where coffee lovers can come together.
                </p>
                <p>
                  Through our membership program, exclusive events, and carefully curated products, 
                  we aim to build a community that celebrates the art and science of coffee.
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
                  to access exclusive content, events, and products.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

