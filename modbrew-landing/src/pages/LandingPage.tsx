import Navigation from '../components/layout/Navigation'
import HeroSection from '../components/sections/home/HeroSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
    </div>
  )
}
