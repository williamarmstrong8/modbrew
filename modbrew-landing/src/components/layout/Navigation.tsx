import { Button } from '../ui/button'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/20 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="w-full px-24">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <a href="/" className="cursor-pointer">
              <img 
                src="/images/Mod Brew Long.png" 
                alt="ModBrew" 
                className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <Button asChild variant="ghost" className={`transition-colors duration-300 font-light tracking-wide ${
              isScrolled 
                ? 'text-white/80 hover:text-white' 
                : 'text-white/80 hover:text-white'
            }`}>
              <a href="/gallery">Gallery</a>
            </Button>
            <Button asChild className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-light tracking-wide">
              <a href="/admin">Enter</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
