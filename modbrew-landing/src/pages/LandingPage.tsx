import Navigation from '../components/layout/Navigation'
import HeroSection from '../components/sections/home/HeroSection'
import AboutSection from '../components/sections/home/AboutSection'
import ContactSection from '../components/sections/home/ContactSection'
import Footer from '../components/layout/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
