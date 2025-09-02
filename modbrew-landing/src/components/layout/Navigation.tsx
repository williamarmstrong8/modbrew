import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/20 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    >
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="flex justify-center items-center h-16 sm:h-20">
          <motion.div 
            className="flex items-center space-x-3 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              <Button asChild variant="ghost" className="font-medium tracking-wide text-white hover:bg-transparent hover:text-white group text-sm sm:text-base">
                <a href="/gallery" className="relative">
                  Gallery
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-600 group-hover:w-full"></span>
                </a>
              </Button>
            </motion.div>
            
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
              className="mx-4 sm:mx-8"
            >
              <a href="/" className="cursor-pointer">
                <img 
                  src="/images/Mod Brew SMall White.png" 
                  alt="ModBrew" 
                  className="h-6 w-auto sm:h-8 opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </a>
            </motion.div>
            
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              >
                <Button asChild variant="ghost" className="font-medium tracking-wide text-white hover:bg-transparent hover:text-white group text-sm sm:text-base">
                  <a href="/brewery" className="relative">
                    Brewery
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-600 group-hover:w-full"></span>
                  </a>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              >
                <Button asChild variant="ghost" className="font-medium tracking-wide text-white hover:bg-transparent hover:text-white group text-sm sm:text-base">
                  <a href="/auth" className="relative">
                    Brewery
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
